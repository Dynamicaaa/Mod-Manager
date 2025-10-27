# GitHub Actions Workflows

This directory contains GitHub Actions workflows for building, testing, and releasing the Doki Doki Mod Manager across multiple platforms.

## Workflows

### 1. CI Build ([`ci.yml`](ci.yml))
**Trigger**: Push to `main` or `develop` branches, and pull requests

**Purpose**: Continuous integration testing and building

**Jobs**:
- **Test**: Runs the test suite on Ubuntu
- **Build Windows**: Builds and packages for Windows (x64, ia32)
- **Build macOS**: Builds and packages for macOS (x64, arm64)
- **Build Linux**: Builds and packages for Linux (AppImage, DEB, TAR.GZ)

**Artifacts**: Short-term storage (7 days) of build artifacts for CI validation

### 2. Build ([`build.yml`](build.yml))
**Trigger**: Push to `main` or `develop` branches, pull requests, and releases

**Purpose**: Comprehensive build pipeline

**Jobs**:
- **Test**: Runs the test suite on Ubuntu
- **Build Windows**: Builds Windows installer and portable versions
- **Build macOS**: Builds macOS DMG and ZIP packages
- **Build Linux**: Builds Linux AppImage, DEB, and TAR.GZ packages
- **Release**: Builds all platforms and stores artifacts (no automatic upload to GitHub releases)

**Artifacts**: Long-term storage (30-90 days) of build artifacts

### 3. Release ([`release.yml`](release.yml))
**Trigger**: GitHub release creation/publishing

**Purpose**: Dedicated release workflow for building production artifacts

**Jobs**:
- **Test**: Runs the test suite on Ubuntu
- **Build Windows**: Builds Windows packages
- **Build macOS**: Builds macOS packages
- **Build Linux**: Builds Linux packages
- **Build All Platforms**: Builds for all platforms and stores artifacts (manual upload required)

**Note**: This workflow builds the artifacts but does not automatically upload them to GitHub releases. You can download the artifacts from the workflow run and manually upload them to releases as needed.

## Build Process

Each workflow follows this general process:

1. **Checkout Code**: Gets the latest code from the repository
2. **Setup Node.js**: Installs Node.js 18 and caches npm dependencies
3. **Install Dependencies**: Runs `npm ci` for clean dependency installation
4. **Build Application**: Runs `npm run build` which:
   - Cleans the build directory
   - Compiles SCSS to CSS
   - Compiles TypeScript to JavaScript
   - Copies assets to the lib directory
5. **Package Application**: Uses electron-builder to create platform-specific packages
6. **Upload Artifacts**: Stores build artifacts for download

## Platform-Specific Builds

### Windows
- **Installer**: NSIS installer (`.exe`)
- **Portable**: Portable executable (`.exe`)
- **Architectures**: x64, ia32

### macOS
- **Installer**: DMG disk image (`.dmg`)
- **Archive**: ZIP archive (`.zip`)
- **Architectures**: x64, arm64
- **Security**: Hardened runtime, entitlements configured

### Linux
- **AppImage**: Universal Linux package (`.AppImage`)
- **Debian**: DEB package for Debian/Ubuntu (`.deb`)
- **Archive**: TAR.GZ archive (`.tar.gz`)
- **Architecture**: x64

## Usage

### For Development
The CI workflow automatically runs on every push and pull request, ensuring code quality and successful builds across all platforms.

### For Releases
1. Create a new release in GitHub
2. The release workflow will automatically:
   - Run tests
   - Build for all platforms
   - Store all artifacts (you can download them from the workflow run)
3. Manually download the artifacts and upload them to your GitHub release
4. Users can then download the appropriate installer for their platform from the release page

## Configuration

The build configuration is primarily controlled by:
- [`package.json`](../../package.json) - Contains electron-builder configuration
- [`tsconfig.json`](../../tsconfig.json) - TypeScript compilation settings
- Build scripts in [`package.json`](../../package.json) scripts section

## Troubleshooting

### Common Issues
1. **Build failures**: Check the workflow logs for specific error messages
2. **Missing artifacts**: Ensure the build completed successfully and check artifact retention settings
3. **Release upload failures**: Verify GitHub token permissions and release creation

### Build Requirements
- Node.js 18+
- npm 8+
- Platform-specific build tools (handled by GitHub Actions runners)

## Security

- All workflows use the latest stable versions of GitHub Actions
- Dependencies are cached for faster builds
- Artifacts are stored with appropriate retention policies
- Release uploads require proper GitHub token permissions