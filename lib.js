'use strict';

const each = require('lodash/each');

const normalize = (json) => {
  if (!json.key) {
    throw "missed key property";
  }

  const keys = json.key;
  let result = {};

  each(json, (value, key) => {
    // skip "key"
    if (key === 'key') {
      return;
    }

    if (key === 'string') {
      result = toResult({ result, keys, values: value, type: key });
    }
  });

  return result;
};

const toResult = ({ result, type, keys, values }) => {
  const availableKeys = keys.filter((key) => !result[key]);

  const keysToValues = values.reduce((acc, value, index) => {
    const key = availableKeys[index];
    acc[key] = value;
    return acc;
  }, {});

  return Object.assign({}, result, keysToValues);
};

const toValue = (type, value) => {
  if (type === 'string') {
    return value;
  }
};

module.exports = {
  normalize
};
