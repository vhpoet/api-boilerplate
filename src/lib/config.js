'use strict'

import get from 'lodash/get'
import ServerError from '../errors/server-error'

const envPrefix = 'api'

/**
 * Parse a boolean config variable.
 *
 * Environment variables are passed in as strings, but this function can turn
 * values like `undefined`, `''`, `'0'` and `'false'` into `false`.
 *
 * If a default value is provided, `undefined` and `''` will return the
 * default value.
 *
 * Values other than `undefined`, `''`, `'1'`, `'0'`, `'true'`, and `'false'` will throw.
 *
 * @param {String} value Config value
 * @param {Boolean} defaultValue Value to be returned for undefined or empty inputs
 * @param {Boolean} Same config value intelligently cast to bool
 */
function castBool (value, defaultValue) {
  value = value && value.trim()
  if (value === undefined || value === '') return Boolean(defaultValue)
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  throw new ServerError('castBool unexpected value: ' + value)
}

/**
 * Get a config value from the environment.
 *
 * Applies the config prefix defined in the constructor.
 *
 *
 * @param {String} prefix prefix
 * @param {String} name Config key (will be prefixed)
 * @return {String} Config value or undefined
 *
 * getEnv('example', 'my_setting') === process.env.EXAMPLE_MY_SETTING
 */
function getEnv (prefix, name) {
  let envVar
  if (name && prefix) envVar = `${prefix}_${name}`
  else if (name && !prefix) envVar = name
  else if (!name && prefix) envVar = prefix
  else throw new ServerError('Invalid environment variable')

  return process.env[envVar.toUpperCase().replace(/-/g, '_')]
}

function deepFreeze (o) {
  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o[prop] &&
      (o[prop].constructor === Object ||
      o[prop].constructor === Array ||
      typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop])
    }
  })

  return o
}

const configProto = {}

/**
 * @this {Object} The config object
 * @param {String} propertyPath - The config property path. Follows lodash.get
 *   syntax https://lodash.com/docs#get
 * @param {any} [defaultValue] - A default value to return if config value is undefined
 * @returns {any} - The config value at the specified path
 *
 */
configProto.get = function (propertyPath, defaultValue) {
  return get(this, propertyPath, defaultValue)
}
configProto.getIn = function (propertyList, defaultValue) {
  return get(this, propertyList, defaultValue)
}

/**
 * @param {String} prefix Prefix to apply to all env variable names. Should be
 *   in lowercase with dashes as separators. Will automatically be converted
 *   to uppercase with underscores or other formats as necessary.
 *
 * @param {Object} [localConfig]
 * @param {Object} [options]
 * @param {Boolean} [options.ed25519] - 'false' if config should not parse ed25519 keypair
 * @returns {Object} - Frozen Config
 *
 * @example
 *   const config = loadConfig(localConfig)
 *   config.toJS()
 *   => { foo: {bar: 'baz'} }
 *
 *   config.getIn(['foo', 'bar'])
 *   => 'baz'
 *
 *   config.get('foo').toJS()
 *   => {bar: 'baz'}
 *
 */
export default function loadConfig () {
  const localConfig = {}

  localConfig.port = getEnv(envPrefix, 'PORT')

  const completeConfig = Object.assign(Object.create(configProto), localConfig)
  deepFreeze(completeConfig)
  return completeConfig
}