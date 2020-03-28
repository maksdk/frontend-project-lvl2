// @ts-check
import ini from 'ini';
import yaml from 'js-yaml';
import parse from '../src/parsers';
import parsedConfig1 from '../__fixtures__/parsedConfigs/config1';
import parsedConfig2 from '../__fixtures__/parsedConfigs/config2';

const mapStringifiedGenerators = {
  json: JSON.stringify,
  yaml: yaml.safeDump,
  ini: ini.stringify,
};

const formats = ['json', 'yaml', 'ini'];

describe('Test parsers', () => {
  formats.forEach((format) => {
    it(`File format: ${format}`, () => {
      const stringyfiedConfig1 = mapStringifiedGenerators[format](parsedConfig1);
      const stringyfiedConfig2 = mapStringifiedGenerators[format](parsedConfig2);

      const actualConfig1 = parse(stringyfiedConfig1, format);
      const actualConfig2 = parse(stringyfiedConfig2, format);

      expect(parsedConfig1).toEqual(actualConfig1);
      expect(parsedConfig2).toEqual(actualConfig2);
    });
  });
});
