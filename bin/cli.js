#!/usr/bin/env node
// add-dist-header ~~ MIT License
//
// Usage in package.json:
//    "scripts": {
//       "add-headers": "add-dist-header build/*.js dist"
//    },
//
// Usage from command line:
//    $ npx add-dist-header "build" "dist"
//    $ npx add-dist-header  #same as above since "build/*" "dist" are the default parameters
//    $ npx add-dist-header "target/app.js"  #creates "dist/app.js" prepended with a comment header
//
// Contributors to this project:
//    $ cd add-dist-header
//    $ node bin/cli.js "spec/fixtures/to-kebab.js" "spec/fixtures/dist"  #run on sample file
//    $ node bin/cli.js  #update distribution files for this project

// Imports
import glob              from 'glob';
import { existsSync, statSync }      from 'fs';
import { addDistHeader } from '../dist/add-dist-header.js';

// Parameters
const args =  process.argv.slice(2);
const flags = args.filter(arg => /^-/.test(arg));
const files = args.filter(arg => !/^-/.test(arg));

// Prepend
const param = {
   filename: files[0] ?? 'build/*',
   dist:     files[1] ?? 'dist',
   };
const flagMap =    Object.fromEntries(flags.map(flag => flag.replace(/^[-]*/, '').split('=')));
const setVersion = flagMap.version !== 'false';
const isFolder =   existsSync(param.filename) && statSync(param.filename).isDirectory();
const pattern =    isFolder ? param.filename + '/*' : param.filename;
const filenames =  glob.sync(pattern, { nodir: true }).sort();
const log       =  (result) => console.log('[add-dist-header]', result.file, '~ length:', result.length);
if (!filenames.length)
   console.error('[add-dist-header] File not found:', param.filename);
filenames.forEach(file =>
   log(addDistHeader.prepend({ filename: file, dist: param.dist, setVersion: setVersion })));
