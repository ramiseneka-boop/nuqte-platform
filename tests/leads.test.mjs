import test from 'node:test';import assert from 'node:assert/strict';import {clean,phoneOk} from '../lib/leads.mjs';
test('lead phone validation accepts KZ and international lengths',()=>{assert.equal(phoneOk('+7 (777) 123-45-67'),true);assert.equal(phoneOk('+44 20 7946 0958'),true);assert.equal(phoneOk('123'),false);});
test('lead cleaner removes controls and limits length',()=>{assert.equal(clean(' A\u0000B ',10),'A B');assert.equal(clean('123456',4),'1234');});
