# Add Dist Header
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Prepend a one-line banner comment (with license notice) to distribution files_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/add-dist-header/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/add-dist-header.svg)](https://www.npmjs.com/package/add-dist-header)
[![Build](https://github.com/center-key/add-dist-header/workflows/build/badge.svg)](https://github.com/center-key/add-dist-header/actions/workflows/run-spec-on-push.yaml)

**add-dist-header** uses the `name`, `homepage`, and `license` from your project's **package.json**
file to create a header comment and prepend it to a build file.

<img src=https://raw.githubusercontent.com/center-key/add-dist-header/main/screenshot.png
width=800 alt=screenshot>

Example header comment for a **.js** file:
```javascript
//! my-app v3.1.4 ~~ https://github.com/my-org/my-app ~~ MIT License
```
Example header comment for a **.css** file:
```javascript
/*! my-app v3.1.4 ~~ https://github.com/my-org/my-app ~~ MIT License */
```

Automatically prepending headers to distribution files is particularly handy when your build
tools are configured to remove comments (such as if `"removeComments": true` in set
in **tsconfig.json**).
For a real-world example, see the files in the **dist** folder at
[w3c-html-validator](https://github.com/center-key/w3c-html-validator/tree/main/dist)

## A) Setup
Install package for node:
```shell
$ npm install --save-dev add-dist-header
```

## B) Usage
### 1. npm scripts
Run `dist-header` from the `"scripts"` section of your **package.json** file.

Parameters:
* The **first** parameter is the *source* file (defaults to `"build/*"`).
* The **second** parameter is the *output* folder (defaults to `"dist"`).

Example **package.json** script:
```json
   "scripts": {
      "add-headers": "add-dist-header build dist"
   },
```

### 2. Global
You can install **add-dist-header** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global add-dist-header
$ add-dist-header "build" "dist"
[17:13:50] add-dist-header build/my-app.d.ts --> dist/my-app.d.ts (413.11 KB)
[17:13:51] add-dist-header build/my-app.js --> dist/my-app.js (1,569.70 KB)
```

The parameters are optional:
```shell
$ add-dist-header  #same as above since "build/*" "dist" are the default parameter values
[17:13:50] add-dist-header build/my-app.d.ts --> dist/my-app.d.ts (413.11 KB)
[17:13:51] add-dist-header build/my-app.js --> dist/my-app.js (1,569.70 KB)
$ add-dist-header "meta/config.js"  #creates "dist/config.js" prepended with header
[17:15:03] add-dist-header meta/config.js --> dist/config.js (3.91 KB)
```

### 3. CLI flags
Command-line flags:
| Flag           | Description                                               | Values     | Default |
| -------------- | --------------------------------------------------------- | ---------- | ------- |
| `--delimiter`  | Characters separating the parts of the header<br>comment. | **string** | `~~`    |
| `--ext`        | Filter files by file extension, such as `.js`.<br>Use a comma to specify multiple extensions. | **string** | N/A     |
| `--keep-first` | Do not delete the original first line comment.            | N/A        | N/A     |
| `--no-version` | Do not substitute occurrences of `{{pkg.version}}`<br>with the **package.json** version number. | N/A | N/A |
| `--note`       | Place to add a comment only for humans.                   | **string** | N/A     |
| `--quiet`      | Suppress informational messages.                          | N/A        | N/A     |
| `--recursive`  | Include subfolders for the source folder.                 | N/A        | N/A     |

#### Version number substitution:
In addition to prepending the header comment, **add-dist-header** also replaces all occurrences of
`{{pkg.version}}` in each file with the version number found in **package.json**.
This enables inserting the current package version number into your distribution files.

The substitution feature is disabled with the `--no-version` flag.

Examples:
   - `add-dist-header build/minimized dist`<br>
   Copy the files in the **build/minimized** folder to the **dist** folder and add comment headers.

   - `add-dist-header build dist --no-version --delimiter=🔥`<br>
   Add comment headers but do not substitute the version number and use "🔥" as the separator in the header comment instead of "~~".

   - `add-dist-header build dist --ext=.js,.css --recursive`<br>
   Process only JavaScript and CSS files in the **build** folder and its subfolders.

## C) Application Code
Even though **add-dist-header** is primarily intended for build scripts, the package can easily be used programmatically in ESM and TypeScript projects.

Example:
``` typescript
import { addDistHeader } from 'add-dist-header';

const options = {
   dist:      'dist',
   delimiter: '🚀🚀🚀',
   };
const result = addDistHeader.prepend('build/rocket.js', options);
console.log('The size of the new file is:', result.size);
```

See the **TypeScript Declarations** at the top of [add-dist-header.ts](add-dist-header.ts) for documentation.

<br>

---
**CLI Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [copy-folder-util](https://github.com/center-key/copy-folder-util):&nbsp; _Recursively copy files from one folder to another folder_
   - 🔍 [replacer-util](https://github.com/center-key/replacer-util):&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [run-scripts-util](https://github.com/center-key/run-scripts-util):&nbsp; _Organize npm scripts into named groups of easy to manage commands_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/add-dist-header/issues](https://github.com/center-key/add-dist-header/issues)

[MIT License](LICENSE.txt)
