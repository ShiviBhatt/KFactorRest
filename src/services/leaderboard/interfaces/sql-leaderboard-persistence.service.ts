import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';
import {
  ILeaderboard, IUser
} from '../../../models';

export interface ILeaderboardPersistenceService {
  createLeaderboardTrans(leaderboard: ILeaderboard): Promise<ILeaderboard>;
  getLeaderboard(): Promise<IUser[]>;
}
