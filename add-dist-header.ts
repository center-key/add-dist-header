// Add Dist Header ~ MIT License

import { format, parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import makeDir from 'make-dir';

export type Options = {
   filename:    string,   //input filename, example: 'build/my-app.js'
   dist?:       string,   //output folder
   extension?:  string,   //rename with new file extension (with dot), example: '.css'
   setVersion?: boolean,  //replace occurances of "~~~version~~~" with the package.json version number
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
         dist:       'dist',
         setVersion: true,
         };
      const settings = { ...defaults, ...options };
      if (!settings.filename)
         throw Error('Must specify the "filename" option.');
      const inputFile =      parse(settings.filename);
      const outputFileExt =  settings.extension ?? inputFile.ext;
      const jsStyle =        /\.(js|ts|cjs|mjs)/.test(outputFileExt);
      const input =          readFileSync(settings.filename, 'utf8');
      const pkg =            JSON.parse(readFileSync('package.json', 'utf8'));
      const versionPattern = /~~~version~~~/g;
      const dist =           settings.setVersion ? input.replace(versionPattern, pkg.version) : input;
      const info =           pkg.homepage ?? pkg.repository;
      const unlicensed =     !pkg.license || pkg.license === 'UNLICENSED';
      const license =        unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
      const banner =         `${pkg.name} v${pkg.version} ~ ${info} ~ ${license}`;
      const header =         (jsStyle ? '//! ' : '/*! ') + banner + (jsStyle ? '' : ' */');
      const output =         header + '\n\n' + dist;
      const fixedDigits =    { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      const distFolder =     makeDir.sync(settings.dist);
      const outputFilename = format({
         dir:  settings.dist,
         name: inputFile.name,
         ext:  outputFileExt,
         });
      writeFileSync(outputFilename, output);
      return {
         dist:   distFolder,
         header: header,
         file:   outputFilename,
         length: output.length,
         size:   (output.length / 1024).toLocaleString([], fixedDigits) + ' kB',
         };
      },

   };

export { addDistHeader };
