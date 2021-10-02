// Add Dist Header ~ MIT License

import { format, parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import makeDir from 'make-dir';

export type Options = {
   filename:        string,   //input filename, example: 'build/my-app.js'
   dist?:           string,   //output folder
   extension?:      string,   //rename with new file extension (with dot), example: '.css'
   replaceComment?: boolean,  //delete the original first line comment
   setVersion?:     boolean,  //substitute occurances of "~~~version~~~" with the package.json version number
   };
export type Result = {
   dist:   string,  //absolute path to distribution folder
   header: string,  //text prepended to output file
   file:   string,  //output filename
   length: number,  //number of characters in output file
   size:   string,  //formatted file size, example: '1,233.70 kB'
   };

const addDistHeader = {

   prepend(options: Options): Result {
      const defaults = {
         dist:           'dist',
         replaceComment: true,
         setVersion:     true,
         };
      const settings = { ...defaults, ...options };
      if (!settings.filename)
         throw Error('Must specify the "filename" option.');
      const commentStyle = {
         js:    { start: '//! ',  end: '' },
         ml:    { start: '<!-- ', end: ' -->' },
         other: { start: '/*! ',  end: ' */' },
         };
      const firstLineComment = {
         js:    /^(\/\/[^!].*|\/[*][^!].*[*]\/)\n/,  //matches: '// ...' or '/* ... */'
         ml:    /^<!--.*-->\n/,                      //matches: '<!-- ... -->'
         other: /^\/[*][^!].*[*]\/\n/,               //matches: '/* ... */'
         };
      const inputFile =      parse(settings.filename);
      const outputFileExt =  settings.extension ?? inputFile.ext;
      const jsStyle =        /\.(js|ts|cjs|mjs)$/.test(outputFileExt);
      const mlStyle =        /\.(html|sgml|xml|php)$/.test(outputFileExt);
      const type =           jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
      const input =          readFileSync(settings.filename, 'utf8');
      const pkg =            JSON.parse(readFileSync('package.json', 'utf8'));
      const clean =          settings.replaceComment ? input.replace(firstLineComment[type], '') : input;
      const versionPattern = /~~~version~~~/g;
      const dist =           settings.setVersion ? clean.replace(versionPattern, pkg.version) : clean;
      const info =           pkg.homepage ?? pkg.docs ?? pkg.repository;
      const unlicensed =     !pkg.license || pkg.license === 'UNLICENSED';
      const license =        unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
      const banner =         `${pkg.name} v${pkg.version} ~ ${info} ~ ${license}`;
      const header =         commentStyle[type].start + banner + commentStyle[type].end;
      const fixedDigits =    { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      const spacerLines =    (path: string) => path.includes('.min.') || mlStyle ? '\n' : '\n\n';
      const distFolder =     makeDir.sync(settings.dist);
      const outputPath =     format({ dir: settings.dist, name: inputFile.name, ext: outputFileExt });
      const output =         header + spacerLines(outputPath) + dist.replace(/^\s*\n/, '');
      writeFileSync(outputPath, output);
      return {
         dist:   distFolder,
         header: header,
         file:   outputPath,
         length: output.length,
         size:   (output.length / 1024).toLocaleString([], fixedDigits) + ' kB',
         };
      },

   };

export { addDistHeader };
