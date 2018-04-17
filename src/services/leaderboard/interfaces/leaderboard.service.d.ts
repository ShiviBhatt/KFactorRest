import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUser, ILeaderboard
} from '../../../models';

export interface ILeaderboardService {
  createLeaderboard(userId: any): Promise<any>;
  getLeaderboardByWins(): Promise<any>;
  getLeaderboardByScores(): Promise<any>;
}
