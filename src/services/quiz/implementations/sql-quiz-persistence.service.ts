import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import { BadRequestError, ILogger, ILoggerFactory } from 'pbis-common';
import { ISqlDataDriver, ISqlTransaction, NotFoundError } from 'pbis-common';
import { IQuizPersistenceService } from '../interfaces';
import * as validate from '../../validation';
@injectable()
export class QuizPersistenceService implements IQuizPersistenceService {
  private log: ILogger;
  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverQuiz')) private sqlDataDriver: ISqlDataDriver,
  ) {
    this.log = loggerFactory.getLogger('services.quizPersistenceService');
  }

  public getQuiz(): Promise<any> {
    let quizId: number;
    return this.getQuizId()
    .then(result => {
      quizId = result;
      let params = {
        quizId: quizId
      };
      let sql = `
        select b.question_id,c.question,d.id as option_id,d.option,d.correct_flag
        from quiz_dm a
        inner join quiz_question b on b.quiz_id=a.id
        inner join question_dm c on b.question_id=c.id
        inner join option_dm d on c.id = d.question_id
        where b.quiz_id = :quizId
      `;
      return this.sqlDataDriver.query<any>(sql, params).then(results => {
        if (!results) {
          throw new NotFoundError(`Leaderboard is empty`);
        }
        return results;
      });
    });
  }

  public createQuizTrans(quiz: any): Promise<any> {
    return Promise.resolve(quiz);
  }

  private getQuizId(): Promise<number> {
    let params = {};
    let sql = `
      SELECT id 
      FROM quiz_dm 
      WHERE topic='Computer Science'
      ORDER BY RAND()
      LIMIT 1
    `;
    return this.sqlDataDriver.querySingle<any>(sql, params).then(result => {
      if (!result) {
        throw new NotFoundError(`Quiz is empty`);
      }
      return result;
    });
  }

}
