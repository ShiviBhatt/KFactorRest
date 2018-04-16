import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import {
  IUser, ILeaderboard
} from '../../../models';
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

    return this.sqlDataDriver.query<IUser>(sql, params).then(results => {
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

    return this.sqlDataDriver.query<IUser>(sql, params).then(results => {
      if (!results) {
        throw new NotFoundError(`Leaderboard is empty`);
      }
      return results;
    });
  }

  createLeaderboardTrans(leaderboard: ILeaderboard): Promise<ILeaderboard> {
    return Promise.resolve(leaderboard);
  }
}
