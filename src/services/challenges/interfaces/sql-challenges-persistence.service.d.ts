import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';

export interface IChallengesPersistenceService {
  createChallengeTrans(challenge: any): Promise<number>;
  getChallenges(): Promise<any>;
  updateChallengeTrans(challenge: any): Promise<number>;
}
