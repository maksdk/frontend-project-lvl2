// @ts-check
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers';
import generateDifferences from '../src/generateDifferences';
import sortDifferencesMutable from './utils';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['json', 'yaml', 'ini'];

describe('Generate differences', () => {
  formats.forEach((format) => {
    it(`Test ${format} files`, () => {
      const expected = JSON.parse(readFile('generatedDifferences.json'));

      const before = readFile(`before.${format}`);
      const after = readFile(`after.${format}`);

      const actual = generateDifferences(parse(before, format), parse(after, format));

      sortDifferencesMutable(expected);
      sortDifferencesMutable(actual);

      expect([]).toEqual([]);
      expect(expected).toEqual(actual);
    });
  });
});
