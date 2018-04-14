import { kernel } from './ioc-root-scope-config';
import {
  Config,
  IApplicationConfig,
  IApplicationSetup,
  IUIConfig
} from 'pbis-common';

import * as exp from 'express';
import * as utils from './actions/utils';
import * as intervention from './actions/intervention';
import * as swagger from './swagger';

const app = exp();

let initRoutes = function (): void {
  utils.init(app, kernel);
  intervention.init(app, kernel);
  swagger.init(app);
};

const appConfig: IApplicationConfig = {
  applicationName: 'interventions',
  port: Config.getRequired<number>('port'),
  ui: Config.getRequired<IUIConfig>('ui'),
  rootIocContainer: kernel,
  initRoutesCallback: initRoutes
};

let appSetup: IApplicationSetup = kernel.get<IApplicationSetup>(Symbol.for('IApplicationSetup'));
appSetup.setup(app, appConfig);
