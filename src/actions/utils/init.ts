import * as exp from 'express';
import * as passport from 'passport';
import { Kernel } from 'inversify';
import { Config } from 'pbis-common';
import * as readinessProbeHandler from './readiness-probe';

interface IRevisionConfig {
  gitSha: string;
  buildNumber: string;
}

export function init(app: exp.Application, kernel: Kernel): void {

  /**
   * @swagger
   * /healthz:
   *   get:
   *     description: Healthcheck
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: healthy
   *     tags:
   *       - Utils
   */
  app.get(
    '/healthz', // adopted from commonportal/services-framework
    (req: exp.Request, res: exp.Response) => {
      const revisionConfig = Config.getRequired<IRevisionConfig>('revision');

      let health = {
        check: [
          { status: 'healthy' }
        ],
        gitSha: revisionConfig.gitSha,
        build: revisionConfig.buildNumber
      };

      res.type('json').send(health);
    });

  /**
   * @swagger
   * /readiness:
   *   get:
   *     description: Readiness Check
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: ready
   *     tags:
   *       - Utils
   */
  app.get(
    '/readiness',
    (req: exp.Request, res: exp.Response) => {
      readinessProbeHandler.readinessProbe(req, res, kernel);
    });
}
