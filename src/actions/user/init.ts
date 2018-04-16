import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  IAuthenticatedRequest,
  IEnforceAuthenticationHandlerFactory
} from 'pbis-common';
import * as middleware from '../../middleware';

import * as postUserRoute from './post-user';
import * as getUserRoute from './get-user';
import * as putUserRoute from './put-user';
import * as deleteUserRoute from './delete-user';
import * as checkUserExistsRoute from './check-user-exists';
import * as showPopUpRoute from './show-pop-up';
import * as getUCUserRoute from './get-UC-User';
import * as getUserByUidRoute from './get-user-by-uid';
import * as getUserByFiltersRoute from './get-user-by-filters';
import { showPopUpHandler } from './show-pop-up';

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
   *   post:
   *     description: Creates a new user
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: input
   *         in: body
   *         description: Input data to create a user
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       201:
   *         description: User was created
   *         schema:
   *           $ref: '#/definitions/User'
   *       400:
   *         description: Invalid user uid
   *     tags:
   *       - User
   */
  app.post(
    '/quizUp/v1/user',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      postUserRoute.postUserRouteHandler(req, res);
    });

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
   *           $ref: '#/definitions/Users'
   *     tags:
   *       - User
   */
  app.get(
    `/quizUp/v1/user`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUserRoute.getUserRouteHandler(req, res);
    });

  app.put(
    '/quizUp/v1/user/:userUid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putUserRoute.putUserRouteHandler(req, res);
    });

  app.delete(
    '/quizUp/v1/user/:userUid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      deleteUserRoute.deleteUserRouteHandler(req, res);
    });

  app.get(
    `/quizUp/v1/user/checkExists/:userUid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      checkUserExistsRoute.checkUserExistsHandler(req, res);
    });

  app.get(
    `/quizUp/v1/user/showPopUp/:userUid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      showPopUpRoute.showPopUpHandler(req, res);
    });

  app.get(
    `/quizUp/v1/user/UC/:userUid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUCUserRoute.getUCUserRouteHandler(req, res);
    });

  app.get(
    `/quizUp/v1/user/:userUid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUserByUidRoute.getUserByUidHandler(req, res);
    });

  app.get(
    `/quizUp/v1/user/filters/:gradeName/:schoolName/:userName`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUserByFiltersRoute.getUserByFiltersHandler(req, res);
    });
}
