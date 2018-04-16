import * as exp from 'express';
import {
  ForbiddenError,
  IAuthenticatedRequest,
  ILoggerFactory,
  NotFoundError,
  BadRequestError,
  USER_TYPE_TEACHER
} from 'pbis-common';
import { IUserStats } from '../../models';
import { IUserStatsService } from '../../services/user-stats';
import * as validate from '../../services/validation';
import * as uidUtil from 'library-uid';

export function getUserStatsRouteHandler(req: IAuthenticatedRequest, res: exp.Response): void {
  const iocContainer = req.requestIocContainer;
  const log = iocContainer.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('action.userStats.getUserStatsRouteHandler');
  let userId = req.params.userUid.trim();
  let userStatsService = iocContainer.get<IUserStatsService>(Symbol.for('IUserStatsService'));
  userStatsService.getUsersStats(userId)
    .then((results: IUserStats) => {
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
    });
}
