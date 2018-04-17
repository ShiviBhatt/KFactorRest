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
import { IChallengesPersistenceService, IChallengesService } from '../interfaces';

@injectable()
export class ChallengesService implements IChallengesService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('IChallengesPersistenceService')) private persistenceService: IChallengesPersistenceService) {

    this.log = loggerFactory.getLogger('services.leaderboardService');
  }

  public getChallenges(): Promise<any> {
    return this.persistenceService.getChallenges();
  }

  public createChallenge(challenge: any): Promise<number> {
    return this.persistenceService.createChallengeTrans(challenge);
  }

  public updateChallenge(challenge: any): Promise<number> {
    return this.persistenceService.updateChallengeTrans(challenge);
  }
}
