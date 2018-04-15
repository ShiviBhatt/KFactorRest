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
    '/quizUp/v1/challenge',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      postChallengeRoute.postChallengesRouteHandler(req, res);
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
    `/quizUp/v1/challenge`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getChallengeRoute.getChallengesRouteHandler(req, res);
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
    `/quizUp/v1/challengesByChallengesRequested/:uid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getChallengeByRequestedRoute.getChallengesByChallengesRequestedRouteHandler(req, res);
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
    `/quizUp/v1/challengesByChallengesReceived/:uid`,
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      getChallengeByReceivedRoute.getChallengesByChallengesReceivedRouteHandler(req, res);
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
    '/quizUp/v1/challenge/:uid',
    middleware.authenticatedMiddlewares(mustBeAuthenticated),
    (req: IAuthenticatedRequest, res: exp.Response) => {
      putChallengeRoute.putChallengesRouteHandler(req, res);
    });
}
