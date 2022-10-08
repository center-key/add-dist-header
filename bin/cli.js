#!/usr/bin/env node
/////////////////////
// add-dist-header //
// MIT License     //
/////////////////////

// Usage in package.json:
//    "scripts": {
//       "add-headers": "dist-header build/*.js dist"
//    },
//
// Usage from command line:
//    $ npm install --global add-dist-header
//    $ dist-header "build" "dist"
//    $ dist-header  #same as above since "build/*" "dist" are the default parameters
//    $ dist-header "target/app.js"  #creates "dist/app.js" prepended with a comment header
//
// Contributors to this project:
//    $ cd add-dist-header
//    $ npm install
//    $ node bin/cli.js "spec/fixtures/source" "spec/fixtures/target"
//    $ node bin/cli.js --no-version

// Imports
import { addDistHeader } from '../dist/add-dist-header.js';
import chalk from 'chalk';
import fs    from 'fs';
import glob  from 'glob';
import log   from 'fancy-log';

// Parameters
const validFlags =  ['delimiter', 'keep', 'no-version', 'quiet'];
const args =        process.argv.slice(2);
const flags =       args.filter(arg => /^--/.test(arg));
const flagMap =     Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const flagOn =      Object.fromEntries(validFlags.map(flag => [flag, flag in flagMap]));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const params =      args.filter(arg => !/^--/.test(arg));

// Data
const source = params[0] ?? 'build/*';
const target = params[1] ?? 'dist';

// Reporting
const logResult =  (result) => {
   const name =   chalk.gray('dist-header');
   const arrow =  chalk.gray.bold(' ⟹  ');  //extra space for alignment
   const source = chalk.blue.bold(result.source);
   const target = chalk.magenta(result.file);
   const size =   chalk.white('(' + result.size + ')');
   if (!flagOn.quiet && result.valid)
      log(name, source, arrow, target, size);
   };

// Prepend
const isFolder =  fs.existsSync(source) && fs.statSync(source).isDirectory();
const pattern =   isFolder ? source + '/*' : source;
const filenames = glob.sync(pattern, { nodir: true }).sort();
const error =
   invalidFlag ?       'Invalid flag: ' + invalidFlag :
   params.length > 2 ? 'Unknown extraneous parameter: ' + params[2] :
   !filenames.length ? 'File not found: ' + source :
   null;
if (error)
   throw Error('[add-dist-header] ' + error);
const options = {
   dist:           target,
   delimiter:      flagMap.delimiter ?? '~~',
   replaceComment: !flagOn.keep,
   setVersion:     !flagOn['no-version'],
   };
filenames.forEach(filename => logResult(addDistHeader.prepend(filename, options)));
