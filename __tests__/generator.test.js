// @ts-check
import generate from '../src/generator';

test('check generating of states', () => {
  const existed = [
    { state: 'common', key: 'host', value: 'hexlet.io' },
    {
      state: 'modified', key: 'timeout', value: 20, prevValue: 50,
    },
    { state: 'deleted', key: 'proxy', value: '123.234.53.22' },
    { state: 'new', key: 'verbose', value: true },
    { state: 'deleted', key: 'follow', value: false },
  ];

  const expected = generate('configs/before.json', 'configs/after.json');

  expect(existed).toEqual(expect.arrayContaining(expected));
  expect(existed).toHaveLength(expected.length);
});
