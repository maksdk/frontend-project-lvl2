// @ts-check
import fs from 'fs';
import path from 'path';

import { compare } from '../src/engine.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('check states compared config', () => {
  const before = readFile('before.json');
  const after = readFile('after.json');

  const expected = [
    { state: 'common', key: 'host', value: 'hexlet.io' },
    {
      state: 'modified', key: 'timeout', value: 20, prevValue: 50,
    },
    { state: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { state: 'new', key: 'verbose', value: true },
    { state: 'deleted', key: 'follow', value: false },
  ];


  const actual = compare(JSON.parse(before), JSON.parse(after));
  expect(expected).toEqual(expect.arrayContaining(actual));
  expect(expected).toHaveLength(actual.length);

  // const result = readFile('result.txt');
  // const actualStringified = stringify(actual);
  // expect(actualStringified).toMatch(/host: hexlet.io/);
  // expect(actualStringified).toMatch(/host: hexlet.io/);
  // expect(actualStringified).toMatch(/host: hexlet.io/);
});
