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
import { cliArgvUtil } from 'cli-argv-util';
import chalk from 'chalk';
import fs    from 'fs';
import glob  from 'glob';
import log   from 'fancy-log';

// Parameters and flags
const validFlags = ['delimiter', 'keep-first', 'keep', 'no-version', 'note', 'quiet'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0] ?? 'build/*';
const target =     cli.params[1] ?? 'dist';

// Deprecated
if (cli.flagOn.keepFirst) console.log('DEPRECATED: Replace --keep flag with --keep-first');
cli.flagOn.keep = cli.flagOn.keep || cli.flagOn.keepFirst;

// Reporting
const logResult =  (result) => {
   const name =   chalk.gray('dist-header');
   const arrow =  chalk.gray.bold(' ⟹  ');  //extra space for alignment
   const source = chalk.blue.bold(result.source);
   const target = chalk.magenta(result.file);
   const size =   chalk.white('(' + result.size + ')');
   if (!cli.flagOn.quiet && result.valid)
      log(name, source, arrow, target, size);
   };

// Prepend
const isFolder =  fs.existsSync(source) && fs.statSync(source).isDirectory();
const pattern =   isFolder ? source + '/*' : source;
const filenames = glob.sync(pattern, { nodir: true }).sort();
const error =
   cli.invalidFlag ?     cli.invalidFlagMsg :
   cli.paramsCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
   !filenames.length ?   'File not found: ' + source :
   null;
if (error)
   throw Error('[add-dist-header] ' + error);
const options = {
   dist:           target,
   delimiter:      cli.flagMap.delimiter ?? '~~',
   replaceComment: !cli.flagOn.keep,
   setVersion:     !cli.flagOn.noVersion,
   };
filenames.forEach(filename => logResult(addDistHeader.prepend(filename, options)));
