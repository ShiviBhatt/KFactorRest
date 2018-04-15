import { Kernel } from 'inversify';
import 'reflect-metadata';

import {
  Config,
  ILogger,
  ILoggerFactory
} from 'pbis-common';

//HTTP SERVICE
import {
  IHttpService
} from 'pbis-common';
import {
  HttpService
} from 'pbis-common';
function bindHttpService(iocContainer: Kernel): void {
  iocContainer.bind<IHttpService>(Symbol.for('IHttpService')).to(HttpService);
}

//OPEN-ID CONNECT CLIENT SERVICE
import {
  IOpenIdConnectClient,
  OpenIdConnectClient,
  IOpenIdConnectClientConfig
} from 'pbis-common';
function bindOpenIdConnect(iocContainer: Kernel): void {
  const openIdConfig = Config.getRequired<IOpenIdConnectClientConfig>('openIdConnectClient');
  iocContainer.bind<IOpenIdConnectClient>(Symbol.for('IOpenIdConnectClient')).toConstantValue(new OpenIdConnectClient(openIdConfig));
}
//USER SERVICE
import {
  IAccountManagementService,
  IAccountManagementServiceConfig,
  AccountManagementService,
  AccountManagementServiceConfig,
  IUserService,
  IUserServiceConfig,
  UserService,
  UserServiceConfig,
  MockUserService,
  UserInfoRI,
  IMockUser
} from 'pbis-common';
import { ServicesConfig } from './services/services.config';
function bindUserService(iocContainer: Kernel): void {
  const log = iocContainer.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('ioc-config');

  iocContainer.bind<IUserServiceConfig>(Symbol.for('IUserServiceConfig')).to(UserServiceConfig);
  iocContainer.bind<IAccountManagementServiceConfig>(Symbol.for('IAccountManagementServiceConfig')).toConstantValue({
    serviceUrl: ServicesConfig.getAsUrl('accountmanagement') + '/account'
  });
  iocContainer.bind<AccountManagementService>(Symbol.for('IAccountManagementService')).to(AccountManagementService);

  if (Config.get<boolean>('useMockUserService')) {
    log.warn(`!!! Using a Mock User Service. DO NOT USE IN PRODUCTION!!!`);
    let mockUser = Config.get<IMockUser>('mockUser');
    let mockUserService = new MockUserService(mockUser);
    iocContainer.bind<IUserService>(Symbol.for('IUserService')).toConstantValue(mockUserService);
  } else {
    iocContainer.bind<IUserService>(Symbol.for('IUserService')).to(UserService);
  }
}

/* import {
  InterventionService,
  IInterventionService,
  IInterventionPersistenceService,
  InterventionPersistenceService
} from './services/intervention';

function bindInterventionService(iocContainer: Kernel): void {
  iocContainer.bind<IInterventionService>(Symbol.for('IInterventionService')).to(InterventionService);
  iocContainer.bind<IInterventionPersistenceService>(Symbol.for('IInterventionPersistenceService')).to(InterventionPersistenceService);
}
 */
// UNIFIEDSCHEMA SERVICE
import {
  IUnifiedSchemaService,
  UnifiedSchemaService
} from './services/unified-schema';

function bindUnifiedSchemaService(iocContainer: Kernel): void {
  iocContainer.bind<IUnifiedSchemaService>(Symbol.for('IUnifiedSchemaService')).to(UnifiedSchemaService);
}

export function bindRequestIocConfig(iocContainer: Kernel): void {
  bindHttpService(iocContainer);
  bindOpenIdConnect(iocContainer);
  bindUserService(iocContainer);
  //bindInterventionService(iocContainer);
  bindUnifiedSchemaService(iocContainer);
}
