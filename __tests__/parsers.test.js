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

describe('parse json', () => {
  it('flat object', () => {
    const stringyfied = JSON.stringify(flatExpected);
    expect(flatExpected).toEqual(parse(stringyfied, 'json'));
  });

  it('flat object. check number types', () => {
    const stringyfied = JSON.stringify({ ...flatExpected, timeout: '50' });
    expect(flatExpected).toEqual(parse(stringyfied, 'json'));
  });

  it('inserted object', () => {
    const stringyfied = JSON.stringify(insertedExpected);
    expect(insertedExpected).toEqual(parse(stringyfied, 'json'));
  });

  it('inserted object. check number types', () => {
    const stringyfied = JSON.stringify(insertedExpectedOnlyStrings);
    expect(insertedExpected).toEqual(parse(stringyfied, 'json'));
  });
});

describe('parse yaml', () => {
  it('flat object', () => {
    const stringyfied = yaml.safeDump(flatExpected);
    expect(flatExpected).toEqual(parse(stringyfied, 'yaml'));
  });

  it('flat object. check number types', () => {
    const stringyfied = yaml.safeDump({ ...flatExpected, timeout: '50' });
    expect(flatExpected).toEqual(parse(stringyfied, 'yaml'));
  });

  it('inserted object', () => {
    const stringyfied = yaml.safeDump(insertedExpected);
    expect(insertedExpected).toEqual(parse(stringyfied, 'yaml'));
  });

  it('inserted object. check number types', () => {
    const stringyfied = yaml.safeDump(insertedExpectedOnlyStrings);
    expect(insertedExpected).toEqual(parse(stringyfied, 'yaml'));
  });
});

describe('parse ini', () => {
  it('flat object', () => {
    const stringyfied = ini.stringify(flatExpected);
    expect(flatExpected).toEqual(parse(stringyfied, 'ini'));
  });

  it('flat object. check number types', () => {
    const stringyfied = ini.stringify({ ...flatExpected, timeout: '50' });
    expect(flatExpected).toEqual(parse(stringyfied, 'ini'));
  });

  it('inserted object', () => {
    const stringyfied = ini.stringify(insertedExpected);
    expect(insertedExpected).toEqual(parse(stringyfied, 'ini'));
  });

  it('inserted object. check number types', () => {
    const stringyfied = ini.stringify(insertedExpectedOnlyStrings);
    expect(insertedExpected).toEqual(parse(stringyfied, 'ini'));
  });
});
