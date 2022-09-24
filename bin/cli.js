#!/usr/bin/env node
/////////////////////
// add-dist-header //
// MIT License     //
/////////////////////

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
//    $ node bin/cli.js "spec/fixtures" "spec/fixtures/dist"  #run on sample files
//    $ node bin/cli.js --version=false  #update the distribution files for this project

// Imports
import { addDistHeader }        from '../dist/add-dist-header.js';
import { existsSync, statSync } from 'fs';
import chalk                    from 'chalk';
import glob                     from 'glob';
import log                      from 'fancy-log';

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
const delimiter =  flagMap.delimiter ?? '~~';
const replace =    flagMap.replace !== 'false';
const version =    flagMap.version !== 'false';
const isFolder =   existsSync(param.filename) && statSync(param.filename).isDirectory();
const pattern =    isFolder ? param.filename + '/*' : param.filename;
const filenames =  glob.sync(pattern, { nodir: true }).sort();
const name =       chalk.gray('add-dist-header');
const logResult =  (result) => log(name, chalk.blue.bold(result.file), chalk.magenta(result.size));
const error =
   files.length > 2 ?  'Unknown extraneous parameter: ' + files[2] :
   !filenames.length ? 'File not found: ' + param.filename :
   null;
if (error)
   throw Error('[add-dist-header] ' + error);
const prepend = (file) => addDistHeader.prepend({
   filename:       file,
   dist:           param.dist,
   delimiter:      delimiter,
   replaceComment: replace,
   setVersion:     version,
   });
filenames.forEach(file => logResult(prepend(file)));
