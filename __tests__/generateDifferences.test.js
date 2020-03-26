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

const formats = ['json', 'yaml', 'ini'];

describe('Generate differences', () => {
  formats.forEach((format) => {
    it(`Test ${format} files`, () => {
      const expected = JSON.parse(readFile('diffs/expected.json'));

      const before = readFile(`diffs/before.${format}`);
      const after = readFile(`diffs/after.${format}`);

      const actual = generateDifferences(parse(before, format), parse(after, format));

      recursiveMutableSort(expected);
      recursiveMutableSort(actual);

      expect([]).toEqual([]);
      expect(expected).toEqual(actual);
    });
  });
});
