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
   *           $ref: '#/definitions/InterventionSummary'
   *     tags:
   *       - User
   */
  app.get(
    `/quizUp/v1/user`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getUserRoute.getUserRouteHandler(req, res);
    });

  //TODO: Fix this swagger comment
  /**
   * @swagger
   * /quizUp/v1/user/student/{studentUid}:
   *   get:
   *     description: Gets a list of interventions for a student
   *     security:
   *       - Bearer: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: studentUid
   *         in: path
   *         description: The studentUid of the student
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A list of interventions for the student
   *         schema:
   *            $ref: '#/definitions/InterventionSummaries'
   *       400:
   *         description: Invalid student uid
   *     tags:
   *       - Intervention
   */
  app.put(
    '/quizUp/v1/user/:userUid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putUserRoute.putUserRouteHandler(req, res);
    });

  //TODO: Fix this comment
  /**
   * @swagger
   * /interventions/v1/intervention/studentgroup/{studentGroupUid}:
   *   get:
   *     description: Gets a list of interventions for a student group
   *     security:
   *       - Bearer: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: studentGroupUid
   *         in: path
   *         description: The studentGroupUid of the student group
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A list of interventions for the student group
   *         schema:
   *            $ref: '#/definitions/InterventionSummaries'
   *       400:
   *         description: Invalid student group uid
   *     tags:
   *       - Intervention
   */
  app.delete(
    '/quizUp/v1/user/:userUid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      deleteUserRoute.deleteUserRouteHandler(req, res);
    });
}
