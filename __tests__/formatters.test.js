// @ts-check
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import uniqueString from 'unique-string';
import formTo from '../src/formatters';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', 'formatters', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const differences = JSON.parse(readFile('differences.json'));

describe('Object formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'object');
    expect('{}').toEqual(actual);
  });

  it('Test 2', () => {
    const expected = readFile('object.txt').replace(/\s/gm, '');
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
    const expected = readFile('plain.txt').replace(/(\r\n|\n|\r)/gm, separator).split(separator);
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
    const expected = readFile('json.txt').replace(/\s/gm, '');
    const actual = formTo(differences, 'json');
    expect(expected).toEqual(actual);
  });
});
