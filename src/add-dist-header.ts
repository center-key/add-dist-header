// Add Dist Header ~~ MIT License
//
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
//    $ node bin/cli.js "spec/fixtures" "spec/target"
//    $ node bin/cli.js --no-version

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { EOL } from 'node:os';
import { globSync } from 'glob';
import { isBinary } from 'istextorbinary';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';
import slash from 'slash';

// Types
export type Settings = {
   allFiles:       boolean,        //add headers to text files and just copy binary files
   dist:           string,         //output folder
   extension:      string | null,  //rename with new file extension (with dot), example: '.css'
   delimiter:      string,         //character separating the parts of the header comment
   replaceComment: boolean,        //delete the original first line comment
   setVersion:     boolean,        //substitute occurances of "{{package.version}}" with the package.json version number
   };
export type Result = {
   valid:  boolean,        //true if the input file is a text file or if allFiles is enabled
   text:   boolean,        //true if input file is a text file and false if binary
   dist:   string,         //absolute path to distribution folder
   header: string | null,  //text prepended to output file
   source: string,         //input filename
   file:   string,         //output filename
   length: number | null,  //number of characters in output file
   size:   string | null,  //formatted file size, example: '1,233.70 KB'
   };
export type ReporterSettings = {
   quiet: boolean,   //suppress informational messages
   };

