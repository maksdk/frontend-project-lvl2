// @ts-check
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import uniqueString from 'unique-string';
import formTo from '../src/formatters';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const differences = [
  {
    state: 'changed',
    key: 'complex',
    value: 'not-complex',
    oldValue: {
      value: 'complex',
    },
  },
  {
    key: 'children',
    children: [
      { state: 'unchanged', key: 'prop1', value: 'prop1' },
      {
        state: 'changed',
        key: 'child1',
        value: { value1: 100 },
        oldValue: 'child1',
      },
      {
        state: 'changed',
        key: 'child2',
        value: 'new-child2',
        oldValue: 'child2',
      },
      {
        key: 'child3',
        children: [
          { state: 'added', key: 'child4', value: 'inner-child' },
          {
            state: 'changed',
            key: 'num',
            value: 1,
            oldValue: 5,
          }],
      }],
  },
  {
    state: 'added',
    key: 'complex2',
    value: {
      value1: 'value1',
      value2: 'value2',
    },
  },
  {
    state: 'deleted',
    key: 'null',
    value: null,
  },
  {
    state: 'deleted',
    key: 'number',
    value: 100,
  },
  {
    state: 'changed',
    key: 'almostNumber',
    value: 100,
    oldValue: '100',
  },
  {
    state: 'changed',
    key: 'boolean',
    value: false,
    oldValue: true,
  },
  {
    state: 'changed',
    key: 'almostBool',
    value: 'false',
    oldValue: 'true',
  },
];

describe('Object formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'object');
    expect('{}').toEqual(actual);
  });

  it('Test 2', () => {
    const expected = readFile('formatters/object.txt').replace(/\s/gm, '');
    const actual = formTo(differences, 'object').replace(/\s/gm, '');
    expect(expected).toEqual(actual);
  });
});

describe('Plain formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'plain');
    expect('').toEqual(actual);
  });

  it('Test 2', () => {
    const separator = uniqueString();
    const expected = readFile('formatters/plain.txt').replace(/(\r\n|\n|\r)/gm, separator).split(separator);
    const actual = formTo(differences, 'plain').replace(/(\r\n|\n|\r)/gm, separator).split(separator);
    expect(_.sortBy(expected)).toEqual(_.sortBy(actual));
  });
});


describe('Json formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'json');
    expect(JSON.stringify([])).toEqual(actual);
  });

  it('Test 2', () => {
    const actual = formTo(differences, 'json');
    expect(JSON.stringify(differences)).toEqual(actual);
  });
});
