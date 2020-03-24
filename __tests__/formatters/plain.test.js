// @ts-check
import fs from 'fs';
import path from 'path';
import findDiff from '../../src/findDiff';
import formToPlain from '../../src/formatters/index';

const getFixturePath = (filename) => path.join(__dirname, '../..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const before = {
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

// const recursiveMutableSort = (arr) => {
//   arr.sort((a, b) => {
//     if (a.children) recursiveMutableSort(a.children);
//     if (b.children) recursiveMutableSort(b.children);
//     if (a.key > b.key) return 1;
//     if (a.key < b.key) return -1;
//     return 0;
//   });
// };
// recursiveMutableSort(differences);

const differences = findDiff(before, after);


describe('Plain formatter', () => {
  it('', () => {
    console.log(differences)
    const actual = formToPlain(differences, 'plain');
    const expected = readFile('formatters/result.txt');
    expect(expected).toEqual(actual);
  });
});
