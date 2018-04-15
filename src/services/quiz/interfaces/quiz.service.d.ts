import * as Promise from 'bluebird';
import { NoopLoggerFactory } from 'pbis-common';

export interface IQuizService {
  createQuiz(quiz: any): Promise<any>;
  getQuiz(): Promise<any>;
}
