// @ts-check
import ini from 'ini';
import yaml from 'js-yaml';
import parse from '../src/parsers';

const flatExpected = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const insertedExpected = {
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
  },
};

const insertedExpectedOnlyStrings = {
  ...insertedExpected,
  prop1: { ...insertedExpected.prop1, setting2: '200' },
  prop2: { ...insertedExpected.prop2, abc: '123456' },
};

const mapStringifiedGenerators = {
  json: JSON.stringify,
  yaml: yaml.safeDump,
  ini: ini.stringify,
};

const formats = ['json', 'yaml', 'ini'];

formats.forEach((format) => {
  describe(`Parse ${format}`, () => {
    it('flat object', () => {
      const stringyfied = mapStringifiedGenerators[format](flatExpected);
      expect(flatExpected).toEqual(parse(stringyfied, format));
    });

    it('flat object. check number types', () => {
      const stringyfied = mapStringifiedGenerators[format]({ ...flatExpected, timeout: '50' });
      expect(flatExpected).toEqual(parse(stringyfied, format));
    });

    it('inserted object', () => {
      const stringyfied = mapStringifiedGenerators[format](insertedExpected);
      expect(insertedExpected).toEqual(parse(stringyfied, format));
    });

    it('inserted object. check number types', () => {
      const stringyfied = mapStringifiedGenerators[format](insertedExpectedOnlyStrings);
      expect(insertedExpected).toEqual(parse(stringyfied, format));
    });
  });
});
