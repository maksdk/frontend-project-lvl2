// @ts-check
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from '../src/parsers';
import findDiff from '../src/findDiff.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const recursiveMutableSort = (arr) => {
  arr.sort((a, b) => {
    if (a.children) recursiveMutableSort(a.children);
    if (b.children) recursiveMutableSort(b.children);
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
    return 0;
  });
};

describe('compare flat configs', () => {
  const expected = [
    { state: 'unchanged', key: 'host', value: 'hexlet.io' },
    {
      state: 'changed', key: 'timeout', value: 20, oldValue: 50,
    },
    { state: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { state: 'added', key: 'verbose', value: true },
    { state: 'deleted', key: 'follow', value: false },
  ];

  it('json format', () => {
    const before = readFile('flat/before.json');
    const after = readFile('flat/after.json');

    const actual = findDiff(parse(before, 'json'), parse(after, 'json'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });

  it('yaml format', () => {
    const before = readFile('flat/before.yaml');
    const after = readFile('flat/after.yaml');

    const actual = findDiff(parse(before, 'yaml'), parse(after, 'yaml'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });

  it('ini format', () => {
    const before = readFile('flat/before.ini');
    const after = readFile('flat/after.ini');

    const actual = findDiff(parse(before, 'ini'), parse(after, 'ini'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });
});


describe('compare inserted objects', () => {
  it('test 1', () => {
    const obj1 = {
      key1: 'key1',
      key2: {
        prop1: 'prop1',
        prop2: 'prop2',
      },
    };

    const obj2 = {
      key1: 'changed-key1',
      key2: {
        prop1: 'prop1',
        prop2: {
          changed1: 100,
        },
      },
    };

    const expected = [
      {
        key: 'key1',
        state: 'changed',
        value: 'changed-key1',
        oldValue: 'key1',
      },
      {
        key: 'key2',
        children: [
          { key: 'prop1', state: 'unchanged', value: 'prop1' },
          {
            key: 'prop2',
            state: 'changed',
            value: { changed1: 100 },
            oldValue: 'prop2',
          }],
      },
    ];

    const actual = findDiff(obj1, obj2);

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });

  it('test 2', () => {
    const expected = [
      {
        key: 'common',
        children: [
          { key: 'follow', value: false, state: 'added' },
          { key: 'setting1', value: 'Value 1', state: 'unchanged' },
          { key: 'setting2', value: 200, state: 'deleted' },
          {
            key: 'setting3',
            oldValue: true,
            state: 'changed',
            value: { key: 'value' },
          },
          {
            key: 'setting6',
            children: [
              { key: 'key', value: 'value', state: 'unchanged' },
              { key: 'ops', value: 'vops', state: 'added' }],
          },
          { key: 'setting4', value: 'blah blah', state: 'added' },
          {
            key: 'setting5',
            state: 'added',
            value: { key5: 'value5' },
          },
        ],
      },
      {
        key: 'group1',
        children: [
          {
            key: 'baz',
            value: 'bars',
            state: 'changed',
            oldValue: 'bas',
          },
          { key: 'foo', value: 'bar', state: 'unchanged' },
          {
            key: 'nest',
            state: 'changed',
            value: 'str',
            oldValue: { key: 'value' },
          }],
      },
      {
        key: 'group2',
        state: 'deleted',
        value: { abc: 123456 },
      },
      {
        key: 'group3',
        state: 'added',
        value: { fee: 100500 },
      },
    ];

    const before = readFile('inserted/before.json');
    const after = readFile('inserted/after.json');

    const actual = findDiff(parse(before, 'json'), parse(after, 'json'));

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });
});
