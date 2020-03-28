// @ts-check
import fs from 'fs';
import path from 'path';
import uniqueString from 'unique-string';
import formTo from '../src/formatters';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const differences = JSON.parse(readFile('generatedDifferences.json'));

const recursiveMutableSort = (arr) => {
  arr.sort((a, b) => {
    if (a.children) recursiveMutableSort(a.children);
    if (b.children) recursiveMutableSort(b.children);
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
    return 0;
  });
};

describe('Object formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'object');
    expect('{}').toEqual(actual);
  });

  it('Test 2', () => {
    const expected = readFile('formattersOutput/object.txt')
      .replace(/(\r\n|\n|\r)/gm, '')
      .split(' ')
      .filter((v) => v !== '')
      .sort();

    const actual = formTo(differences, 'object')
      .replace(/(\r\n|\n|\r)/gm, '')
      .split(' ')
      .filter((v) => v !== '')
      .sort();

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

    const expected = readFile('formattersOutput/plain.txt')
      .replace(/(\r\n|\n|\r)/gm, separator)
      .split(separator)
      .sort();

    const actual = formTo(differences, 'plain')
      .replace(/(\r\n|\n|\r)/gm, separator)
      .split(separator)
      .sort();

    expect(expected).toEqual(actual);
  });
});

describe('Json formatter', () => {
  it('Test 1', () => {
    const actual = formTo([], 'json');
    expect(JSON.stringify([])).toEqual(actual);
  });

  it('Test 2', () => {
    const expected = readFile('formattersOutput/json.txt');
    const actual = formTo(differences, 'json');

    const parsedExpected = JSON.parse(expected);
    const parsedActual = JSON.parse(actual);

    recursiveMutableSort(parsedExpected);
    recursiveMutableSort(parsedActual);

    expect(parsedExpected).toEqual(parsedActual);
  });
});
