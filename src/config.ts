import * as config from 'config';
import { ConfigError } from 'pbis-common';

/**
 * Returns an object based on the property string passed in
 * 
 * @param property The string we use to retrieve a property
 */
export function get<T>(property: string): T {
  return config.get<T>(property);
}

/**
 * Returns an object based on the property string passed in
 * 
 * @param property The string we use to retrieve a property
 */
export function getRequired<T>(property: string): T {
  if (!has(property)) {
    throw new ConfigError(`Missing configuration for required property ${property}`);
  }
  return get<T>(property);
}

/**
 * Returns whether or not a property exists
 * 
 * @param property The string we use to check the property
 */
export function has(property: string): boolean {
  return config.has(property);
}

export interface IRevisionConfig {
  gitSha: string;
  buildNumber: string;
}
