// @ts-check
import _ from 'lodash';
// Property 'timeout' was changed from 50 to 20
// Property 'proxy' was deleted
// Property 'common.setting4' was deleted
// Property 'common.setting5' was deleted
// Property 'common.setting2' was added with value: 200
// Property 'common.setting6.ops' was added with value: 'vops'
// Property 'common.sites' was added with value: 'hexlet.io'
// Property 'group1.baz' was changed from 'bars' to 'bas'
// Property 'group3' was deleted
// Property 'verbose' was added with value: true
// Property 'group2' was added with value: [complex value]


const stringifyValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isNumber(value)) return value;
  return `'${value}'`;
};

const mapTexts = {
  changed: (key, newValue, oldValue) => (`Property '${key}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`),
  modified: (key, newValue, oldValue) => (`Property '${key}' was changed from ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`),
  deleted: (key) => `Property '${key}' was deleted`,
  added: (key, newValue) => `Property '${key}' was added with value: ${stringifyValue(newValue)}`,
  new: (key, newValue) => `Property '${key}' was added with value: ${stringifyValue(newValue)}`,
};

const removeUnchangedProperties = (diffs) => {
  return diffs.reduce((acc, diff) => {
    const { children, state } = diff;

    if (state === 'unchanged') {
      return acc;
    }

    if (Array.isArray(children)) {
      return [...acc, { ...diff, children: removeUnchangedProperties(children) }];
    }

    return [...acc, diff];
  }, []);
};

const buildFullPaths = (diffs) => {
  const iter = (diff, pathAcc, acc) => {
    const { key, children, state } = diff;
    const newPath = [...pathAcc, key];

    if (Array.isArray(children)) {
      if (state === 'added') {
        return [...acc, { ...diff, fullPath: newPath }];
      }

      if (state === 'deleted') {
        return [...acc, { ...diff, fullPath: newPath }];
      }

      return children.reduce((newAcc, newDiff) => iter(newDiff, newPath, newAcc), acc);
    }

    return [...acc, { ...diff, fullPath: newPath }];
  };

  return diffs.reduce((acc, diff) => [...acc, ...iter(diff, [], [])], []);
};

const form = (diffs) => {
  return diffs.map(diff => {
    if (diff.state === 'changed') {
      return { name: diff.fullPath.join('.'), state: diff.state, to: stringifyValue(diff.value), from: stringifyValue(diff.oldValue) };
    }
    return { name: diff.fullPath.join('.'), state: diff.state, value: stringifyValue(diff.value) };
  });
};

// const form = (diffs) => {
//   const iter = (diff, pathAcc, acc) => {
//     const { key, children, state } = diff;

//     // if (!mapTexts[state]) return acc;
//     if (state === 'unchanged') return acc;

//     const newPath = [...pathAcc, key];

//     if (children) {
//       return children.reduce((newAcc, newDiff) => iter(newDiff, newPath, newAcc), acc);
//     }

//     return [...acc, { path: newPath, state }];
//   };

//   return diffs.reduce((acc, diff) => [...acc, ...iter(diff, [], [])], []);
// };


const diffs = [
  {
    key: 'common',
    state: 'changed',
    // state: 'overlap',
    children: [
      { key: 'follow', value: false, state: 'added' },
      { key: 'setting1', value: 'Value 1', state: 'unchanged' },
      // { key: 'setting1', value: 'Value 1' },
      { key: 'setting2', value: 200, state: 'deleted' },
      {
        key: 'setting3',
        oldValue: true,
        state: 'changed',
        children: [
          { key: 'key', value: 'value' }],
      },
      {
        key: 'setting6',
        state: 'changed',
        children: [
          { key: 'key', value: 'value', state: 'unchanged' },
          // { key: 'key', value: 'value' },
          { key: 'ops', value: 'vops', state: 'added' }],
      },
      { key: 'setting4', value: 'blah blah', state: 'added' },
      {
        key: 'setting5',
        state: 'added',
        children: [
          { key: 'key5', value: 'value5' }],
      },
    ],
  },
  {
    key: 'group1',
    state: 'changed',
    children: [
      {
        key: 'baz',
        value: 'bars',
        state: 'changed',
        oldValue: 'bas',
      },
      { key: 'foo', value: 'bar', state: 'unchanged' },
      // { key: 'foo', value: 'bar' },
      {
        key: 'nest',
        state: 'changed',
        value: 'str',
        oldValue: [
          { key: 'key', value: 'value' }],
      }],
  },
  {
    key: 'group2',
    state: 'deleted',
    children: [
      { key: 'abc', value: 123456 }],
  },
  {
    key: 'group3',
    state: 'added',
    children: [
      { key: 'fee', value: 100500 }],
  },
];
// const res = form(expected);
// console.log(res)
const res = removeUnchangedProperties(diffs);
// console.log(res);
// console.log(res[0]);
const built = buildFullPaths(res);
console.log(form(built))
// export default (differences) => {
//   const result = form(differences);
//   console.log(result)
// };
