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
import {
  ILeaderboard, IUser
} from '../../../models';
import * as validate from '../../validation';
import { ILeaderboardPersistenceService, ILeaderboardService } from '../interfaces';

@injectable()
export class LeaderboardService implements ILeaderboardService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ILeaderboardPersistenceService')) private persistenceService: ILeaderboardPersistenceService) {

    this.log = loggerFactory.getLogger('services.leaderboardService');
  }

  public getLeaderboardByWins(): Promise<any> {
    return this.persistenceService.getLeaderboardByWins();
  }

  public getLeaderboardByScores(): Promise<any> {
    return this.persistenceService.getLeaderboardByScores();
  }

  public createLeaderboard(userId: any): Promise<any> {
    return this.persistenceService.createLeaderboardTrans(userId);
  }
}
