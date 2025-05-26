# Doki Doki Mod Manager

Doki Doki Mod Manager is a mod manager for Doki Doki Literature Club! This version includes integrated Sayonika store support for seamless mod browsing and downloading.

**Maintainer:** Dynamicaaa
**Latest Version:** 5.0.0

## Features

- **Integrated Sayonika Store**: Browse and download mods directly from [Sayonika](https://sayonika.reconvial.dev)
- **Mod Management**: Install, organize, and launch DDLC mods with ease
- **Multiple Authentication**: Login with GitHub or email/password
- **Cross-Platform**: Available for Windows, macOS, and Linux
- **Modern Interface**: Clean, responsive design with DDLC theming

## IP Guidelines

Doki Doki Mod Manager is a fan work of Doki Doki Literature Club, as defined by Team Salvato's [IP Guidelines](http://teamsalvato.com/ip-guidelines/).

## Download

Builds are available on the [Releases page](https://github.com/Dynamicaaa/Mod-Manager/releases) for Windows, macOS and Linux.

## Sayonika Integration

This version of DDMM includes full integration with the Sayonika mod store at [https://sayonika.reconvial.dev](https://sayonika.reconvial.dev). Features include:

- Browse and search thousands of DDLC mods
- One-click mod downloads and installation
- User authentication and profiles
- Mod ratings and reviews
- Category filtering and sorting

## Debug Tools

Set the following environment variables to enable debugging features:

* `DDMM_LANG_PROOF` - adds prefixes to all localised strings
* `DDMM_DEVTOOLS` - opens devtools on launch
* `DDMM_INCOGNITO` - removes app name from titlebar
* `DDMM_LANG` - sets the language, see the `lang` folder

## Run from Source

For the latest changes, or if you want to contribute, you can run DDMM from source:

```bash
$ git clone https://github.com/Dynamicaaa/Mod-Manager
$ cd Mod-Manager
$ npm install
$ npm start
```

## CSS Development

DDMM uses SCSS for styling. The CSS build system automatically compiles SCSS files to CSS.

### CSS Build Commands

```bash
# Build CSS once (development)
$ npm run build-css
$ npm run build-css-once
$ npm run rebuild-css

# Build CSS for production (compressed)
$ npm run build-css-prod

# Watch for SCSS changes and auto-rebuild
$ npm run build-css-watch

# Using the rebuild utility directly
$ node rebuild-css.js
$ node rebuild-css.js --production
$ node rebuild-css.js --watch
```

### CSS File Structure

- `src/renderer/css/app.scss` - Main application styles
- `src/renderer/css/fonts.scss` - Font definitions
- `src/renderer/css/sayonika-store.css` - Sayonika integration styles

The build process compiles `.scss` files to `.css` files in the same directory.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For support and bug reports, please create an issue on the [GitHub repository](https://github.com/Dynamicaaa/Mod-Manager/issues/new).

## Licenses and Acknowledgements

Doki Doki Mod Manager is licensed under the [MIT License](LICENSE.txt). Contributions are welcomed!

[7-Zip (7za.exe)](https://www.7-zip.org/) licensed under [GNU LGPL](https://www.7-zip.org/license.txt).