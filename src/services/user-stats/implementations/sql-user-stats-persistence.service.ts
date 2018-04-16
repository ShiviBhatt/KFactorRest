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

  public getUserStats(userId: number): Promise<IUserStats> {
        let params = {
            userId: userId
        };
        let sql = `
        select stats.user_id,stats.participated,stats.tie,stats.win,stats.loss,us.topics_int
        from
        (select sub.user_id ,SUM(participated) participated,SUM(tie) tie,SUM(win) win,SUM(loss) loss
        from 
        (select distinct :userId as user_id,challenge_id,
        1 as participated
        case when result='tie' THEN 1 else 0 end as tie,
        case when (result='decided' or result='quit')  and winner_user_id= :userId then 1 else 0 end win,
        case when (result='decided' or result='quit')  and winner_user_id <> :userId then 1 else 0 end loss
        from challenge
        where user_id= :userId or opponent_id= :userId) sub) stats
        inner join users us on stats.user_id=us.id
        `;

        return this.sqlDataDriver.querySingle<IUserStats>(sql, params).then(result => {
          if (!result) {
            throw new NotFoundError(`User's stats does not exist`);
          }
          return result;
        });
  }

  public createUserStatsTrans(userStats: IUserStats): Promise<IUserStats> {
        return Promise.resolve(userStats);
  }
}
