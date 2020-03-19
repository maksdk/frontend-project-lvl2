// @ts-check
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from '../src/parsers';
import { compare } from '../src/engine.js';

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
      state: 'modified', key: 'timeout', value: 20, oldValue: 50,
    },
    { state: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { state: 'new', key: 'verbose', value: true },
    { state: 'deleted', key: 'follow', value: false },
  ];

  it('json format', () => {
    const before = readFile('flat/before.json');
    const after = readFile('flat/after.json');

    const actual = compare(parse(before, 'json'), parse(after, 'json'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });

  it('yaml format', () => {
    const before = readFile('flat/before.yaml');
    const after = readFile('flat/after.yaml');

    const actual = compare(parse(before, 'yaml'), parse(after, 'yaml'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });

  it('ini format', () => {
    const before = readFile('flat/before.ini');
    const after = readFile('flat/after.ini');

    const actual = compare(parse(before, 'ini'), parse(after, 'ini'));
    expect(_.sortBy(expected, ['key'])).toEqual(_.sortBy(actual, ['key']));
  });
});


describe('compare inserted configs', () => {
  it('json format', () => {
    const expected = [
      {
        key: 'common',
        state: 'unchanged',
        children: [
          { key: 'follow', value: false, state: 'new' },
          { key: 'setting1', value: 'Value 1', state: 'unchanged' },
          { key: 'setting2', value: 200, state: 'deleted' },
          {
            key: 'setting3',
            oldValue: true,
            state: 'modified',
            children: [
              { key: 'key', value: 'value' }],
          },
          {
            key: 'setting6',
            state: 'unchanged',
            children: [
              { key: 'key', value: 'value', state: 'unchanged' },
              { key: 'ops', value: 'vops', state: 'new' }],
          },
          { key: 'setting4', value: 'blah blah', state: 'new' },
          {
            key: 'setting5',
            state: 'new',
            children: [
              { key: 'key5', value: 'value5' }],
          },
        ],
      },
      {
        key: 'group1',
        state: 'unchanged',
        children: [
          {
            key: 'baz',
            value: 'bars',
            state: 'modified',
            oldValue: 'bas',
          },
          { key: 'foo', value: 'bar', state: 'unchanged' },
          {
            key: 'nest',
            state: 'modified',
            value: 'str',
            oldValue: [
              { key: 'key', value: 'value' }],
          }],
      },
      {
        key: 'group2',
        state: 'deleted',
        children: [
          { key: 'abc', value: 123456 }],
      },
      {
        key: 'group3',
        state: 'new',
        children: [
          { key: 'fee', value: 100500 }],
      },
    ];

    const before = readFile('inserted/before.json');
    const after = readFile('inserted/after.json');

    const actual = compare(parse(before, 'json'), parse(after, 'json'));

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });
});
