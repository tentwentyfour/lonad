const pipe = require('lodash.flow');

const identity = x => x;
const constant = x => () => x;
const property = propertyName => object => object[propertyName];

module.exports = { identity, constant, pipe, property };
