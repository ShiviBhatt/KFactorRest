import * as exp from 'express';
import {
  ForbiddenError,
  IAuthenticatedRequest,
  ILoggerFactory,
  NotFoundError,
  BadRequestError,
  USER_TYPE_TEACHER
} from 'pbis-common';
/* import { IInterventionSummary } from '../../models';
import { IInterventionService } from '../../services/intervention'; */
import * as validate from '../../services/validation';
import * as uidUtil from 'library-uid';

export function getChallengesByChallengesRequestedRouteHandler(req: IAuthenticatedRequest, res: exp.Response): void {
  const iocContainer = req.requestIocContainer;
  const log = iocContainer.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('action.challenges.getChallengesByChallengesRequestedRouteHandler');

  // Parse params
  let userUid = req.params.uid.trim();
  if (!validate.isValidUid(userUid)) {
    res.status(400).send('Invalid intervention uid');
    return;
  }
  //interventionUid = uidUtil.addDashes(interventionUid);

  //TODO: Discuss if we need userType validation
  /* if (!(req.userPersona.userType === USER_TYPE_TEACHER)) {
    res.status(403).send('Bad request, userType ' + req.userPersona.userType + ' is not authorised to view this intervention.');
    return;
  } */

  //TODO: call service
  /* let interventionService = iocContainer.get<IInterventionService>(Symbol.for('IInterventionService'));
  interventionService.getIntervention(districtUid, interventionUid)
    .then((results: IInterventionSummary) => {
      return res.type('json').send(results);
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
