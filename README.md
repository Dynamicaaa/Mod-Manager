# Doki Doki Mod Manager  
![Build Status](https://img.shields.io/badge/Build-Success-ffffff?logo=yarn&style=for-the-badge&color=008556&logoColor=ff0000) ![Translation Status](https://img.shields.io/badge/Translated-80%25-ffffff?logo=googletranslate&style=for-the-badge&color=ffe000&logoColor=ffffff)

Doki Doki Mod Manager is a mod manager for *Doki Doki Literature Club!*  

## Disclaimer  

This repository is a fork that maintains the original Doki Doki Mod Manager.  

## Contact  

Got any questions, suggestions, or complaints? Reach out via email:  
**CanaryZen@proton.me**  

## IP Guidelines  

Doki Doki Mod Manager is a fan work of *Doki Doki Literature Club*, as defined by Team Salvato's [IP Guidelines](http://teamsalvato.com/ip-guidelines/).  

## Download  

Builds are available on the [Releases page](https://github.com/Dynamicaaa/Mod-Manager/releases) for Windows, macOS, and Linux.  

## Debug Tools  

Enable debugging features by setting the following environment variables:  

- `DDMM_LANG_PROOF` - Adds prefixes to all localized strings.  
- `DDMM_DEVTOOLS` - Opens developer tools on launch.  
- `DDMM_INCOGNITO` - Removes the app name from the title bar to avoid judgment.  
- `DDMM_LANG` - Sets the language (refer to the `lang` folder).  
- `DDMM_DISCORD_ID` - Changes the Discord Rich Presence app ID.  

## Run From Source  

For the latest changes or to contribute, you can run Doki Doki Mod Manager from source:  

### Build Guide  

To build the project from source, follow these steps:

1. **Install required software**  
   You need the following to build the project:  
   - **Python 3.9.x**: Make sure you have Python version 3.9.x installed. You can download it from [here](https://www.python.org/downloads/release/python-3910/).  
   - **Node.js 18.x (LTS or Current)**: Make sure you have Node.js version 18.x installed (either LTS or Current). You can download it from [here](https://nodejs.org/).  
   - **Yarn**: Install Yarn, the package manager, from [here](https://yarnpkg.com/getting-started/install/).

2. **Clone the repository**  
   Clone the repository to your local machine using the following command:  
   ```bash
   git clone https://github.com/Dynamicaaa/Mod-Manager
   ```

3. **Navigate into the project directory**  
   Change into the `Mod-Manager` directory:  
   ```bash
   cd Mod-Manager
   ```

4. **Install dependencies**  
   Run the following command to install all the necessary dependencies for the project:  
   ```bash
   npm install
   ```

5. **Build the project**  
   After the dependencies are installed, you can build the project by running:  
   ```bash
   yarn global-release
   ```

Now, your build should be ready to run!

## Licenses and Acknowledgements  

Doki Doki Mod Manager is licensed under the [MIT License](LICENSE.txt). Contributions are welcomed!  

- [Sayonika assets](https://github.com/Sayo-nika/Press) licensed under [CC BY-NC-SA](https://github.com/Sayo-nika/Press/blob/master/LICENSE).  
- [7-Zip (7za.exe)](https://www.7-zip.org/) licensed under [GNU LGPL](https://www.7-zip.org/license.txt). 
