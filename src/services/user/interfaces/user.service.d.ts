import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUser
} from '../../../models';

export interface IUserService {
  createUser(user: IUser): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
}
