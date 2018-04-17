import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import { IChallengesPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class ChallengesPersistenceService implements IChallengesPersistenceService {
    private log: ILogger;
    constructor(
        @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
        @inject(Symbol.for('ISqlDataDriverQuizUp')) private sqlDataDriver: ISqlDataDriver,
    ) {
        this.log = loggerFactory.getLogger('services.challengesPersistenceService');
    }

    //TODO: Fix this
    public getChallenges(): Promise<any> {
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

    public createChallengeTrans(challenge: any): Promise<number> {
        let trans: ISqlTransaction;
        return this.sqlDataDriver.createTransaction()
            .then((xact) => {
                trans = xact;
                return this.createChallenge(trans, challenge);
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

    public updateChallengeTrans(challenge: any): Promise<number> {
        return Promise.resolve(challenge);
    }

    private createChallenge(trans: ISqlTransaction, challenge: any): Promise<number> {
        if (!challenge) {
            return Promise.reject(new Error('Challenge object is required'));
        }
        let params = {};
        let sql = `
      INSERT  INTO challenge
      (quiz_id,user_id,opponent_id,live_flag,challenge_status)
      VALUE('${challenge.quiz_id}','${challenge.user_id}','${challenge.opponent_id}','${challenge.live_flag}','${challenge.challenge_status}');
      
      SELECT MAX(id) FROM challenge;
      `;
        return trans.querySingle(sql, params)
            .then((result) => {
                return result[0]; //result[0].id;
            });
    }

    private updateChallenge(trans: ISqlTransaction, challenge: any): Promise<number> {
        return Promise.resolve(challenge);
    }
}
