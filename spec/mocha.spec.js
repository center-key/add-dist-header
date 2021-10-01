// Add Dist Header
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readFileSync } from 'fs';

// Setup
import { addDistHeader } from '../dist/add-dist-header.js';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const header = {
   js:  '//! add-dist-header v' + pkg.version + ' ~ https://github.com/center-key/add-dist-header ~ MIT License',
   css: '/*! add-dist-header v' + pkg.version + ' ~ https://github.com/center-key/add-dist-header ~ MIT License */',
   };

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

   it('gets the correct header prepended', () => {
      const options = {
         filename: 'spec/fixtures/to-kebab.js',
         dist:     'spec/fixtures/dist',
         };
      const result = addDistHeader.prepend(options);
      const output = readFileSync('spec/fixtures/dist/to-kebab.js', 'utf8');
      const actual =   {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/fixtures/dist/to-kebab.js',
         length:   311,
         size:     '0.30 kB',
         versions: 3,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .ts build file', () => {

   it('gets the correct header prepended without version substitutions', () => {
      const options = {
         filename:   'spec/fixtures/to-kebab.ts',
         dist:       'spec/fixtures/dist',
         setVersion: false,
         };
      const result = addDistHeader.prepend(options);
      const output = readFileSync('spec/fixtures/dist/to-kebab.ts', 'utf8');
      const actual =   {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.js,
         file:     'spec/fixtures/dist/to-kebab.ts',
         length:   345,
         size:     '0.34 kB',
         versions: 1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('A .css build file', () => {

   it('gets the correct header prepended plus renamed to .min.css', () => {
      const options = {
         filename:   'spec/fixtures/kebab.css',
         dist:       'spec/fixtures/dist',
         extension:  '.min.css',
         };
      const result = addDistHeader.prepend(options);
      const output = readFileSync('spec/fixtures/dist/kebab.min.css', 'utf8');
      const actual =   {
         header:   result.header,
         file:     result.file,
         length:   result.length,
         size:     result.size,
         versions: output.split(pkg.version).length - 1,
         };
      const expected = {
         header:   header.css,
         file:     'spec/fixtures/dist/kebab.min.css',
         length:   176,
         size:     '0.17 kB',
         versions: 2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });
