import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import {
  IUser
} from '../../../models';
import { IUserPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class UserPersistenceService implements IUserPersistenceService {
  private log: ILogger;
  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverIntervention')) private sqlDataDriver: ISqlDataDriver,
  ) {
    this.log = loggerFactory.getLogger('services.userPersistenceService');
  }

  public getUsers(): Promise<IUser[]> {
    let params = {};
    let sql = `
        select 
        user_name,grade_level,grade_name,school_name,age,gender,dob,topics_int,show_flag
        from users;
        `;

    return this.sqlDataDriver.query<IUser>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Users do not exists`);
      }
      return results;
    });
  }

  public createUserTrans(user: IUser): Promise<IUser> {
    return Promise.resolve(user);
  }
}
