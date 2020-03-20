// @ts-check

const mapProperiesStates = {
  new: (key, value) => [`+ ${key}: ${value}`],
  modified: (key, value, prevVelue) => [`+ ${key}: ${value}`, `- ${key}: ${prevVelue}`],
  deleted: (key, value) => [`- ${key}: ${value}`],
  unchanged: (key, value) => [`  ${key}: ${value}`],
};

const stringifySimpleDiff = (diff, depth, stringifyFunc) => {
  const {
    state = 'unchanged',
    key,
    value,
    children,
  } = diff;

  if (Array.isArray(children)) {
    return mapProperiesStates[state](key, stringifyFunc(children, depth));
  }

  return mapProperiesStates[state](key, value);
};

const stringifyModifiedDiff = (diff, depth, stringifyFunc) => {
  const {
    key,
    value,
    children,
    oldValue,
  } = diff;

  if (Array.isArray(children) && Array.isArray(oldValue)) {
    return mapProperiesStates
      .modified(key, stringifyFunc(children, depth), stringifyFunc(oldValue, depth));
  }

  if (Array.isArray(children)) {
    return mapProperiesStates.modified(key, stringifyFunc(children, depth), oldValue);
  }

  if (Array.isArray(oldValue)) {
    return mapProperiesStates.modified(key, value, stringifyFunc(oldValue, depth));
  }

  return mapProperiesStates.modified(key, value, oldValue);
};

const stringify = (differences, depth) => {
  const stringifiedDiffs = differences
    .reduce((acc, diff) => {
      const { state } = diff;

      if (state === 'modified') {
        return [...acc, ...stringifyModifiedDiff(diff, depth + 3, stringify)];
      }
      return [...acc, ...stringifySimpleDiff(diff, depth + 3, stringify)];
    }, [])
    .map((val) => `${' '.repeat(depth)}${val}`)
    .join('\n');

  return `{\n${stringifiedDiffs}\n${' '.repeat(depth - 1)}}`;
};

export default (differences) => stringify(differences, 1);
