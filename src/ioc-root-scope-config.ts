import { Kernel } from 'inversify';
import 'reflect-metadata';
import {
  Config,
  INJECTABLE_SERVICE_NAME
} from 'pbis-common';

export let kernel = new Kernel();

//Add injectables to kernel

//GENERAL
kernel.bind(INJECTABLE_SERVICE_NAME).toConstantValue('interventions-api');

//LOGGER
import {
  ILogContext,
  ILoggerLevelResolver,
  ProcessEnvironmentLoggerLevelResolver,
  ILoggerFactory,
  BunyanLoggerFactory,
  ILogger
} from 'pbis-common';
kernel.bind<ILoggerLevelResolver>(Symbol.for('ILoggerLevelResolver')).to(ProcessEnvironmentLoggerLevelResolver).inSingletonScope;
kernel.bind<ILoggerFactory>(Symbol.for('ILoggerFactory')).to(BunyanLoggerFactory).inSingletonScope;
kernel.bind<ILogContext>(Symbol.for('ILogContext')).toConstantValue({
  serviceInstanceId: process.env.NODE_APP_INSTANCE || '',
  buildVersion: process.env.BUILD_VERSION || ''
});

const log: ILogger = kernel.get<ILoggerFactory>(Symbol.for('ILoggerFactory')).getLogger('ioc-config');

//SQL DATA ACCESS
import * as mysql from 'mysql';
import { IPoolConfig } from 'mysql';
import { ISqlDataDriver, MySqlDataDriver } from 'pbis-common';
const interventionSqlConfig = Config.getRequired<IPoolConfig>('dbConfigIntervention');
const unifiedSchemaSqlConfig = Config.getRequired<IPoolConfig>('dbConfigUnifiedSchema');
kernel.bind<ISqlDataDriver>(Symbol.for('ISqlDataDriverIntervention')).toConstantValue(new MySqlDataDriver(mysql.createPool(interventionSqlConfig)));
kernel.bind<ISqlDataDriver>(Symbol.for('ISqlDataDriverUnifiedSchema')).toConstantValue(new MySqlDataDriver(mysql.createPool(unifiedSchemaSqlConfig)));

//REDIS CACHE
import {
  ICache,
  RedisCache,
  IRedisCacheConfig
} from 'pbis-common';
const cacheConfig = Config.getRequired<IRedisCacheConfig>('cacheConfig');
kernel.bind<ICache>(Symbol.for('ICache')).toConstantValue(new RedisCache(cacheConfig));

//AUTHENTICATION MIDDLEWARE
import {
  IEnforceAuthenticationHandlerFactory,
  EnforceAuthenticationHandlerFactory
} from 'pbis-common';
kernel.bind<IEnforceAuthenticationHandlerFactory>(Symbol.for('IEnforceAuthenticationHandlerFactory')).to(EnforceAuthenticationHandlerFactory);

//READINESS PROBE
import {
  IReadinessProbe,
  ReadinessProbe
} from 'pbis-common';
kernel.bind<IReadinessProbe>(Symbol.for('IReadinessProbe')).to(ReadinessProbe);

//APPLICATION SETUP
import {
  IApplicationSetup,
  ApplicationSetup
} from 'pbis-common';
kernel.bind<IApplicationSetup>(Symbol.for('IApplicationSetup')).to(ApplicationSetup);

//VALIDATION
import { IInterventionCreateModel, IIntervention } from './models';
import {
  IModelValidator
} from './services/validation';
import {
  CreateInterventionValidator,
  InterventionValidator
} from './services/validation/implementations';

kernel.bind<IModelValidator<IInterventionCreateModel>>(Symbol.for('IModelValidator<ICreateIntervention>')).to(CreateInterventionValidator);
kernel.bind<IModelValidator<IIntervention>>(Symbol.for('IModelValidator<IIntervention>')).to(InterventionValidator);

//FAKE CURRENT PERSONA
import {
  ICurrentPersonaService,
  IUserPersona
} from 'pbis-common';
const noopCurrentPersonaService: ICurrentPersonaService = {
  getCurrentPersona(): IUserPersona {
    throw new Error('Attempt to get current persona at root scope.');
  }
};
kernel.bind<ICurrentPersonaService>(Symbol.for('ICurrentPersonaService')).toConstantValue(noopCurrentPersonaService);
