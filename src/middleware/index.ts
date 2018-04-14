import * as express from 'express';

import { IEnforceAuthenticationHandlerFactory } from 'pbis-common';
import { bindRequestIoc } from './bind-request-ioc';

export function authenticatedMiddlewares(mustBeAuthenticatedHandlerFactory: IEnforceAuthenticationHandlerFactory): express.RequestHandler[] {
  return [
    bindRequestIoc(),
    mustBeAuthenticatedHandlerFactory.createHandler()
  ];
};
