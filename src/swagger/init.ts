const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
import * as exp from 'express';
import * as config from './config';

export function init(app: exp.Application): void {
  const options = {
    swaggerDefinition: config.SWAGGER_DEFINITIONS,
    apis: config.API_PATHS
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use(config.SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
