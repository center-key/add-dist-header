# Add Dist Header
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Adds a header comment to a file and saves it to your distribution folder_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/add-dist-header/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/add-dist-header.svg)](https://www.npmjs.com/package/add-dist-header)
[![Vulnerabilities](https://snyk.io/test/github/center-key/add-dist-header/badge.svg)](https://snyk.io/test/github/center-key/add-dist-header)
[![Build](https://github.com/center-key/add-dist-header/workflows/build/badge.svg)](https://github.com/center-key/add-dist-header/actions?query=workflow%3Abuild)

**add-dist-header** uses the `name`, `homepage`, and `license` from your project's **package.json**
file to create a header comment and prepend it to a build file.

Example header comment:
```javascript
//! my-app v0.3.7 ~ https://github.com/my-organization/my-app ~ MIT License
```

Automatically prepending headers to distribution files is particularly handy when your build
tools are configured to remove comments (such as if `"removeComments": true` in set
in **tsconfig.json**).
For a real-world example, see the files in the **dist** folder at
[w3c-html-validator](https://github.com/center-key/w3c-html-validator/tree/main/dist)

## 1) Setup

### Install
Install package for node:
```shell
$ npm install --save-dev add-dist-header
```

## 2) Usage
Call `add-dist-header` from the `"scripts"` section of your **package.json** file.

The **first** parameter is the *source* file (defaults to `"build/*"`).
The **second** parameter is the *output* folder (defaults to `"dist"`).

Example **package.json** script:
```json
   "scripts": {
      "add-headers": "add-dist-header build dist"
   },
```

Alternatively, you can run **add-dist-header** directly from the terminal in your project home
folder.

Example terminal command:
```shell
$ ls package.json
package.json
$ npx add-dist-header "build" "dist"
[17:13:50] add-dist-header dist/my-app.d.ts 413.11 kB
[17:13:51] add-dist-header dist/my-app.js 1,569.70 kB
```

The parameters are optional:
```shell
$ npx add-dist-header  #same as above since "build/*" "dist" are the default parameter values
[17:13:50] add-dist-header dist/my-app.d.ts 413.11 kB
[17:13:51] add-dist-header dist/my-app.js 1,569.70 kB
$ npx add-dist-header "meta/config.js"  #creates "dist/config.js" prepended with a comment header
[17:15:03] add-dist-header dist/config.js 3.91 kB
```

## 3) Version Number Substitution
In addition to prepending the header comment, **add-dist-header** also replaces all occurrences of
`~~~version~~~` with the version number found in the **package.json** file.
This enables inserting the current package version number into your distribution files.

The substitution feature is disabled by setting `--version` flag to `false`:
```json
   "scripts": {
      "add-headers": "add-dist-header --version=false build dist"
   },
```

<br>

---
[MIT License](LICENSE.txt)
