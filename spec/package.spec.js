// Add Distribution Header
// Package Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'node:fs';

// Setup
import { addDistHeader } from '../dist/add-dist-header.js';

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

   it('has functions named assert(), cli(), prepend(), and reporter()', () => {
      const module = addDistHeader;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assert',   'function'],
         ['cli',      'function'],
         ['prepend',  'function'],
         ['reporter', 'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
