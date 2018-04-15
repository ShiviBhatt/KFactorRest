import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

import {
  IUser, ILeaderboard
} from '../../../models';

export interface ILeaderboardService {
  createLeaderboard(leaderboard: ILeaderboard): Promise<ILeaderboard>;
  getLeaderboard(): Promise<IUser[]>;
}
