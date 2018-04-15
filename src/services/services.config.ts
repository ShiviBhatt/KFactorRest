import * as _ from 'lodash';
import { Config, ConfigError } from 'pbis-common';

export interface IServiceConfig {
  protocol: string;
  host: string;
  port: number;
}

export class ServicesConfig {
  public static get(serviceName: string): IServiceConfig {
    const cfg = Config.getRequired('services');
    if (cfg[serviceName]) {
      if (_.isNil(cfg[serviceName].protocol)) {
        throw new ConfigError(`Invalid or missing protocol for services configration of ${serviceName}`);
      }
      if (_.isNil(cfg[serviceName].host)) {
        throw new ConfigError(`Invalid or missing host for services configration of ${serviceName}`);
      }
      if (_.isNil(cfg[serviceName].port)) {
        throw new ConfigError(`Invalid or missing port for services configration of ${serviceName}`);
      }
      return {
        protocol: cfg[serviceName].protocol,
        host: cfg[serviceName].host,
        port: +cfg[serviceName].port
      };
    } else {
      throw new ConfigError(`Missing required services configration for ${serviceName}`);
    }
  }

  public static getAsUrl(serviceName: string): string {
    const cfg = ServicesConfig.get(serviceName);
    return `${cfg.protocol}://${cfg.host}:${cfg.port}`;
  }
}
