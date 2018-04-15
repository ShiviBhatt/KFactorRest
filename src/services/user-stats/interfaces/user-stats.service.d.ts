import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUserStats
} from '../../../models';

export interface IUserStatsService {
  createUserStats(userStats: IUserStats): Promise<IUserStats>;
  getUsersStats(userId: number): Promise<IUserStats>;
}
