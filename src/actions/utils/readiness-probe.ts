import * as Promise from 'bluebird';
import * as exp from 'express';
import { Kernel } from 'inversify';
import {
  Config,
  IAccountManagementServiceConfig,
  ICache,
  IConfigObject,
  IReadinessProbe,
  ISqlDataDriver,
  ReadinessProbe
} from 'pbis-common';
import { ServicesConfig } from '../../services/services.config';
export function readinessProbe(req: exp.Request, res: exp.Response, kernel: Kernel): Promise<void> {
  let readyCheck = kernel.get<IReadinessProbe>(Symbol.for('IReadinessProbe'));
  const dbIntervention = kernel.get<ISqlDataDriver>(Symbol.for('ISqlDataDriverIntervention'));
  const dbUnifiedSchema = kernel.get<ISqlDataDriver>(Symbol.for('ISqlDataDriverUnifiedSchema'));
  const redis: ICache = kernel.get<ICache>(Symbol.for('ICache'));
  const accountManagementServiceUrl = ServicesConfig.getAsUrl('accountmanagement') + '/account';
  const entityServiceUrl = ServicesConfig.getAsUrl('entityservice') + '/entity';
  const entityDistrictUrl = ServicesConfig.getAsUrl('entitydistrict');
  let microservices: Array<string> = [accountManagementServiceUrl, entityServiceUrl, entityDistrictUrl];
  let ok = true;
  return Promise.all([
    readyCheck.isDatabaseUp(dbIntervention),
    readyCheck.isDatabaseUp(dbUnifiedSchema),
    readyCheck.isRedisUp(<any>redis),
    readyCheck.areMicroservicesUp(microservices)
  ])
    .then((response) => {
      response.forEach(result => {
        if (result === false) {
          ok = false;
        }
      });
      if (!ok) {
        Promise.resolve(res.sendStatus(500));
      } else {
        Promise.resolve(res.sendStatus(200));
      }
    });
}
