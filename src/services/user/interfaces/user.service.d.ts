import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUser
} from '../../../models';

export interface IUsersService {
  createUser(user: IUser): Promise<Number>;
  getUsers(): Promise<IUser[]>;
  checkUserExistOrNot(userUid: string): Promise<Boolean>;
  showPopUpOrNot(userUid: string): Promise<Boolean>;
  updateUser(user: IUser): Promise<Number>;
}
