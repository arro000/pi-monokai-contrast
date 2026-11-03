import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { test } from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
// Snapshot of https://pi.dev/schemas/theme.schema.json, checked against Pi 1.5.0.
const validate = new Ajv2020({ allErrors: true }).compile(readJson('./fixtures/theme.schema.json'));
const manifest = readJson('../package.json');

function resolve(theme, value, seen = new Set()) {
  if (/^#[\da-f]{6}$/i.test(value)) return value;
  assert.equal(typeof value, 'string');
  assert.ok(Object.hasOwn(theme.vars, value), `Unknown variable: ${value}`);
  assert.ok(!seen.has(value), `Circular variable: ${value}`);
  return resolve(theme, theme.vars[value], new Set([...seen, value]));
}

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((channel) => {
    const c = parseInt(channel, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const backgroundTokens = new Set([
  'selectedBg', 'searchMatchBg', 'userMessageBg', 'customMessageBg',
  'toolPendingBg', 'toolSuccessBg', 'toolErrorBg', 'scrollbarTrack',
]);

for (const path of manifest.pi.themes) {
  const theme = readJson(`../${path}`);
  test(`${theme.name}: schema and package discovery`, () => {
    assert.ok(validate(theme), JSON.stringify(validate.errors, null, 2));
    assert.equal(basename(path), `${theme.name}.json`);
    assert.notEqual(theme.name, 'system');
    assert.ok(manifest.files.includes(basename(path)));
    for (const value of Object.values(theme.vars)) resolve(theme, value);
    for (const value of [...Object.values(theme.colors), ...Object.values(theme.export)]) {
      resolve(theme, value);
    }
  });

  test(`${theme.name}: foreground contrast on every theme surface`, () => {
    const surfaces = new Set([
      resolve(theme, 'background'),
      ...[...backgroundTokens].map((key) => resolve(theme, theme.colors[key])),
    ]);
    for (const [token, value] of Object.entries(theme.colors)) {
      if (backgroundTokens.has(token)) continue;
      for (const bg of surfaces) {
        const ratio = contrast(resolve(theme, value), bg);
        assert.ok(ratio >= 4.5, `${token} on ${bg}: ${ratio.toFixed(2)}:1 (expected 4.5:1)`);
      }
    }
  });

  test(`${theme.name}: primary, secondary and dim text remain distinct`, () => {
    const lightness = (token) => luminance(resolve(theme, theme.colors[token]));
    const levels = ['text', 'muted', 'dim'].map(lightness);
    if (theme.appearance === 'dark') {
      assert.ok(levels[0] > levels[1] && levels[1] > levels[2]);
    } else {
      assert.ok(levels[0] < levels[1] && levels[1] < levels[2]);
    }
    assert.equal(theme.colors.thinkingText, theme.colors.muted);
    assert.equal(theme.colors.syntaxComment, theme.colors.muted);
  });
}

test('package exposes two unique themes', () => {
  const names = manifest.pi.themes.map((path) => readJson(`../${path}`).name);
  assert.equal(names.length, 2);
  assert.equal(new Set(names).size, names.length);
});
