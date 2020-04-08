// @ts-check
import fs from 'fs';
import path from 'path';
import generate from '../src/index';

const outputFormats = ['object', 'plain', 'json'];
const fileFormats = ['json', 'yaml', 'ini'];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('Check exceptions', () => {
  it('Wrong paths', () => {
    const p = getFixturePath('before.json');
    expect(() => generate()).toThrow();
    expect(() => generate('', '')).toThrow();
    expect(() => generate(p, '')).toThrow();
    expect(() => generate('', p)).toThrow();
  });

  it('Wrong format', () => {
    const p1 = getFixturePath('before.json');
    const p2 = getFixturePath('after.json');

    expect(() => generate(p1, p2)).toThrow();
    expect(() => generate(p1, p2, 10)).toThrow();
    expect(() => generate(p1, p2, 'JSON')).toThrow();
    expect(() => generate(p1, p2, 'unknown')).toThrow();
    expect(() => generate(p1, p2, true)).toThrow();
  });

  it('Corrected paths and formats', () => {
    fileFormats.forEach((fileFormat) => {
      outputFormats.forEach((outputFormat) => {
        const p1 = getFixturePath(`before.${fileFormat}`);
        const p2 = getFixturePath(`after.${fileFormat}`);
        expect(() => generate(p1, p2, outputFormat)).not.toThrow();
      });
    });
  });
});

describe('Check outputs', () => {
  fileFormats.forEach((fileFormat) => {
    const path1 = getFixturePath(`before.${fileFormat}`);
    const path2 = getFixturePath(`after.${fileFormat}`);

    outputFormats.forEach((outputFormat) => {
      it(`Config format: '${fileFormat}'. Output format: '${outputFormat}'`, () => {
        const expected = readFile(`outputs/${outputFormat}.txt`);
        const actual = generate(path1, path2, outputFormat);
        expect(actual).toEqual(expected);
      });
    });
  });
});
