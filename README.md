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

After the first npm release, you can also install with:

```bash
pi install npm:@arro000/pi-monokai-contrast
```

Use only one installation method to avoid duplicate theme names.

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

## Publish from GitHub

Pushing a version tag runs `.github/workflows/publish.yml`: check tag/version, install dependencies, run tests, inspect package contents, and publish **`@arro000/pi-monokai-contrast`** publicly on npm with provenance. The tag must exactly match `package.json` (for example `v1.1.0`). Stable versions only; pushing a branch does not publish.

### First publication (one-time bootstrap)

1. Ensure your npm account owns the `arro000` scope and can publish public packages. Keep the GitHub repository public for provenance.
2. On npm, create a short-lived **granular access token**, with read/write package permissions covering the new package in the `@arro000` scope. For unattended publishing, enable **Bypass 2FA** if your account policy permits it. A read-only token cannot publish.
3. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Name it **`NPM_TOKEN`** and paste the token there. Never put it in source, issues, or chat.
4. Commit and push the workflow, package manifest, and lockfile. Create and push the first tag:

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

5. Watch the **Publish to npm** run in GitHub Actions. No local `npm publish` is needed. If a run fails, fix the cause before publishing another version; npm versions cannot be overwritten.

### Switch to token-free trusted publishing

Once the package exists, open its npm **Settings → Trusted Publisher**, choose **GitHub Actions**, and configure:

| Field | Value |
|---|---|
| Organization or user | `arro000` |
| Repository | `pi-monokai-contrast` |
| Workflow filename | `publish.yml` |
| Environment | Leave empty |

If npm asks for allowed actions, enable direct **`npm publish`**. The workflow already requests `id-token: write` and uses a compatible npm CLI on a GitHub-hosted runner. After a successful OIDC release, delete the GitHub `NPM_TOKEN` secret and revoke the bootstrap token on npm. Future releases use short-lived credentials, not a stored npm token.

### Subsequent releases

Update the version and lockfile, commit the changes, then push the matching tag. For example:

```bash
npm version patch --no-git-tag-version
# Review and commit package.json and package-lock.json first.
git tag v1.1.1
git push origin HEAD
git push origin v1.1.1
```

Protect release tags in GitHub so only trusted maintainers can trigger publication. The existing `pi-package` keyword makes the published npm package eligible for Pi Packages discovery; indexing may not be immediate.

## License

MIT. See [LICENSE](LICENSE).
