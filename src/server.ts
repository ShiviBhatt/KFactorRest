import { kernel } from './ioc-root-scope-config';
import {
  Config,
  IApplicationConfig,
  IApplicationSetup,
  IUIConfig
} from 'pbis-common';

import * as exp from 'express';
import * as utils from './actions/utils';
import * as user from './actions/user';
import * as userStats from './actions/user-stats';
import * as leaderboard from './actions/leaderboard';
import * as quiz from './actions/quiz';
import * as swagger from './swagger';
import * as cors from 'cors';

const app = exp();

app.use(cors());

let initRoutes = function (): void {
  utils.init(app, kernel);
  user.init(app, kernel);
  userStats.init(app, kernel);
  leaderboard.init(app, kernel);
  quiz.init(app, kernel);
  swagger.init(app);
};

const appConfig: IApplicationConfig = {
  applicationName: 'quizUp',
  port: Config.getRequired<number>('port'),
  ui: Config.getRequired<IUIConfig>('ui'),
  rootIocContainer: kernel,
  initRoutesCallback: initRoutes
};

let appSetup: IApplicationSetup = kernel.get<IApplicationSetup>(Symbol.for('IApplicationSetup'));
appSetup.setup(app, appConfig);
