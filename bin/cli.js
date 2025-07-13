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
//    $ npm install --save-dev add-dist-header
//    $ npx add-dist-header "build" "dist"
//    $ npx add-dist-header  #same as above since "build/*" "dist" are the default parameters
//    $ npx add-dist-header "target/app.js"  #creates "dist/app.js" prepended with a comment header
//
// Contributors to this project:
//    $ cd add-dist-header
//    $ npm install
//    $ npm test
//    $ node bin/cli.js "spec/fixtures/source" "spec/fixtures/target"
//    $ node bin/cli.js --no-version

// Imports
import { addDistHeader } from '../dist/add-dist-header.js';
import { cliArgvUtil } from 'cli-argv-util';
import { globSync } from 'glob';
import fs    from 'fs';
import path  from 'path';
import slash from 'slash';

// Parameters and flags
const validFlags = ['all-files', 'delimiter', 'ext', 'keep', 'keep-first',
   'no-version', 'note', 'quiet', 'recursive'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0] ?? 'build/*';
const target =     cli.params[1] ?? 'dist';

// Prepend
const normalize =  (name) => path.normalize(name.endsWith(path.sep) ? name.slice(0, -1) : name);
const origin =     normalize(source);
const targetRoot = normalize(target);
const isFolder =   fs.existsSync(origin) && fs.statSync(origin).isDirectory();
const wildcard =   cli.flagOn.recursive ? '/**/*' : '/*';
const pattern =    slash(isFolder ? origin + wildcard : origin);
const extensions = cli.flagMap.ext?.split(',') ?? null;
const keep =       (filename) => !extensions || extensions.includes(path.extname(filename));
const filenames =  globSync(pattern, { nodir: true }).map(slash).filter(keep).sort();
const error =
   cli.invalidFlag ?      cli.invalidFlagMsg :
   cli.paramCount > 2 ?   'Extraneous parameter: ' + cli.params[2] :
   !filenames.length ?    'File not found: ' + source :
   source.includes('*') ? 'Wildcards not supported in source: ' + source :
   null;
if (error)
   throw new Error('[add-dist-header] ' + error);
const calcOptions = (sourceFilename) => ({
   allFiles:       cli.flagOn.allFiles,
   delimiter:      cli.flagMap.delimiter ?? '~~',
   dist:           targetRoot + path.dirname(sourceFilename).substring(origin.length),
   replaceComment: !cli.flagOn.keep,
   setVersion:     !cli.flagOn.noVersion,
   });
const getResult = (filename) => addDistHeader.prepend(filename, calcOptions(filename));
const quiet =     cli.flagOn.quiet;
filenames.forEach(filename => addDistHeader.reporter(getResult(filename), { quiet }));
