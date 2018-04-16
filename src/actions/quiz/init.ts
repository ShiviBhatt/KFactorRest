import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  IAuthenticatedRequest,
  IEnforceAuthenticationHandlerFactory
} from 'pbis-common';
import * as middleware from '../../middleware';

import * as postQuizRoute from './post-quiz';
import * as getQuizRoute from './get-quiz';
import * as putQuizRoute from './put-quiz';

export function init(app: exp.Application, kernel: Kernel): void {
  const mustBeAuthenticated = kernel.get<IEnforceAuthenticationHandlerFactory>(Symbol.for('IEnforceAuthenticationHandlerFactory'));

  app.post(
    '/quizUp/v1/quiz',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      postQuizRoute.postQuizRouteHandler(req, res);
    });

  app.get(
    `/quizUp/v1/quiz/:topic`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getQuizRoute.getQuizRouteHandler(req, res);
    });

  app.put(
    '/quizUp/v1/quiz/:uid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putQuizRoute.putQuizRouteHandler(req, res);
    });
}
