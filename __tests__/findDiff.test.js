// @ts-check
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers';
import generateDifferences from '../src/generateDifferences';

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

describe('compare inserted objects', () => {
  it('Test json format', () => {
    const expected = JSON.parse(readFile('diffs/expected.json'));

    const before = readFile('diffs/before.json');
    const after = readFile('diffs/after.json');

    const actual = generateDifferences(parse(before, 'json'), parse(after, 'json'));

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });

  it('Test yaml format', () => {
    const expected = JSON.parse(readFile('diffs/expected.json'));

    const before = readFile('diffs/before.yaml');
    const after = readFile('diffs/after.yaml');

    const actual = generateDifferences(parse(before, 'yaml'), parse(after, 'yaml'));

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });

  it('Test ini format', () => {
    const expected = JSON.parse(readFile('diffs/expected.json'));

    const before = readFile('diffs/before.ini');
    const after = readFile('diffs/after.ini');

    const actual = generateDifferences(parse(before, 'ini'), parse(after, 'ini'));

    recursiveMutableSort(expected);
    recursiveMutableSort(actual);

    expect(expected).toEqual(actual);
  });
});
