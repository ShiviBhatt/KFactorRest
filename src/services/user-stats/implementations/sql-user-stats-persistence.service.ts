import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import {
  IUserStats
} from '../../../models';
import { IUserStatsPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class UserStatsPersistenceService implements IUserStatsPersistenceService {
  private log: ILogger;
  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverQuizUp')) private sqlDataDriver: ISqlDataDriver,
  ) {
    this.log = loggerFactory.getLogger('services.userStatsPersistenceService');
  }

  public getUserStats(userId: number): Promise<any> {
        let params = {
            userId: userId
        };
        let sql = `
        SELECT us.id,IFNULL(stats.participated,0) AS participated,IFNULL(stats.tie,0) AS tie,IFNULL(stats.win,0) AS win,IFNULL(stats.loss,0) AS loss,us.topics_int
        FROM
        (SELECT sub.user_id ,SUM(participated) participated,SUM(tie) tie,SUM(win) win,SUM(loss) loss
        FROM
        (SELECT DISTINCT :userId AS user_id,id,
        1 AS participated,
        CASE WHEN result='tie' THEN 1 ELSE 0 END AS tie,
        CASE WHEN (result='decided' OR result='quit')  AND winner_user_id= :userId THEN 1 ELSE 0 END win,
        CASE WHEN (result='decided' OR result='quit')  AND winner_user_id <> :userId THEN 1 ELSE 0 END loss
        FROM challenge
        WHERE user_id= :userId OR opponent_id= :userId) AS sub) AS stats
        RIGHT JOIN users AS us ON stats.user_id=us.id
        WHERE  us.id=:userId
        `;

        return this.sqlDataDriver.querySingle<any>(sql, params).then(result => {
          if (!result) {
            throw new NotFoundError(`User's stats does not exist`);
          }
          return result;
        });
  }

  public createUserStatsTrans(userStats: IUserStats): Promise<any> {
        return Promise.resolve(userStats);
  }
}
