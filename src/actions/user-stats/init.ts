import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  IAuthenticatedRequest,
  IEnforceAuthenticationHandlerFactory
} from 'pbis-common';
import * as middleware from '../../middleware';

import * as getUserStatsRoute from './get-user-stats';

export function init(app: exp.Application, kernel: Kernel): void {
  const mustBeAuthenticated = kernel.get<IEnforceAuthenticationHandlerFactory>(Symbol.for('IEnforceAuthenticationHandlerFactory'));

  //TODO: Fix this
  /**
   * @swagger
   * definitions:
   *   User:
   *     type: object
   *     required:
   *       - uid
   *     properties:
   *       userName:
   *         type: string
   *   Users:
   *      type: array
   *      items: 
   *        $ref: '#/definitions/User'
   */
  /**
   * @swagger
   * /quizUp/v1/user:
   *   get:
   *     description: Gets all users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of users
   *         schema:
   *           $ref: '#/definitions/InterventionSummary'
   *     tags:
   *       - User
   */
  app.get(
    `/quizUp/v1/userStats/:userUid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUserStatsRoute.getUserStatsRouteHandler(req, res);
    });
}
