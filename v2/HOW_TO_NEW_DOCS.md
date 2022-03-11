# To create a new doc project, you will need to:
- Copy the `change_me` folder and rename it to the new docs
- Copy `@docusaurus/plugin-content-docs` that belongs to `id: "change_me"`
- Change `change_me` in that to the new docs project within that block
- If this doc will have a version, copy `docsVersionDropdown` navbar item and change `change_me` in that.
- If the github icon is not to be shown in the docs, modify `DO_NOT_SHOW_GITHUB_BUTTON` in `src/theme/NavbarItem/index.js`
- If creating a new recipe, to add the recipe label in the nav bar, edit `RECIPE_LABELS` in src > theme > Navbar > index.js to add info about the new recipe.
- If the new doc needs to be linked with older versions of the docs, then add it to the `LINK_TO_OLDER_VERSIONS` in `src/theme/NavbarItem/index.js`
- If creating a new backend SDK, then make sure to also change the website dashboard code snippets.

## Post creation
- If you are copying docs from an existing docusaurus v1 project, then:
   - Go into the new docs folder and run `for file in $(find . -name '*.md'); do mv $file $(echo "$file" | sed 's|.md|.mdx|g'); done`. This will change all `.md` to `.mdx`.
   - Do a global replace in the new docs project to fix all `COPY DOCS` paths.
      - The path should be valid
      - They should point to `.mdx` files and not `.md`
   - Edit the sidebar.json file
   - Fix any other build errors.


# To create new SDK docs (using an automatic docs generation tool and not docusaurus)
- Start by selecting an automatic docs generation tool. For example, for TypeScript based projects, we chose TypeDoc.
- Setup the tool to run on `addDevTag` (and add a commit for it during dev tag building) and also you should be able to run it manually. In the node repo, we can do so by running `npm run build-docs`. The output of this should be in one folder in the SDK repo.
   - Remember to exclude this folder from being published (to npm or pypi etc)
   - When generating these docs, remember to delete the entire folder and then generate the docs
- Test that the site works by opening the `index.html` of that site.
- Push the docs to git on that branch.
- For CICD, add a new job that runs whenever there is a push to the master branch (see job `update-docs` in node repo).
   - Make sure to change the work "nodejs" to the SDK name in the script.
   - Make sure to change the location of where the docs are copied from (in node, it's `../docs/*`)

   This will copy the generated docs into the relevant folder (`/app/docs/sdk/docs/<sdk-name>/*`) in the backend website repo, and push that change to its master branch
- Make sure to add a route in the website node server to redirect `/docs/<sdk-name>` to the `index.html` of the generated docs.
- If creating a new backend SDK, then make sure to also change the website dashboard code snippets.
- In the nodejs code for the website, we should change where all and how the version header is being injected

# To add new code type checking env
- Create a new folder in `src/plugins/codeTypeChecking/` and call it `<new_lang>Env`
   - In that folder, you want to add a `.gitignore` which contains at least `snippets` in it (see other folder's `.gitignore`)
   - You want to add all files that will allow for an env of your lang. At a minimum, you want to:
      - Specify dependencies
      - Modifies .gitignore to ignore build / auth generated files / folders
- Modify `src/plugins/codeTypeChecking/index.js` file:
   - In `addCodeSnippetToEnv` function, add an `if` block for code snippets from new language like
      ```
      } else if (currLineTrimmed === "```new_lang" || currLineTrimmed.startsWith("```new_lang ")) {
            currentCodeLanguage = "new_lang";
      }
      ```
   - Modify `addCodeSnippetToEnvHelper` to check if the `language === "new_lang"`. In the block:
      - Modify the `codeSnippet` such that the resulting code snippet is valid if put in its own file.
      - Write code to create a folder for the current code snippet in `src/plugins/codeTypeChecking/<new_lang>Env/snippets/`. Usually, the folder path is equal to the full path of the mdx file from where the code was picked. So for example, if the code is picked from `/a/file.mdx`, then it's path will be `src/plugins/codeTypeChecking/<new_lang>Env/snippets/a/file.mdx/`
      - Write code to create a file in the above path which will contain the `codeSnippet`. This file will need to have the right extension as per the new language.
   - Modify `checkCodeSnippets` to add a new if block for `new_lang`:
      - In that, you want to run a bash command that will try and compile all the code snippets that exist in the `src/plugins/codeTypeChecking/<new_lang>Env/snippets/` folder in one go. If there are any errors, it will print those out and reject the promise.
- Modify `src/plugins/copyDocsAndCodeTypeChecking.js` to:
   - Modify the block `loadContent` function which contains `// modify this block to add a new language` to add your `new_lang` just like how the other blocks function.