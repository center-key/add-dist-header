# Add Dist Header
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Prepend a one-line banner comment (with license notice) to distribution files_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/add-dist-header/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/add-dist-header.svg)](https://www.npmjs.com/package/add-dist-header)
[![Vulnerabilities](https://snyk.io/test/github/center-key/add-dist-header/badge.svg)](https://snyk.io/test/github/center-key/add-dist-header)
[![Build](https://github.com/center-key/add-dist-header/workflows/build/badge.svg)](https://github.com/center-key/add-dist-header/actions/workflows/run-spec-on-push.yaml)

**add-dist-header** uses the `name`, `homepage`, and `license` from your project's **package.json**
file to create a header comment and prepend it to a build file.

<img src=https://raw.githubusercontent.com/center-key/add-dist-header/main/screenshot.png
width=800 alt=screenshot>

Example header comment for a **.js** file:
```javascript
//! my-app v0.3.7 ~~ https://github.com/my-org/my-app ~~ MIT License
```
Example header comment for a **.css** file:
```javascript
/*! my-app v0.3.7 ~~ https://github.com/my-org/my-app ~~ MIT License */
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

The **first** parameter is the *source* file (defaults to `"build/*"`).
The **second** parameter is the *output* folder (defaults to `"dist"`).

Example **package.json** script:
```json
   "scripts": {
      "add-headers": "dist-header build dist"
   },
```
Try out the first script with the command: `npm run make-dist`

### 2. Global
You can install **add-dist-header** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global add-dist-header
$ dist-header "build" "dist"
[17:13:50] dist-header build/my-app.d.ts --> dist/my-app.d.ts (413.11 KB)
[17:13:51] dist-header build/my-app.js --> dist/my-app.js (1,569.70 KB)
```

The parameters are optional:
```shell
$ dist-header  #same as above since "build/*" "dist" are the default parameter values
[17:13:50] dist-header build/my-app.d.ts --> dist/my-app.d.ts (413.11 KB)
[17:13:51] dist-header build/my-app.js --> dist/my-app.js (1,569.70 KB)
$ dist-header "meta/config.js"  #creates "dist/config.js" prepended with header
[17:15:03] dist-header meta/config.js --> dist/config.js (3.91 KB)
```

### 3. CLI Flags
const validFlags =  ['delimiter', 'keep', 'no-version', 'quiet'];

Command-line flags:
| Flag           | Description                                               | Values     | Default |
| -------------- | --------------------------------------------------------- | ---------- | ------- |
| `--delimiter`  | Characters separating the parts<br>of the header comment. | **string** | `~~`    |
| `--keep`       | Do not delete the original first line<br>comment.         | N/A        | N/A     |
| `--no-version` | Do not substitute occurrences of `~~~version~~~`<br>with the **package.json** version number. | N/A | N/A |
| `--quiet`      | Suppress informational messages.                          | N/A        | N/A     |

#### Version Number Substitution:
In addition to prepending the header comment, **add-dist-header** also replaces all occurrences of
`~~~version~~~` in each file with the version number found in **package.json**.
This enables inserting the current package version number into your distribution files.

The substitution feature is disabled by setting `--version` flag to `false`:

Examples:
   - `dist-header temp dist --delimiter=🔥` &nbsp; Use "🔥" as the separator instead of "~~".
   - `dist-header --no-version build dist`  &nbsp; Add headers but do not subsitute the version number.

## C) Application Code
Even though **add-dist-header** is primarily intended for build scripts, the package can easily be used in ESM and TypeScript projects.

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
**Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file (CLI tool designed for use in npm scripts)_
   - 📂 [copy-folder-cli](https://github.com/center-key/copy-folder-cli):&nbsp; _Recursively copy a folder (CLI tool designed for use in npm scripts)_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/add-dist-header/issues](https://github.com/center-key/add-dist-header/issues)

[MIT License](LICENSE.txt)
