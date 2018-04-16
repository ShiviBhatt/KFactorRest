import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import {
  IUser
} from '../../../models';
import { IUsersPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class UsersPersistenceService implements IUsersPersistenceService {
  private log: ILogger;
  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverQuizUp')) private sqlDataDriver: ISqlDataDriver,
  ) {
    this.log = loggerFactory.getLogger('services.userPersistenceService');
  }

  public getUsers(): Promise<IUser[]> {
    let params = {};
    let sql = `
        select 
        user_name,grade_level,grade_name,school_name,age,gender,dob,topics_int,show_flag
        from users
        `;

    return this.sqlDataDriver.query<IUser>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Users do not exists`);
      }
      return results;
    });
  }

  public createUserTrans(user: IUser): Promise<Number> {
    let trans: ISqlTransaction;
    return this.sqlDataDriver.createTransaction()
      .then((xact) => {
        trans = xact;
        return this.createUser(trans, user);
      })
      .then(() => {
        return trans.commit();
      })
      .then(() => {
        return 1;
      })
      .catch((error) => {
        if (trans) {
          return trans.rollback().then(() => { return Promise.reject(error); });
        }
        return Promise.reject(error);
      });
  }

  public checkUserExistOrNot(userUid: string): Promise<Number> {
    let params = {
      userUid: userUid
    };
    let sql = `
    SELECT COUNT(*) cnt
    FROM users
    WHERE user_src_id = :userUid AND source= 'uc'
    `;
    return this.sqlDataDriver.querySingle<Number>(sql, params).then(result => {
      /* if (!result) {
        throw new NotFoundError(`Users do not exists`);
      } */
      return result;
    });
  }

  public showPopUpOrNot(userUid: string): Promise<Number> {
    let params = {
      userUid: userUid
    };
    let sql = `
    SELECT show_flag
    FROM users
    WHERE user_src_id = :userUid
    `;
    return this.sqlDataDriver.querySingle<Number>(sql, params).then(result => {
      /* if (!result) {
        throw new NotFoundError(`Users do not exists`);
      } */
      return result;
    });
  }

  public updateUserTrans(user: IUser): Promise<number> {
    let trans: ISqlTransaction;
    return this.sqlDataDriver.createTransaction()
      .then((xact) => {
        trans = xact;
        return this.updateUser(trans, user);
      })
      .then(() => {
        return trans.commit();
      })
      .then(() => {
        return 1;
      })
      .catch((error) => {
        if (trans) {
          return trans.rollback().then(() => { return Promise.reject(error); });
        }
        return Promise.reject(error);
      });
  }

  private createUser(trans: ISqlTransaction, user: IUser): Promise<number> {
    if (!user) {
      return Promise.reject(new Error('User object is required'));
    }
    let sql = `INSERT INTO users (user_src_id,source,user_name,grade_level,grade_name,school_name,dob,topics_int,show_flag)
                   VALUES ( '${user.userSrcId}',
                            '${user.source}',
                            '${user.userName}',
                            '${user.gradeLevel}',
                            '${user.gradeName}',
                            '${user.schoolName}',
                            '${user.dateOfBirth}',
                            '${user.interestTopics}',
                            '${user.showFlag}' 
                          );`;
    let params = {};
    return trans.querySingle(sql, params)
      .then((result) => {
        //TODO: Fix return value after adding stored procedures
        return 1; //result[0].id;
      });
  }
  private updateUser(trans: ISqlTransaction, user: IUser): Promise<number> {
    if (!user) {
      return Promise.reject(new Error('User object is required'));
    }
    //topics_int=@tpcs,show_flag=@shwflg,user_name=@usr_nme;
    let sql = `UPDATE users 
               SET  topics_int  = '${user.interestTopics}',
                    show_flag   = '${user.showFlag}',
                    user_name   = '${user.userName}',
               WHERE  user_src_id = '${user.userSrcId}'`;
    let params = {};
    return trans.querySingle(sql, params)
      .then((result) => {
        //TODO: Fix return value after adding stored procedures
        return 1; //result[0].id;
      });
  }
}
