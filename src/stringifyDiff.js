// @ts-check

const mapProperiesStates = {
  new: (key, value) => [`+ ${key}: ${value}`],
  modified: (key, value, prevVelue) => [`+ ${key}: ${value}`, `- ${key}: ${prevVelue}`],
  deleted: (key, value) => [`- ${key}: ${value}`],
  old: (key, value) => [`  ${key}: ${value}`],
};

const stringify = (differences) => {
  const stringifiedDiffs = differences
    .reduce((acc, diff) => {
      const {
        state,
        key,
        value,
        prevValue,
      } = diff;

      const result = mapProperiesStates[state](key, value, prevValue);

      return [...acc, ...result];
    }, [])
    .map((val) => `  ${val}`)
    .join('\n');

  return `{\n${stringifiedDiffs}\n}`;
};

export default stringify;
