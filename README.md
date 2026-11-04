<div align="center">
  <h1>Monokai Contrast for Pi</h1>
  <p><strong>Monokai-inspired dark and light themes for a high-contrast Pi workspace.</strong></p>

  [![npm](https://img.shields.io/npm/v/@arro000/pi-monokai-contrast)](https://www.npmjs.com/package/@arro000/pi-monokai-contrast)
  [![Publish to npm](https://github.com/arro000/pi-monokai-contrast/actions/workflows/publish.yml/badge.svg)](https://github.com/arro000/pi-monokai-contrast/actions/workflows/publish.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

## Why Monokai Contrast?

Keep Monokai's distinctive syntax colors without losing secondary text, comments or dim labels against the background. These two themes give [Pi](https://pi.dev) separate primary, secondary and dim text levels, with palettes designed for dark and light terminals.

## Highlights

- **Two complete variants** — `monokai-contrast` for dark terminals and `monokai-contrast-light` for light terminals.
- **Contrast checks** — tests require at least a 4.5:1 WCAG contrast ratio for every non-background color token on every declared theme surface.
- **Consistent styling** — colors cover Markdown, syntax highlighting, tool output, diffs, thinking indicators and HTML export backgrounds.
- **Automatic switching** — use Pi's light/dark theme pairing to follow the terminal's reported appearance.
- **Theme-only package** — two JSON files, with no extensions or runtime dependencies.

## Requirements

- A working Pi installation. The themes and bundled schema snapshot were checked against **Pi 1.5.0**; other versions are not covered by that check.
- A truecolor terminal for the intended palette, with its background set to match the selected variant. Color approximation or terminal-side adjustments can change contrast.

## Installation

Install the published npm package:

```bash
pi install npm:@arro000/pi-monokai-contrast
```

In an interactive Pi session, run `/reload`, then open `/settings` → **Theme** and select:

- **`monokai-contrast`** — dark
- **`monokai-contrast-light`** — light

Choose only one installation method to avoid duplicate theme names.

### Alternative sources

Install directly from GitHub:

```bash
pi install git:github.com/arro000/pi-monokai-contrast
```

Or, from the root of a local checkout:

```bash
pi install .
```

The package manifest explicitly exposes both root-level JSON files; keep it when installing the repository as a package.

For manual installation instead, run this from the repository root:

```bash
mkdir -p ~/.pi/agent/themes
cp monokai-contrast.json monokai-contrast-light.json ~/.pi/agent/themes/
```

If you use a custom `PI_CODING_AGENT_DIR`, copy the files into its `themes/` directory instead. Run `/reload`, then select the theme in `/settings`.

## Configuration

### Match the terminal background

Pi themes color text, panels and selections, but **do not set the terminal's global background**. Configure your terminal profile separately:

| Variant | Background | Primary text | Secondary text | Dim text |
|---|---|---|---|---|
| Dark | `#181910` | `#ffffff` | `#d0d0c8` | `#b5b5ad` |
| Light | `#ffffff` | `#24292f` | `#4f5760` | `#606770` |

The contrast checks assume these backgrounds and the unmodified theme colors. They do not establish accessibility compliance for the entire terminal interface.

### Follow light/dark appearance

Merge this property into `~/.pi/agent/settings.json`, preserving your other settings. For a custom agent directory, edit its `settings.json` instead.

```json
{
  "theme": "monokai-contrast-light/monokai-contrast"
}
```

Pi expects **light first, dark second**. Switching follows the terminal's reported appearance; the terminal profile still needs a matching background. To keep a fixed theme, use either theme name without `/`.

### Palette origins

The dark variant retains Monokai-inspired green, yellow, cyan, pink, purple and orange accents. Comments and thinking text use a softer secondary gray, while borders and dim labels use a distinct third level.

The light variant draws inspiration from [MONOKAI_HC_EXTREME](https://github.com/arro000/MONOKAI_HC_EXTREME), with white surfaces and deeper green, ochre, magenta, purple and blue accents. Cyan is darkened for readability on light panels. It is an adaptation, not a one-to-one VS Code port.

## Troubleshooting

- **Theme missing:** run `/reload`, check the installation path and reopen `/settings`. Package discovery of these root-level JSON files depends on `package.json`.
- **Duplicate theme name:** keep either the installed package or the manually copied files, not both.
- **Wrong background or poor contrast:** check the terminal profile, truecolor support and terminal-side color adjustments. The theme's `appearance` property does not paint the terminal canvas.
- **Loading error:** include the exact startup or `/reload` error and your `pi --version` output in a [bug report](https://github.com/arro000/pi-monokai-contrast/issues).

## Development

No build step is needed: Pi loads the JSON files directly. To run the tests, use Node.js and npm; the publishing workflow uses **Node.js 24**.

From the repository root:

```bash
npm ci
npm test
```

Tests validate both themes against the bundled schema, package discovery metadata, variable resolution, text hierarchy and foreground contrast across declared surfaces.

[`test/fixtures/theme.schema.json`](test/fixtures/theme.schema.json) is a snapshot of the [official Pi theme schema](https://pi.dev/schemas/theme.schema.json) matching Pi 1.5.0. Refresh and review it when checking compatibility with a newer Pi release. Ajv is a development dependency, not a theme runtime requirement.

### Create a release

The [Publish to npm workflow](.github/workflows/publish.yml) runs on `v*` tags. It checks the package identity and exact tag/version match, installs dependencies, runs tests, inspects package contents and **publishes publicly to npm with provenance**. It does not create a GitHub Release. Only stable `major.minor.patch` versions are accepted; branch pushes do not publish.

1. Update the version and lockfile from the repository root:

   ```bash
   npm version patch --no-git-tag-version
   ```

2. Review and commit the changes.
3. Push the commit and a tag matching `package.json` exactly (for example, `v1.1.1` for version `1.1.1`):

   ```bash
   git tag v1.1.1
   git push origin HEAD
   git push origin v1.1.1
   ```

Publishing requires npm authorization. For token-free trusted publishing, configure the package's npm **Settings → Trusted Publisher** for GitHub Actions: owner `arro000`, repository `pi-monokai-contrast`, workflow `publish.yml`, and no environment. Allow direct `npm publish` if prompted. The workflow already requests `id-token: write`.

The workflow also supports a bootstrap `NPM_TOKEN` repository secret. If needed, use a short-lived granular token with package write permission and an account-policy-compatible 2FA bypass. Keep tokens out of source and bug reports. After a successful trusted-publishing release, delete the secret and revoke the bootstrap token. Protect release tags and remember that published npm versions cannot be overwritten.

## Project Structure

```text
monokai-contrast.json          Dark theme
monokai-contrast-light.json    Light theme
package.json                  Package metadata and theme discovery
test/                         Schema, contrast and discovery tests
.github/workflows/publish.yml Tagged npm publication
```

## Contributing

[Open an issue](https://github.com/arro000/pi-monokai-contrast/issues) for bugs or palette suggestions, or submit a pull request. For color changes, run `npm test` and describe the affected variant and terminal setup. Contrast calculations complement, rather than replace, a visual check in Pi.

## License

[MIT](LICENSE).
