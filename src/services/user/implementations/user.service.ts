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
  IUser
} from '../../../models';
import { IUnifiedSchemaService } from '../../unified-schema';
import * as validate from '../../validation';
import { IUserPersistenceService, IUserService } from '../interfaces';

@injectable()
export class UserService implements IUserService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('IUserPersistenceService')) private persistenceService: IUserPersistenceService,
    @inject(Symbol.for('IUnifiedSchemaService')) private unifiedSchemaService: IUnifiedSchemaService) {

    this.log = loggerFactory.getLogger('services.userService');
  }

  public getUsers(): Promise<IUser[]> {
    return this.persistenceService.getUsers();
  }

  public createUser(user: IUser): Promise<IUser> {
    //TODO: Call unified service
    return this.persistenceService.createUserTrans(user);
  }
}
