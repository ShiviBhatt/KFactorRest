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
        user_src_id,source,user_name,grade_level,grade_name,school_name,age,gender,dob,topics_int,show_flag
        from users
        `;

    return this.sqlDataDriver.query<IUser>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Users do not exists`);
      }
      return results;
    });
  }

  public getUserByUid(userUid: string): Promise<IUser> {
    let params = {
      userUid: userUid
    };
    let sql = `
      select
      id,user_src_id,source,user_name,grade_level,grade_name,school_name,age,gender,dob,topics_int,show_flag
      from users
      where user_src_id = :userUid
      `;
    return this.sqlDataDriver.querySingle<IUser>(sql, params).then(result => {
      if (!result) {
        throw new NotFoundError(`User do not exists`);
      }
      return result;
    });
  }

  public getUserByFilters(gradeName: string, schoolName: string, userName: string): Promise<IUser[]> {
    let params = {
      gradeName: gradeName,
      schoolName: schoolName,
      userName: userName
    };
    let sql = `
    SELECT * FROM users
    WHERE (grade_name= :gradeName OR 'ALL'= :gradeName) AND (school_name= :schoolName OR 'ALL'= :schoolName) AND (user_name REGEXP (:userName))
    `;
    return this.sqlDataDriver.query<IUser>(sql, params).then(result => {
      if (!result) {
        throw new NotFoundError(`User do not exists`);
      }
      return result;
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
        return Promise.resolve(1);
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
    //console.log('sql and params', JSON.stringify(params) + ' ' + sql);
    return this.sqlDataDriver.querySingle<Number>(sql, params).then(result => {
      /* if (!result) {
        throw new NotFoundError(`Users do not exists`);
      } */
      //console.log('result', result);
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
    let params = {};
    let sql = `INSERT INTO users (user_src_id,source,user_name,grade_level,grade_name,school_name,dob,topics_int,show_flag)
              VALUES ('${user.user_src_id}','${user.source}','${user.user_name}','${user.grade_level}','${user.grade_name}','${user.school_name}','${user.dob}','${user.topics_int}','${user.show_flag}');`;
    return trans.querySingle(sql, params)
      .then(() => {
        return Promise.resolve(1); //result[0].id;
      });
  }
  private updateUser(trans: ISqlTransaction, user: IUser): Promise<number> {
    if (!user) {
      return Promise.reject(new Error('User object is required'));
    }
    let params = {
      topics_int: user.topics_int,
      show_flag: user.show_flag,
      user_name: user.user_name,
      user_src_id: user.user_src_id
    };
    //topics_int=@tpcs,show_flag=@shwflg,user_name=@usr_nme;
    let sql = `UPDATE users 
               SET  topics_int  = :topics_int,
                    show_flag   = :show_flag,
                    user_name   = :user_name,
               WHERE  user_src_id = :user_src_id`;
    return trans.querySingle(sql, params)
      .then((result) => {
        //TODO: Fix return value after adding stored procedures
        return 1; //result[0].id;
      });
  }
}
