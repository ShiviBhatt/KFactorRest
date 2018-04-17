import * as exp from 'express';
import {
  ForbiddenError,
  IAuthenticatedRequest,
  ILoggerFactory,
  NotFoundError,
  BadRequestError,
  USER_TYPE_TEACHER,
  USER_TYPE_POWERSCHOOL_STAFF,
  USER_TYPE_STAFF,
  IUIConfig
} from 'pbis-common';
import { IChallengesService } from '../../services/challenges';
import * as validate from '../../services/validation';
import * as uidUtil from 'library-uid';

export function postChallengesRouteHandler(req: IAuthenticatedRequest, res: exp.Response): void {
  const iocContainer = req.requestIocContainer;
  const log = iocContainer.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('action.challenges.postChallengesRouteHandler');

  let challenge: any = req.body;
  let errors = [];

  let challengesService = iocContainer.get<IChallengesService>(Symbol.for('IChallengesService'));
  challengesService.createChallenge(challenge)
    .then((results: any) => {
      return res.status(201).type('json').send(results);
    })
    .catch((error) => {
      if (error instanceof NotFoundError) {
        res.status(404).send(error.message);
      } else if (error instanceof ForbiddenError) {
        res.status(403).send(error.message);
      } else if (error instanceof BadRequestError) {
        res.status(400).send(error.message);
      } else {
        log.error(error);
        res.status(500).send(error);
      }
    });
}
