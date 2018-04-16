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
  IUserStats
} from '../../../models';
import { IUnifiedSchemaService } from '../../unified-schema';
import * as validate from '../../validation';
import { IUserStatsPersistenceService, IUserStatsService } from '../interfaces';

@injectable()
export class UserStatsService implements IUserStatsService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('IUserStatsPersistenceService')) private persistenceService: IUserStatsPersistenceService) {

    this.log = loggerFactory.getLogger('services.userService');
  }

  public getUsersStats(userId: number): Promise<any> {
    if (userId < 1) {
      return Promise.reject(new BadRequestError('userId cannot be less than 1'));
    }
    return this.persistenceService.getUserStats(userId);
  }

  public createUserStats(userStats: IUserStats): Promise<any> {
    return this.persistenceService.createUserStatsTrans(userStats);
  }
}
