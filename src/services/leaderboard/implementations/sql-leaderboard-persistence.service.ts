import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import { ILeaderboardPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class LeaderboardPersistenceService implements ILeaderboardPersistenceService {
  private log: ILogger;
  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverQuizUp')) private sqlDataDriver: ISqlDataDriver,
  ) {
    this.log = loggerFactory.getLogger('services.leaderboardPersistenceService');
  }

  public getLeaderboardByScores(): Promise<any> {
    let params = {};
    let sql = `
        SELECT user_name,grade_level,grade_name,school_name,total_score
        FROM leaderboard l
         INNER JOIN users u ON l.user_id = u.id
         ORDER BY total_score DESC
         LIMIT 10
        `;

    return this.sqlDataDriver.query<any>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Leaderboard is empty`);
      }
      return results;
    });
  }

  public getLeaderboardByWins(): Promise<any> {
    let params = {};
    let sql = `
    SELECT user_name,grade_level,grade_name,school_name,challenges_won
    FROM leaderboard l
     INNER JOIN users u ON l.user_id = u.id
     ORDER BY challenges_won DESC
     LIMIT 10
    `;

    return this.sqlDataDriver.query<any>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Leaderboard is empty`);
      }
      return results;
    });
  }

  createLeaderboardTrans(userId: any): Promise<any> {
    let trans: ISqlTransaction;
    return this.sqlDataDriver.createTransaction()
      .then((xact) => {
        trans = xact;
        return this.createLeaderboard(trans, userId);
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

  private createLeaderboard(trans: ISqlTransaction, userId: any): Promise<any> {
    if (!userId) {
      return Promise.reject(new Error('User object is required'));
    }
    let params = {};
    let sql = `
    INSERT INTO leaderboard (user_id,challenges_won,total_score)
    SELECT a.userid,a.ch_won,b.tot_score
    FROM 
    (SELECT '${userId}' AS userid,COUNT(winner_user_id) ch_won
    FROM challenge
    WHERE winner_user_id= '${userId}') a
    INNER JOIN 
    (SELECT '${userId}' AS userid,SUM(score) tot_score
    FROM challenge_responses 
    WHERE user_id= '${userId}'
    GROUP BY user_id )b ON a.userid=b.userid
    ON DUPLICATE KEY UPDATE
    challenges_won= (SELECT COUNT(winner_user_id) ch_won
    FROM challenge
    WHERE winner_user_id='${userId}'),
    total_score=(SELECT SUM(score) tot_score
    FROM challenge_responses 
    WHERE user_id= '${userId}'
    GROUP BY user_id)
    `;
    return trans.querySingle(sql, params)
      .then(() => {
        return Promise.resolve(1); //result[0].id;
      });
  }
}
