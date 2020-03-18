// @ts-check
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
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
  const before = readFile('flat/before.json');
  const after = readFile('flat/after.json');

  const actual = compare(parse(before, 'json'), parse(after, 'json'));
  expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
});


test('compare yaml files', () => {
  const before = readFile('flat/before.yaml');
  const after = readFile('flat/after.yaml');

  const actual = compare(parse(before, 'yaml'), parse(after, 'yaml'));
  expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
});


test('compare ini files', () => {
  const before = readFile('flat/before.ini');
  const after = readFile('flat/after.ini');

  const actual = compare(parse(before, 'ini'), parse(after, 'ini'));
  expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
});


test('compare inserted configs', () => {
  const expected1 = [
    {
      key: 'common',
      state: 'old',
      children: [
        { key: 'follow', value: false, state: 'new' },
        { key: 'setting1', value: 'Value 1', state: 'old' },
        { key: 'setting2', value: 200, state: 'deleted' },
        {
          key: 'setting3',
          prevValue: true,
          state: 'modified',
          children: [
            { key: 'key', value: 'value', state: 'old' },
          ],
        },
        {
          key: 'settings6',
          state: 'old',
          children: [
            { key: 'key', value: 'value', state: 'old' },
            { key: 'ops', value: 'vops', state: 'new' },
          ],
        },
        { key: 'settings4', value: 'blah blah', state: 'new' },
        {
          key: 'settings5',
          state: 'new',
          children: [
            { key: 'key5', value: 'value5' },
          ],
        },
      ],
    },
    {
      key: 'group1',
      state: 'old',
      children: [
        {
          key: 'baz',
          value: 'bars',
          state: 'modified',
          prevValue: 'bas',
        },
        { key: 'foo', value: 'bar', state: 'old' },
        {
          key: 'nest',
          state: 'modified',
          value: 'str',
          prevValue: {
            children: [
              { key: 'key', value: 'value' },
            ],
          },
        },
      ],
    },
    {
      key: 'group2',
      state: 'deleted',
      value: {
        children: [
          { key: 'abc', value: 123456 },
        ],
      },
    },
    {
      key: 'group3',
      state: 'new',
      value: {
        children: [
          { key: 'fee', value: 100500 },
        ],
      },
    },
  ];

  const before = readFile('inserted/before.json');
  const after = readFile('inserted/after.json');

  const actual = compare(parse(before, 'json'), parse(after, 'json'));

  expect(expected1).toEqual(actual);
});
