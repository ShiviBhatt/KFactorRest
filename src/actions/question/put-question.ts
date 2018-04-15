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
import { IUser } from '../../models';

import * as validate from '../../services/validation';
import * as uidUtil from 'library-uid';

export function putQuestionRouteHandler(req: IAuthenticatedRequest, res: exp.Response): void {
  const iocContainer = req.requestIocContainer;
  const log = iocContainer.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('action.question.putQuestionRouteHandler');

  let user: IUser = req.body;
  let errors = [];

  //TODO: Discuss if we need userType validation
  /* if (!(req.userPersona.userType === USER_TYPE_STAFF || req.userPersona.userType === USER_TYPE_POWERSCHOOL_STAFF || req.userPersona.userType === USER_TYPE_TEACHER)) {
    res.status(403).send('Bad request, userType ' + req.userPersona.userType + ' is not authorised to create a new intervention.');
    return;
  } */

  //TODO: call service
  /* let interventionService = iocContainer.get<IInterventionService>(Symbol.for('IInterventionService'));
  interventionService.createIntervention(intervention)
    .then((results: IIntervention) => {
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
    }); */
}
