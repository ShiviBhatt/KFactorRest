import * as Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import * as rp from 'request-promise';
import * as uidUtil from 'library-uid';
import * as validate from '../../validation';
import * as mysql from 'mysql';
import {
  ILogger,
  ILoggerFactory,
  ISqlDataDriver,
  ISqlTransaction,
  Config,
  NotFoundError
} from 'pbis-common';

import { IUnifiedSchemaService } from '../interfaces';
import {
  IUser
} from '../../../models';

@injectable()
export class UnifiedSchemaService implements IUnifiedSchemaService {
  private log: ILogger;

  public constructor(
    @inject(Symbol.for('ILoggerFactory')) loggerFactory: ILoggerFactory,
    @inject(Symbol.for('ISqlDataDriverUnifiedSchema')) private readonly sqlDataAccess: ISqlDataDriver
  ) {
    this.log = loggerFactory.getLogger('services.UnifiedSchemaService');
  }

  public getStudentDetails(userUid: string): Promise<IUser> {
    if (!validate.isValidUid(userUid)) {
      return Promise.reject(new Error(`invalid userUid:[${userUid}]`));
    }

    let sql = `
      SELECT
        HEX(pa.username) as userName,
        pa.firstName as firstName,
        pa.lastName as lastName,
        s.gradeLevel as gradeLevel,
        sl.schoolName as schoolName,
        s.dateOfBirth as dateOfBirth
      FROM student s
        JOIN productAccount pa ON pa.id = s.productAccountId
        JOIN schoolEnrollment sle ON sle.studentId = s.id
        JOIN school sl ON sl.id = sle.schoolId
      WHERE pa.uid = :userUid
    `;
    let params = { userUid: uidUtil.toBuffer(userUid) };

    return this.sqlDataAccess.querySingle<IUser>(sql, params)
      .then((response: IUser) => {
        if (!response) {
          return Promise.reject(new NotFoundError(`Student account with uid = ${userUid} does not exist.`));
        }
        return response;
      })
      .catch((error) => {
        this.log.error(`Getting student detail failed: ${error}`);
        return Promise.reject(error);
      });
  }
}
