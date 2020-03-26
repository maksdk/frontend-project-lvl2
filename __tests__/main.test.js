// @ts-check
import generate from '../src/main';

const outputFormats = ['object', 'plain', 'json'];
const fileFormats = ['json', 'yaml', 'ini'];
const path = '__fixtures__/diffs/';

describe('Main application test', () => {
  it('Exceptions', () => {
    expect(() => generate()).toThrow();

    fileFormats.forEach((fileFormat) => {
      expect(() => generate(`${path}before.${fileFormat}`, '')).toThrow();
      expect(() => generate('', `${path}after.${fileFormat}`)).toThrow();
      expect(() => generate(`${path}before.${fileFormat}`, `${path}after.${fileFormat}`)).toThrow();
    });
  });

  it('Not exceptions', () => {
    fileFormats.forEach((fileFormat) => {
      outputFormats.forEach((outputFormat) => {
        expect(() => generate(`${path}before.${fileFormat}`, `${path}after.${fileFormat}`, outputFormat)).not.toThrow();
      });
    });
  });
});
