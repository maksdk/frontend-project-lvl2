// @ts-check
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers';
import { compare } from '../src/engine.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expected = [
  { state: 'common', key: 'host', value: 'hexlet.io' },
  {
    state: 'modified', key: 'timeout', value: 20, prevValue: 50,
  },
  { state: 'deleted', key: 'proxy', value: '123.234.53.22' },
  { state: 'new', key: 'verbose', value: true },
  { state: 'deleted', key: 'follow', value: false },
];

test('compare json files', () => {
  const before = readFile('before.json');
  const after = readFile('after.json');

  const actual = compare(parse(before, 'json'), parse(after, 'json'));
  expect(expected).toEqual(expect.arrayContaining(actual));
  expect(expected).toHaveLength(actual.length);
});


test('compare yaml files', () => {
  const before = readFile('before.yaml');
  const after = readFile('after.yaml');

  const actual = compare(parse(before, 'yaml'), parse(after, 'yaml'));
  expect(expected).toEqual(expect.arrayContaining(actual));
  expect(expected).toHaveLength(actual.length);
});
