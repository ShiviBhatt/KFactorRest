import * as Promise from 'bluebird';
import { ISqlTransaction } from 'pbis-common';

export interface IQuizPersistenceService {
  createQuizTrans(quiz: any): Promise<any>;
  getQuiz(topic: string): Promise<any>;
}
