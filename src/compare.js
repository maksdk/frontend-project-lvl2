// @ts-check
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readConfig = (configPath) => {
  const result = fs.readFileSync(configPath, 'utf-8');
  return result;
};

const fixPath = (str) => path.resolve(process.cwd(), str);

const isCommonProperty = (obj1, obj2, key) => (
  _.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const isModifiedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && _.has(obj2, key) && !_.isEqual(_.pick(obj1, [key]), _.pick(obj2, [key]))
);

const isDeletedProperty = (obj1, obj2, key) => (
  _.has(obj1, key) && !_.has(obj2, key)
);

const compare = (firstConfig, secondConfig) => {
  const config1 = readConfig(fixPath(firstConfig));
  const parsedConfig1 = JSON.parse(config1);

  const config2 = readConfig(fixPath(secondConfig));
  const parsedConfig2 = JSON.parse(config2);

  const mergedConfigs = { ...parsedConfig1, ...parsedConfig2 };

  return Object.entries(mergedConfigs).reduce((acc, [key, value]) => {
    if (isCommonProperty(parsedConfig1, parsedConfig2, key)) {
      console.log(key);
      return [...acc, { state: 'common', key, value }];
    }

    if (isModifiedProperty(parsedConfig1, parsedConfig2, key)) {
      return [...acc, {
        state: 'modified', key, value, prevValue: parsedConfig1[key],
      }];
    }

    if (isDeletedProperty(parsedConfig1, parsedConfig2, key)) {
      return [...acc, { state: 'deleted', key, value }];
    }

    return [...acc, { state: 'new', key, value }];
  }, []);
};

export default compare;
