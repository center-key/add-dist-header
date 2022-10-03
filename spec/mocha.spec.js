// Add Dist Header
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'fs';
import assert from 'assert';

// Setup
import { addDistHeader } from '../dist/add-dist-header.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const header = {
   js:   '//! add-dist-header v' +  pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License',
   css:  '/*! add-dist-header v' +  pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License */',
   html: '<!-- add-dist-header v' + pkg.version + ' ~~ https://github.com/center-key/add-dist-header ~~ MIT License -->',
   };

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual =   fs.readdirSync('dist').sort();
      const expected = [
         'add-dist-header.d.ts',
         'add-dist-header.js',
         'add-dist-header.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: addDistHeader.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a prepend() function', () => {
      const actual =   { validate: typeof addDistHeader.prepend };
      const expected = { validate: 'function' };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .js build file', () => {

   it('gets the correct header prepended with a custom delimiter', () => {
      const filename = 'spec/fixtures/source/kebab.js';
      const options = {
         dist:      'spec/fixtures/target',
         delimiter: '🫓🍢🫓',
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/fixtures/target/kebab.js', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js.replace(/~~/g, '🫓🍢🫓'),
         file:     'spec/fixtures/target/kebab.js',
         length:   321,
         size:     '0.31 KB',
         versions: 3,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('that is minified gets normalized', () => {
      const filename = 'spec/fixtures/source/kebab.min.js';
      const options =  { dist: 'spec/fixtures/target' };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/fixtures/target/kebab.min.js', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/fixtures/target/kebab.min.js',
         length:   228,
         size:     '0.22 KB',
         versions: 1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .ts build file', () => {

   it('gets the correct header prepended without version substitutions', () => {
      const filename = 'spec/fixtures/source/kebab.ts';
      const options = {
         dist:       'spec/fixtures/target',
         setVersion: false,
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/fixtures/target/kebab.ts', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/fixtures/target/kebab.ts',
         length:   426,
         size:     '0.42 KB',
         versions: 1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .css build file', () => {

   it('gets the correct compact header prepended plus renamed to .min.css', () => {
      const filename = 'spec/fixtures/source/kebab.css';
      const options = {
         dist:      'spec/fixtures/target',
         extension: '.min.css',
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/fixtures/target/kebab.min.css', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.css,
         file:     'spec/fixtures/target/kebab.min.css',
         length:   177,
         size:     '0.17 KB',
         versions: 2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .html build file', () => {

   it('gets the correct header prepended and keeps the original comment', () => {
      const filename = 'spec/fixtures/source/kebab.html';
      const options = {
         dist:           'spec/fixtures/target',
         replaceComment: false,
         };
      const result = addDistHeader.prepend(filename, options);
      const output = fs.readFileSync('spec/fixtures/target/kebab.html', 'utf-8');
      const actual = {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.html,
         file:     'spec/fixtures/target/kebab.html',
         length:   306,
         size:     '0.30 KB',
         versions: 2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when "filename" is missing', () => {
      const makeBogusCall = () => addDistHeader.prepend();
      const exception =     { message: '[add-dist-header] Must specify the "filename" option.' };
      assert.throws(makeBogusCall, exception);
      });

   });
