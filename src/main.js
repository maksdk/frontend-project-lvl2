// @ts-check
import compare from './engine/compare';
import stringifyDifferences from './engine/stringifyDifferences';

export default (firstConfig, secondConfig) => {
  const differences = compare(firstConfig, secondConfig);
  const stringified = stringifyDifferences(differences);
  return stringified;
}