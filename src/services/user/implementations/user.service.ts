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
import { IUsersPersistenceService, IUsersService } from '../interfaces';

@injectable()
export class UsersService implements IUsersService {

  private log: ILogger;

  constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('IUsersPersistenceService')) private persistenceService: IUsersPersistenceService,
    @inject(Symbol.for('IUnifiedSchemaService')) private unifiedSchemaService: IUnifiedSchemaService) {

    this.log = loggerFactory.getLogger('services.userService');
  }

  public getUsers(): Promise<IUser[]> {
    return this.persistenceService.getUsers();
  }

  public getUserByUid(userUid: string): Promise<IUser> {
    if (!validate.isValidUid(userUid)) {
      return Promise.reject(new BadRequestError('Invalid userUid was passed'));
    }
    return this.persistenceService.getUserByUid(userUid);
  }

  public getUserByFilters(gradeName: string, schoolName: string, userName: string): Promise<IUser[]> {
    return this.persistenceService.getUserByFilters(gradeName, schoolName, userName);
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
      let cnt = 'cnt';
      if (count[cnt] > 0) {
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
      //console.log('flag', flag);
      if (flag === 1) {
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    });
  }

  public updateUser(user: IUser, userUid: string): Promise<Number> {
    return this.persistenceService.updateUserTrans(user, userUid);
  }
}
