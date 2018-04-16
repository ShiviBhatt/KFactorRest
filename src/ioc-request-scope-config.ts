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

import {
  UsersService,
  IUsersService,
  IUsersPersistenceService,
  UsersPersistenceService
} from './services/user';

function bindInterventionService(iocContainer: Kernel): void {
  iocContainer.bind<IUsersService>(Symbol.for('IUsersService')).to(UsersService);
  iocContainer.bind<IUsersPersistenceService>(Symbol.for('IUsersPersistenceService')).to(UsersPersistenceService);
}

import {
  UserStatsService,
  IUserStatsService,
  IUserStatsPersistenceService,
  UserStatsPersistenceService
} from './services/user-stats';

function bindUserStatsService(iocContainer: Kernel): void {
  iocContainer.bind<IUserStatsService>(Symbol.for('IUserStatsService')).to(UserStatsService);
  iocContainer.bind<IUserStatsPersistenceService>(Symbol.for('IUserStatsPersistenceService')).to(UserStatsPersistenceService);
}

/* // SPECIALEDUCATION SERVICE
import {
  ISpecialEducationService,
  ISpecialEducationServiceConfig,
  SpecialEducationService,
  SpecialEducationServiceConfig
} from './services/special-education';

function bindSpecialEducationService(iocContainer: Kernel): void {
  iocContainer.bind<ISpecialEducationService>(Symbol.for('ISpecialEducationService')).to(SpecialEducationService);
  iocContainer.bind<ISpecialEducationServiceConfig>(Symbol.for('ISpecialEducationServiceConfig')).to(SpecialEducationServiceConfig);
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

/* //ENTITY SERVICE
import {
  IEntityService,
  IEntityServiceConfig,
  EntityService
} from './services/entity';

function bindEntityService(iocContainer: Kernel): void {
  iocContainer.bind<IEntityService>(Symbol.for('IEntityService')).to(EntityService);
  iocContainer.bind<IEntityServiceConfig>(Symbol.for('IEntityServiceConfig')).toConstantValue({
    serviceUrl: ServicesConfig.getAsUrl('entityservice') + '/entity'
  });
}

//ENTITY DISTRICT
import {
  IEntityDistrict,
  IEntityDistrictConfig,
  EntityDistrict
} from './services/entity-district';

function bindEntityDistrict(iocContainer: Kernel): void {
  iocContainer.bind<IEntityDistrict>(Symbol.for('IEntityDistrict')).to(EntityDistrict);
  iocContainer.bind<IEntityDistrictConfig>(Symbol.for('IEntityDistrictConfig')).toConstantValue({
    serviceUrl: ServicesConfig.getAsUrl('entitydistrict')
  });
} */

export function bindRequestIocConfig(iocContainer: Kernel): void {
  bindHttpService(iocContainer);
  bindOpenIdConnect(iocContainer);
  bindUserService(iocContainer);
  bindInterventionService(iocContainer);
  bindUnifiedSchemaService(iocContainer);
  bindUserStatsService(iocContainer);
  //bindSpecialEducationService(iocContainer);
  //bindEntityService(iocContainer);
  //bindEntityDistrict(iocContainer);
}
