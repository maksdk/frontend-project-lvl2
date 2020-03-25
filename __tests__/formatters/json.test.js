// @ts-check
import formToJson from '../../src/formatters';

describe('Json formatter', () => {
  it('Test 1', () => {
    expect(JSON.stringify([])).toEqual('[]');
  });

  it('Test 2', () => {
    const differences = [
      {
        state: 'changed',
        key: 'complex',
        value: {
          value1: {
            value2: 'complex',
            value3: 'value3',
          },
        },
        oldValue: {
          value1: 'complex',
        },
      },
      {
        key: 'children',
        children: [
          { state: 'unchanged', key: 'prop1', value: 'prop1' },
          {
            state: 'changed',
            key: 'prop2',
            value: { value1: 100 },
            oldValue: 'prop2',
          }],
      },
      {
        state: 'added',
        key: 'complex2',
        value: {
          value1: 'value1',
          value2: 'value2',
        },
      },
      {
        state: 'deleted',
        key: 'null',
        value: null,
      },
      {
        state: 'deleted',
        key: 'number',
        value: 100,
      },
      {
        state: 'changed',
        key: 'almostNumber',
        value: 100,
        oldValue: '100',
      },
      {
        state: 'changed',
        key: 'boolean',
        value: false,
        oldValue: true,
      },
      {
        state: 'changed',
        key: 'almostBool',
        value: 'false',
        oldValue: 'true',
      },
    ];
    const actual = formToJson(differences, 'json');
    expect(JSON.stringify(differences)).toEqual(actual);
  });
});
