// @ts-check
import fs from 'fs';
import path from 'path';
import generate from '../src/main';

const outputFormats = ['object', 'plain', 'json'];
const fileFormats = ['json', 'yaml', 'ini'];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const sortDifferencesMutable = (arr) => {
  arr.sort((a, b) => {
    if (a.children) sortDifferencesMutable(a.children);
    if (b.children) sortDifferencesMutable(b.children);
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
    return 0;
  });
};

const mapOutputClears = {
  object: (value) => (
    value.replace(/(\r\n|\n|\r)/gm, '')
      .split(' ')
      .filter((v) => v !== '')
      .sort()
  ),
  plain: (value) => {
    const separator = '#%-Some-test-separator-%#';
    return value.replace(/(\r\n|\n|\r)/gm, separator)
      .split(separator)
      .sort();
  },
  json: (value) => {
    const parsedValue = JSON.parse(value);
    sortDifferencesMutable(parsedValue);
    return parsedValue;
  },
};

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
  it('Test 1', () => {
    fileFormats.forEach((fileFormat) => {
      const p1 = getFixturePath(`before.${fileFormat}`);
      const p2 = getFixturePath(`after.${fileFormat}`);

      outputFormats.forEach((outputFormat) => {
        const expected = readFile(`outputs/${outputFormat}.txt`);
        const actual = generate(p1, p2, outputFormat);

        const clearedExpected = mapOutputClears[outputFormat](expected);
        const clearedActual = mapOutputClears[outputFormat](actual);

        expect(clearedActual).toEqual(clearedExpected);
      });
    });
  });
});
