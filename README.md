# Add Dist Header
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Adds a header comment to a file and saves it to your distribution folder_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/add-dist-header/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/add-dist-header.svg)](https://www.npmjs.com/package/add-dist-header)
[![Vulnerabilities](https://snyk.io/test/github/center-key/add-dist-header/badge.svg)](https://snyk.io/test/github/center-key/add-dist-header)
[![Build](https://github.com/center-key/add-dist-header/workflows/build/badge.svg)](https://github.com/center-key/add-dist-header/actions?query=workflow%3Abuild)

**add-dist-header** uses the `name`, `homepage`, and `license` from your
project's **package.json** file to create a header comment in a build target file.

Example header comment:
```javascript
//! my-app v0.3.7 ~ https://github.com/my-organization/my-app ~ MIT License
```

This is particularly handy when your build tools are configured to remove comments, such as
setting `"removeComments": true` in **tsconfig.json**.
For a real-world example, check the files in the **dist** folder at
[w3c-html-validator](https://github.com/center-key/w3c-html-validator/tree/main/dist)

## 1) Setup

### Install
Install package for node:
```shell
$ npm install --save-dev add-dist-header
```

## 2) Usage
Call `add-dist-header` from the `"scripts"` section of your **package.json** file.

For example:
```json
   "scripts": {
      "add-headers": "add-dist-header build dist"
   },
```

Or, run from the terminal in your project home folder, such as:
```shell
$ ls package.json
package.json
$ npx add-dist-header "build" "dist"
[add-dist-header] dist/my-app.d.ts ~ length: 413
[add-dist-header] dist/my-app.js ~ length: 1569
```

The parameters are optional:
```shell
$ npx add-dist-header  #same as above since "build/*" "dist" are the default parameters
[add-dist-header] dist/my-app.d.ts ~ length: 413
[add-dist-header] dist/my-app.js ~ length: 1569
$ npx add-dist-header "target/my-app-cli.js"  #creates "dist/my-app.js" prepended with a comment header
[add-dist-header] dist/my-app-cli.js ~ length: 413
```

## 3) Version Number Substitution
In addition to prepending the header comment, **add-dist-header** also replaces all occurrences of
`~~~version~~~` with the version number found in the **package.json** file.
This enables inserting the current package version number into your distribution files.

The substitution feature can be disabled with the `--version` flag:
```json
   "scripts": {
      "add-headers": "add-dist-header --version=false build dist"
   },
```
