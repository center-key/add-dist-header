# Add Dist Header
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Adds a header comment to a file and saves it to your distribution folder_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/add-dist-header/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/add-dist-header.svg)](https://www.npmjs.com/package/add-dist-header)
[![Vulnerabilities](https://snyk.io/test/github/center-key/add-dist-header/badge.svg)](https://snyk.io/test/github/center-key/add-dist-header)
[![Build](https://github.com/center-key/add-dist-header/workflows/build/badge.svg)](https://github.com/center-key/add-dist-header/actions?query=workflow%3Abuild)

**add-dist-header** uses the `name`, `repository`, and `license` from your
project's **package.json** file to create a header comment.

Example header comment:
```javascript
//! my-app v0.3.7 ~ github:my-organization/my-app ~ MIT License
```

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
