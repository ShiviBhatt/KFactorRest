import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  IAuthenticatedRequest,
  IEnforceAuthenticationHandlerFactory
} from 'pbis-common';
import * as middleware from '../../middleware';

import * as postChallengeRoute from './post-challenge';
import * as getChallengeRoute from './get-challenges';
import * as putChallengeRoute from './put-challenge';
import * as getChallengeByRequestedRoute from './get-challenges-by-challenges-requested';
import * as getChallengeByReceivedRoute from './get-challenges-by-challenges-received';

export function init(app: exp.Application, kernel: Kernel): void {
  const mustBeAuthenticated = kernel.get<IEnforceAuthenticationHandlerFactory>(Symbol.for('IEnforceAuthenticationHandlerFactory'));

  app.post(
    '/quizUp/v1/challenge',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      postChallengeRoute.postChallengesRouteHandler(req, res);
    });

  app.get(
    `/quizUp/v1/challenge`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getChallengeRoute.getChallengesRouteHandler(req, res);
    });

  app.put(
    '/quizUp/v1/challenge/:id',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putChallengeRoute.putChallengesRouteHandler(req, res);
    });
}
