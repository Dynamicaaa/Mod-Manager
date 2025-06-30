# Translating Doki Doki Mod Manager

Thank you for helping localize Doki Doki Mod Manager!

## How to Add or Update a Translation

1. **Find your language file:**  
   Each language has its own `.json` file in this folder (e.g., `en-US.json`, `ru.json`).  
   If your language is missing, copy `en-US.json` and rename it to your language code (for example, `fr-FR.json` for French, `es-419.json` for Latin American Spanish, etc.).

2. **Translate:**  
   Open your language file in a text editor.  
   Only change the values (right side) of each key-value pair.  
   **Do not change the keys.**  
   Example:
   ```json
   {
     "toolbar": {
       "button_get_mods": "Get Mods",
       "button_mod_library": "Mod Library"
     }
   }
   ```

3. **Keep keys in sync:**  
   Make sure your file contains all the keys present in `en-US.json`.  
   If new features are added, new keys may appear in `en-US.json` that should be added to your translation.

4. **Validate your JSON:**  
   Ensure your file is valid JSON. You can use online tools like [jsonlint.com](https://jsonlint.com/) to check.

5. **Submit your translation:**  
   Open a Pull Request with your updated or new language file.

## Tips

- Keep translations clear and concise.
- If you see untranslated or missing strings in the app, update your language file.
- If you have questions, check `en-US.json` for context.

Thank you for contributing!
