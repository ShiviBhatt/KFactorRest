import * as uidUtil from 'library-uid';
/* import {
  RequiredUniqueIdConstraints,
  RequiredIntegerConstraints,
  RequiredBooleanConstraint
} from './implementations/common-constraints'; */
let validate = require('validate.js');

// PowerSchool UID
export function isValidUid(value: string): boolean {
  return uidUtil.validate(value);
}

export function isValidRequiredString(value: string): boolean {
  return validate.isString(value) && !validate.isEmpty(value);
}

export function isValidRequiredArray(value: any[]): boolean {
  return validate.isArray(value);
}

/* export function isValidRequiredInteger(value: number): boolean {
  return validate.single(value, RequiredIntegerConstraints) === undefined;
}

export function isValidRequiredBoolean(value: boolean): boolean {
  return validate.single(value, RequiredBooleanConstraint) === undefined;
}
 */