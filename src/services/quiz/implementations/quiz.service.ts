import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as uidUtil from 'library-uid';
import * as _ from 'lodash';
import * as uuid from 'node-uuid';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  ILogger,
  ILoggerFactory,
  NotFoundError
} from 'pbis-common';
import * as validate from '../../validation';
import { IQuizPersistenceService, IQuizService } from '../interfaces';

@injectable()
export class LeaderboardService implements IQuizService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('IQuizPersistenceService')) private persistenceService: IQuizPersistenceService) {

    this.log = loggerFactory.getLogger('services.userService');
  }

  public getQuiz(): Promise<any> {
    return this.persistenceService.getQuiz();
  }

  public createQuiz(quiz: any): Promise<any> {
    return this.persistenceService.createQuizTrans(quiz);
  }
}
