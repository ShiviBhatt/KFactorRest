import * as Promise from 'bluebird';
import { IUser } from '../../../models';

export interface IUnifiedSchemaService {
  getStudentDetails(userUid: string): Promise<IUser>;
}
