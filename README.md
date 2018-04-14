# Interventions API

## Project setup
For development on the NodeJs / Typescript stack, if you don't already have them, there are a few tools to download:

*  [NodeJS](https://nodejs.org/en/) - Latest Version.
    * Installing NodeJS also includes NPM which we use as our package management tool.

Once NodeJS is installed, the following tools can all be installed via npm on the command line:

*  [Gulp](https://www.npmjs.com/package/gulp) - Our build management tool. Note that Gulp is installed both globally (in order to be available on the command line as 'gulp') as well as within individual projects.

To install:
```
npm install gulp -g
```
*  [Typescript Compiler (tsc)](https://www.typescriptlang.org) - The compiler that turns your nice Typescript code into the JavaScript equivalent. 

To install:
```
npm install typescript -g
```

### Cloning the repo

1. From a command line, navigate to the parent folder where you would like the project to be cloned.
2. Issue the git clone command for the repo:

```
git clone git@gitswarm.powerschool.com:pbis/interventions-api.git
```

### Gathering dependencies
The first time you clone a NPM managed project, as well as any time dependencies are added to the project, you can use npm to install all dependencies defined in the package.json via:
```
npm install
```
## DB Setup

Install MySQL (version 5.5 or above) on your dev machine. Configure it for i18n by following instructions [here](https://confluence.powerschool.com/display/DevZone/MySQL+utf8mb4+setup).

Databases:
*  intervention - Your local development database. Used when migrations are run and when running this node application.
*  test_intervention - Your local integration test database. Used when integration tests are run. See also the description of SUPPRESS_LOCALTEST_MIGRATIONS 
in the Environment Variables section below.

Database creation:
*  npm run create
*  npm run create-testdb

Config files:
*  `database.json` - Used by db-migrate for its database connection.
*  `config/development.json` - Used by the server application for its MySQL connection configuration.
*  `config/localtest.json` - Used by the integration tests for MySQL connection configuration, etc.

Copy `database.json.sample` file to `database.json` and modify based on your local db config.

Copy `config/development.sample.json` file to `config/development.json` and modify based on your local db config.

Copy `config/localtest.sample.json` file to `config/localtest.json` and modify based on your local test automation db config.

## DB Migration

To migrate database up and down, first install db-migrate package from npm, and then run `db-migrate up` command.

```
$ npm install db-migrate -g
$ db-migrate up
```

To rollback a migration:

```
$ db-migrate down
```

Migration files are under migrations folder. To create a new migration always use `db-migrate create`

```
$ db-migrate create add-products
[INFO] Created migration at ./migrations/20160907015834-add-products.js
```

`db-migrate create` will automatically add timestamp to the migration file. This is used to determine
which migration has not been run on a particular environment.

For more see [db-migrate documentation](https://db-migrate.readthedocs.io/en/latest/)

## Environment Variables
*  SUPPRESS_LOCALTEST_MIGRATIONS - When writing integration tests it can be useful to set this to 'true' for quicker 
development/test cycle. If this variable exists and is set to 'true', then migrations and the seed script won't run for
integration tests. 

## Authentication
To avoid using Ping Federate for authentication you can set `useMockUserService` to `true` in your `development.json`.

## Gulp Tasks

To view available tasks...
```
gulp --tasks
```
For example, to start the server...
```
gulp server
```
or
```
npm start
```
And then open http://localhost:3200
