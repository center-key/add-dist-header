// Add Dist Header
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import assert from 'assert';
import fs from 'fs';

// Setup
import { addDistHeader } from '../dist/add-dist-header.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const header = {
   js:   '//! add-dist-header v' +  pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License',
   css:  '/*! add-dist-header v' +  pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License */',
   html: '<!-- add-dist-header v' + pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License -->',
   };

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'add-dist-header.d.ts',
         'add-dist-header.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: addDistHeader.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has functions named cli(), prepend(), and reporter()', () => {
      const module = addDistHeader;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['cli',      'function'],
         ['prepend',  'function'],
         ['reporter', 'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('A .js build file', () => {

   it('gets the correct header prepended with a custom delimiter', () => {
      const filename = 'spec/fixtures/kebab.js';
      const options = {
         dist:      'spec/target',
         delimiter: '🫓🍢🫓',
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/target/kebab.js', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js.replace(/~~/g, '🫓🍢🫓'),
         file:     'spec/target/kebab.js',
         length:   315,
         size:     '0.31 KB',
         versions: 3,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('that is minified gets normalized', () => {
      const filename = 'spec/fixtures/kebab.min.js';
      const options =  { dist: 'spec/target' };
      const result =   addDistHeader.prepend(filename, options);
      const output =   fs.readFileSync('spec/target/kebab.min.js', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/target/kebab.min.js',
         length:   228,
         size:     '0.22 KB',
         versions: 1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('A .ts build file', () => {

   it('gets the correct header prepended without version substitutions', () => {
      const filename = 'spec/fixtures/kebab.ts';
      const options = {
         dist:       'spec/target',
         setVersion: false,
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/target/kebab.ts', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/target/kebab.ts',
         length:   383,
         size:     '0.37 KB',
         versions: 1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('A .css build file', () => {

   it('gets the correct compact header prepended plus renamed to .min.css', () => {
      const filename = 'spec/fixtures/kebab.css';
      const options = {
         dist:      'spec/target',
         extension: '.min.css',
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/target/kebab.min.css', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.css,
         file:     'spec/target/kebab.min.css',
         length:   177,
         size:     '0.17 KB',
         versions: 2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('A .html build file', () => {

   it('gets the correct header prepended and keeps the original comment', () => {
      const filename = 'spec/fixtures/kebab.html';
      const options = {
         dist:           'spec/target',
         replaceComment: false,
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/target/kebab.html', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.html,
         file:     'spec/target/kebab.html',
         length:   306,
         size:     '0.30 KB',
         versions: 2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when "filename" is missing', () => {
      const makeBogusCall = () => addDistHeader.prepend();
      const exception =     { message: '[add-dist-header] Must specify the "filename" option.' };
      assert.throws(makeBogusCall, exception);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {
   const run = (posix) => cliArgvUtil.run(pkg, posix);

   it('with the --all-files flag and --recursive flag handles all files including subfolders', () => {
      run('add-dist-header spec/fixtures spec/target/cli/all --all-files --recursive');
      const actual = cliArgvUtil.readFolder('spec/target/cli/all');
      const expected = [
         'kebab.css',
         'kebab.html',
         'kebab.jpg',
         'kebab.js',
         'kebab.min.js',
         'kebab.ts',
         'kebab.xml',
         'subfolder',
         'subfolder/pita-bread.js',
         'subfolder/pita-bread.png',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --ext flag adds a header only to files with a specified file extension', () => {
      run('add-dist-header spec/fixtures spec/target/cli/ext --ext=.css,.js');
      const actual = fs.readdirSync('spec/target/cli/ext').sort();
      const expected = [
         'kebab.css',
         'kebab.js',
         'kebab.min.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --new-ext flag renames the target to use the specificed file extention', () => {
      run('add-dist-header spec/fixtures spec/target/cli/new-ext --ext=.css --new-ext=.style.css');
      const actual =   fs.readFileSync('spec/target/cli/new-ext/kebab.style.css', 'utf-8');
      const expected = fs.readFileSync('spec/target/cli/ext/kebab.css', 'utf-8');
      assertDeepStrictEqual(actual, expected);
      });

   });