const addDistHeader = {

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[add-dist-header] ${message}`);
      },

   cli() {
      const validFlags = ['all-files', 'delimiter', 'ext', 'keep', 'keep-first', 'new-ext',
         'no-version', 'note', 'quiet', 'recursive'];
      const cli =        cliArgvUtil.parse(validFlags);
      const source =     cli.params[0] ?? 'build/*';
      const target =     cli.params[1] ?? 'dist';
      const cleanPath =  (name: string) => path.normalize(name.endsWith(path.sep) ? name.slice(0, -1) : name);
      const origin =     cleanPath(source);
      const targetRoot = cleanPath(target);
      const isFolder =   fs.existsSync(origin) && fs.statSync(origin).isDirectory();
      const wildcard =   cli.flagOn.recursive ? '/**/*' : '/*';
      const pattern =    slash(isFolder ? origin + wildcard : origin);
      const extensions = cli.flagMap.ext?.split(',') ?? null;
      const keep =       (filename: string) => !extensions || extensions.includes(path.extname(filename));
      const filenames =  globSync(pattern, { nodir: true }).map(slash).filter(keep).sort();
      const error =
         cli.invalidFlag ?      cli.invalidFlagMsg :
         cli.paramCount > 2 ?   'Extraneous parameter: ' + cli.params[2]! :
         !filenames.length ?    'File not found: ' + source :
         source.includes('*') ? 'Wildcards not supported in source: ' + source :
         null;
      addDistHeader.assert(!error, error);
      const calcOptions = (sourceFilename: string): Settings => ({
         allFiles:       cli.flagOn.allFiles!,
         delimiter:      cli.flagMap.delimiter ?? '~~',
         dist:           targetRoot + path.dirname(sourceFilename).substring(origin.length),
         extension:      cli.flagMap.newExt ?? null,
         replaceComment: !cli.flagOn.keep,
         setVersion:     !cli.flagOn.noVersion,
         });
      const getResult = (filename: string) =>
         addDistHeader.prepend(filename, calcOptions(filename));
      const reporterSettings = { quiet: cli.flagOn.quiet! };
      filenames.forEach(filename => addDistHeader.reporter(getResult(filename), reporterSettings));
      },

   prepend(filename: string, options?: Partial<Settings>): Result {
      const defaults: Settings = {
         allFiles:       false,
         dist:           'dist',
         extension:      null,
         delimiter:      '~~',
         replaceComment: true,
         setVersion:     true,
         };
      const settings = { ...defaults, ...options };
      addDistHeader.assert(filename, 'Must specify the "filename" option.');
      const commentStyle = {
         js:    { start: '//! ',  end: '' },
         ml:    { start: '<!-- ', end: ' -->' },
         other: { start: '/*! ',  end: ' */' },
         };
      const firstLine = {
         js:    /^(\/\/[^!].*|\/[*][^!].*[*]\/)/,  //matches: '// ...' or '/* ... */'
         ml:    /^<!--.*-->/,                      //matches: '<!-- ... -->'
         other: /^\/[*][^!].*[*]\//,               //matches: '/* ... */'
         };
      type Pkg =             { [key: string]: string };
      const pkg =            <Pkg>JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const inputFile =      path.parse(filename);
      const fileExt =        settings.extension ?? inputFile.ext;
      const jsStyle =        /\.(js|ts|cjs|mjs|less)$/.test(fileExt);
      const mlStyle =        /\.(html|htm|sgml|xml|php)$/.test(fileExt);
      const type =           jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
      const doctypePattern = /^<(!doctype|\?xml).*/i;  //matches: '<!doctype html>' and '<?xml version="1.0" ?>'
      const versionPattern = /{{package\.version}}/g;
      const isTextFile =     !isBinary(filename);
      const input =          fs.readFileSync(filename, 'utf-8').trim();
      const out1 =           settings.replaceComment ? input.replace(firstLine[type], '').trim() : input;
      const out2 =           mlStyle ? out1.replace(doctypePattern, '').trim() : out1;
      const out3 =           settings.setVersion ? out2.replace(versionPattern, pkg.version!) : out2;
      const doctypeLine =    out1.match(doctypePattern)?.[0];
      const doctype =        mlStyle && doctypeLine ? doctypeLine + EOL : '';
      const info =           pkg.homepage ?? pkg.docs ?? pkg.repository;
      const unlicensed =     !pkg.license || pkg.license === 'UNLICENSED';
      const license =        unlicensed ? 'All Rights Reserved' : `${pkg.license} License`;
      const delimiter =      ' ' + settings.delimiter + ' ';
      const banner =         [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
      const header =         commentStyle[type].start + banner + commentStyle[type].end;
      const fixedDigits =    { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      const distFolder =     fs.mkdirSync(settings.dist, { recursive: true }) ?? settings.dist;
      const formatOptions =  { dir: settings.dist, name: inputFile.name, ext: fileExt };
      const outputPath =     slash(path.format(formatOptions));
      const numLines =       input.match(/^/gm)!.length;
      const isMinified =     outputPath.includes('.min.') || (numLines < 5 && fileExt !== '.ts');
      const spacerLines =    EOL.repeat(isMinified || mlStyle ? 1 : 2);
      const platformEol =    (text: string) => text.replace(/\r?\n/g, EOL);
      const final =          platformEol(doctype + header + spacerLines + out3 + EOL);
      if (isTextFile)
         fs.writeFileSync(outputPath, final);
      else if (settings.allFiles)
         fs.copyFileSync(filename, outputPath);
      const bytes = isTextFile ? final.replaceAll('\r', '').length : null;
      return {
         valid:  isTextFile || settings.allFiles,
         text:   isTextFile,
         dist:   distFolder,
         header: isTextFile ? header : null,
         source: slash(filename),
         file:   outputPath,
         length: bytes,
         size:   isTextFile ? (bytes! / 1024).toLocaleString([], fixedDigits) + ' KB' : null,
         };
      },

   reporter(result: Result, options?: ReporterSettings): Result {
      const defaults: ReporterSettings = {
         quiet: false,
         };
      const settings = { ...defaults, ...options };
      const name =   chalk.gray('add-dist-header');
      const arrow =  chalk.gray.bold('→');
      const source = chalk.blue.bold(result.source);
      const target = chalk.magenta(result.file);
      const size =   chalk.white('(' + (result.size || 'binary') + ')');
      if (!settings.quiet && result.valid)
         log(name, source, arrow, target, size);
      return result;
      },

   };

export { addDistHeader };
