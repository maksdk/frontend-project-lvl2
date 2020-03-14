// @ts-check

const mapProperiesStates = {
  new: (key, value) => [`+ ${key}: ${value}`],
  modified: (key, value, prevVelue) => [`+ ${key}: ${value}`, `- ${key}: ${prevVelue}`],
  deleted: (key, value) => [`- ${key}: ${value}`],
  common: (key, value) => [`  ${key}: ${value}`],
};

export default (differences) => {
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
    .map((val) => `\t${val}`)
    .join('\n');

  return `{\n${stringifiedDiffs}\n}`;
};
