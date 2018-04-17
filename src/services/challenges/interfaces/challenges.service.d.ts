import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

export interface IChallengesService {
  createChallenge(challenge: any): Promise<number>;
  getChallenges(): Promise<any>;
  updateChallenge(challenge: any): Promise<number>;
}
