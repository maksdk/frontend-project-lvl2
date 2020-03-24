// @ts-check
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import uniqueString from 'unique-string';
import findDiff from '../../src/findDiff';
import formToPlain from '../../src/formatters/index';

const getFixturePath = (filename) => path.join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('Plain formatter', () => {
  it('test 1', () => {
    const before = {
      unchanged: {
        prop: 'prop',
      },
      one: 'one',
      two: {
        three: 'three',
      },
      five: {
        six: 'six',
      },
      ten: 10,
      twelve: 'twelve',
      twenty: {
        one: 'one',
        two: 'two',
        five: 'five',
      },
    };
    const after = {
      unchanged: {
        prop: 'prop',
      },
      four: 'four',
      seven: {
        eight: 'eight',
      },
      five: {
        six: 'not - six',
      },
      ten: 100,
      twelve: {
        eleven: 'eleven',
      },
      twenty: {
        one: 'not - one',
        two: 'two',
        three: {},
      },
    };
    const differences = findDiff(before, after);
    const separator = uniqueString();
    const expected = readFile('formatters/result.txt').replace(/(\r\n|\n|\r)/gm, separator).split(separator);
    const actual = formToPlain(differences, 'plain').replace(/(\r\n|\n|\r)/gm, separator).split(separator);
    expect(_.sortBy(expected)).toEqual(_.sortBy(actual));
  });
});
