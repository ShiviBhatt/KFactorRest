import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';
import {
  IUser
} from '../../../models';

export interface IUserPersistenceService {
  createUserTrans(user: IUser): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
}
