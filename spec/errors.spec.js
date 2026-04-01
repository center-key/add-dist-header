// Add Distribution Header
// Error Handling Specification Suite

// Imports
import assert from 'node:assert';

// Setup
import { addDistHeader } from '../dist/add-dist-header.js';

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when "filename" is missing', () => {
      const makeBogusCall = () => addDistHeader.prepend();
      const exception =     { message: '[add-dist-header] Must specify the "filename" option.' };
      assert.throws(makeBogusCall, exception);
      });

   });
