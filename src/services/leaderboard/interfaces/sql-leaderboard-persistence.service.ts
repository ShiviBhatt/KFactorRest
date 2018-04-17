import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';
import {
  ILeaderboard, IUser
} from '../../../models';

export interface ILeaderboardPersistenceService {
  createLeaderboardTrans(userId: any): Promise<any>;
  getLeaderboardByWins(): Promise<any>;
  getLeaderboardByScores(): Promise<any>;
}
