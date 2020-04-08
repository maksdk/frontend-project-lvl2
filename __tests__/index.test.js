// @ts-check
import fs from 'fs';
import path from 'path';
import generate from '../src/index';

const outputFormats = ['object', 'plain', 'json'];
const fileFormats = ['json', 'yaml', 'ini'];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('Check exceptions', () => {
  const p1 = getFixturePath('before.json');
  const p2 = getFixturePath('after.json');
  expect(() => generate(p1, p2)).toThrow();
  expect(() => generate()).toThrow();
});

test('Check outputs', () => {
  fileFormats.forEach((fileFormat) => {
    const path1 = getFixturePath(`before.${fileFormat}`);
    const path2 = getFixturePath(`after.${fileFormat}`);

    outputFormats.forEach((outputFormat) => {
      const expected = readFile(`outputs/${outputFormat}.txt`);
      const actual = generate(path1, path2, outputFormat);

      expect(actual).toEqual(expected);
    });
  });
});
