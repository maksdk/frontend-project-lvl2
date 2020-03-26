// @ts-check
import ini from 'ini';
import yaml from 'js-yaml';
import parse from '../src/parsers';

const expected = {
  prop1: {
    setting1: 'value',
    setting2: 200,
    setting3: {
      key: 'value',
    },
  },
  prop2: {
    abc: 123456,
    notNumber: '123.234.53.22',
    bool1: false,
    bool2: true,
  },
  prop3: {
    number: 100,
    notNumber: '100not',
  },
};

const mapStringifiedGenerators = {
  json: JSON.stringify,
  yaml: yaml.safeDump,
  ini: ini.stringify,
};

const formats = ['json', 'yaml', 'ini'];

describe('Test parsers', () => {
  formats.forEach((format) => {
    it(`File format: ${format}`, () => {
      const stringyfied = mapStringifiedGenerators[format](expected);
      const actual = parse(stringyfied, format);
      expect(expected).toEqual(actual);
    });
  });
});
