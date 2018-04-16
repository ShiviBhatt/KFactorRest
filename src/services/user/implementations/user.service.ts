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

  public createUser(user: IUser): Promise<Number> {
    //TODO: Call unified service, not req as UI will call this service and post data
    return this.persistenceService.createUserTrans(user);
  }

  public checkUserExistOrNot(userUid: string): Promise<Boolean> {
    if (!validate.isValidUid(userUid)) {
      return Promise.reject(new BadRequestError('Invalid userUid was passed'));
    }
    return this.persistenceService.checkUserExistOrNot(userUid)
    .then((count) => {
      if (count > 0) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    });
  }

  public showPopUpOrNot(userUid: string): Promise<Boolean> {
    if (!validate.isValidUid(userUid)) {
      return Promise.reject(new BadRequestError('Invalid userUid was passed'));
    }
    return this.persistenceService.showPopUpOrNot(userUid)
    .then((flag) => {
      if (flag === 1) {
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    });
  }

  public updateUser(user: IUser): Promise<Number> {
    return this.persistenceService.updateUserTrans(user);
  }
}
