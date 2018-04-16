import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  IAuthenticatedRequest,
  IEnforceAuthenticationHandlerFactory
} from 'pbis-common';
import * as middleware from '../../middleware';

import * as postLeaderboardRoute from './post-leaderboard';
import * as getLeaderboardByScoresRoute from './get-leaderboard-by-scores';
import * as getLeaderboardByWinsRoute from './get-leaderboard-by-wins';
import * as putLeaderboardRoute from './put-leaderboard';

export function init(app: exp.Application, kernel: Kernel): void {
  const mustBeAuthenticated = kernel.get<IEnforceAuthenticationHandlerFactory>(Symbol.for('IEnforceAuthenticationHandlerFactory'));

  app.post(
    '/quizUp/v1/leaderboard',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      postLeaderboardRoute.postLeaderboardRouteHandler(req, res);
    });

  app.get(
    '/quizUp/v1/leaderboardByWins',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getLeaderboardByWinsRoute.getLeaderboardByWinsRouteHandler(req, res);
    });

  app.get(
    '/quizUp/v1/leaderboardByScores',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getLeaderboardByScoresRoute.getLeaderboardByScoresRouteHandler(req, res);
    });

  app.put(
    '/quizUp/v1/leaderboard/:leaderboardUid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putLeaderboardRoute.putLeaderboardRouteHandler(req, res);
    });
}
