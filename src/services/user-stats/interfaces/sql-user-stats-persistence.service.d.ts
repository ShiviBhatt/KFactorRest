import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';
import {
  IUserStats
} from '../../../models';

export interface IUserStatsPersistenceService {
  createUserStatsTrans(userStats: IUserStats): Promise<any>;
  getUserStats(userId: number): Promise<any>;
}
