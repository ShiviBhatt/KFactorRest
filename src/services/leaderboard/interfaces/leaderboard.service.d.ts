import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUser, ILeaderboard
} from '../../../models';

export interface ILeaderboardService {
  createLeaderboard(leaderboard: any): Promise<number>;
  getLeaderboardByWins(): Promise<any>;
  getLeaderboardByScores(): Promise<any>;
}
