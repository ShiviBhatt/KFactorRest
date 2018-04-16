import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';
import {
  IUser
} from '../../../models';

export interface IUsersPersistenceService {
  createUserTrans(user: IUser): Promise<Number>;
  getUsers(): Promise<IUser[]>;
  checkUserExistOrNot(userUid: string): Promise<Number>;
  showPopUpOrNot(userUid: string): Promise<Number>;
  updateUserTrans(user: IUser): Promise<Number>;
  getUserByUid(userUid: string): Promise<IUser>;
}
