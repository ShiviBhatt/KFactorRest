export const SWAGGER_DEFINITIONS = {
    info: {
      title: 'quizUp',
      version: '0.0.1',
      description: ''
    },
    host: 'localhost:4444',
    basePath: '/',
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  };

  export const API_PATHS = [
    './build/src/actions/user/init.js',
    './build/src/actions/utils/init.js'
  ];

  export const SWAGGER_PATH = '/user';
