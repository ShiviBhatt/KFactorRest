import * as express from 'express';

import { IRequestWithIocContainer } from 'pbis-common';
import { bindRequestIocConfig } from '../ioc-request-scope-config';

export function bindRequestIoc(): express.RequestHandler {
  return function (req: IRequestWithIocContainer, res: express.Response, next: express.NextFunction): void {
    if (!req.requestIocContainer) {
      next();
      return;
    }

    const iocContainer = req.requestIocContainer;
    bindRequestIocConfig(iocContainer);
    next();
  };
}
