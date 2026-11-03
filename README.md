# Monokai Contrast for Pi

High-contrast Monokai-inspired dark and light themes for [Pi](https://pi.dev), checked against **Pi 1.5.0** and its published theme schema.

## Install

From this repository's directory:

```bash
pi install .
```

After these changes are published, install directly from GitHub:

```bash
pi install git:github.com/arro000/pi-monokai-contrast
```

Run `/reload`, then open `/settings` → **Theme** and select:

- `monokai-contrast` — dark
- `monokai-contrast-light` — light

The package manifest explicitly exposes both JSON files. Installing a repository without a manifest or a conventional `themes/` directory does not discover the theme at its root.

### Manual installation

Copy both files instead of installing the package (do not use both methods, which can cause duplicate theme-name collisions):

```bash
mkdir -p ~/.pi/agent/themes
cp monokai-contrast.json monokai-contrast-light.json ~/.pi/agent/themes/
```

If you use a custom `PI_CODING_AGENT_DIR`, use its `themes/` directory instead. Run `/reload`, then select a theme in `/settings`.

### Automatic light/dark switching

Merge this property into `~/.pi/agent/settings.json`, keeping existing settings:

```json
{
  "theme": "monokai-contrast-light/monokai-contrast"
}
```

Pi expects **light first, dark second** and follows the terminal's reported appearance. For a fixed theme, use either name without `/`.

### Terminal background

Pi themes color text, panels, selections and HTML exports; they do **not** set the terminal's global background. Set your terminal profile to match:

| Variant | Background | Primary text | Secondary text | Dim text |
|---|---|---|---|---|
| Dark | `#181910` | `#ffffff` | `#d0d0c8` | `#b5b5ad` |
| Light | `#ffffff` | `#24292f` | `#4f5760` | `#606770` |

Match the terminal appearance to the variant, especially when using automatic switching. Colors and contrast depend on the terminal's truecolor support and any terminal-side color adjustments.

## Palette

The dark theme preserves Monokai green, yellow, cyan, pink, purple and orange. Secondary text, thinking blocks and comments use a slightly softer gray instead of primary white; borders and dim labels use a second gray.

The light theme is inspired by [MONOKAI_HC_EXTREME](https://github.com/arro000/MONOKAI_HC_EXTREME), using its white surfaces and deeper green, ochre, magenta, purple and blue accents. Cyan is darkened further for readable text on light panels. It is an adaptation, not a one-to-one VS Code port.

Every foreground token is tested for WCAG AA contrast (at least 4.5:1) on all declared theme surfaces. This guarantee assumes the matching terminal background above.

## Troubleshooting

- **Theme missing:** run `/reload`, check the installation path and select it in `/settings`. Root-level theme JSON files require this package's manifest for package discovery.
- **Duplicate name:** remove the manually copied files if you installed the package, or remove the package if using manual installation.
- **Wrong background:** change the terminal profile too; the theme's `appearance` property does not paint the terminal canvas.
- **Still fails:** capture the exact startup or `/reload` error and your `pi --version` output.

## Development

```bash
npm ci
npm test
```

Tests check package discovery metadata, the official theme schema snapshot, variable resolution, text hierarchy and foreground contrast for both variants. `test/fixtures/theme.schema.json` is a snapshot of <https://pi.dev/schemas/theme.schema.json> matching Pi 1.5.0; refresh it when checking a newer Pi release. No runtime dependencies are needed.

## License

MIT. See [LICENSE](LICENSE).
