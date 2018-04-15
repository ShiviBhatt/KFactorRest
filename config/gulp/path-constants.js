let _ = require('lodash');

/**
 * define our paths
 */

// root of where our compiled js goes
const BUILD_PATH = 'build';

// 'real' code goes here
const APP_BUILD_PATH = BUILD_PATH + '/src';

// It is important that our compiled tests ends up with 
// the same relative path to the compiled src that it has
// in its source typescript folder

// i.e. Since the /src and /test folders where the typescript files
// are siblings/adjacent, they must be built into folders which are likewise siblings/adjacent
// This is so we can satisfy the Typescript import at compile time, as well as the require() calls
// these compile into at runtime  
const TEST_BUILD_PATH = BUILD_PATH + '/test';

// group our unit and integration tests separately
const UNIT_TEST_BUILD_PATH = TEST_BUILD_PATH + '/unit';
const INTEGRATION_TEST_BUILD_PATH = TEST_BUILD_PATH + '/integration';

// code coverage folder
const COVERAGE = 'coverage';

/**
 * 'globs' used by Gulp to identify files to be targeted by various tasks
 */
const STATIC_APP_GLOB = ['src/**/*.yaml', 'src/**/*.json'];

// in addition to globbing your src, you will need to include references to your typing indexes
const SRC_FILE_GLOB = ['src/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];

const UNIT_TEST_GLOB = ['test/unit/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];
const INTEGRATION_TEST_GLOB = ['test/integration/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];
const INTEGRATION_TEST_RESOURCE_GLOB = ['test/integration/**/*.sql'];
const TEST_GLOB = _.union(UNIT_TEST_GLOB, INTEGRATION_TEST_GLOB);

const SRC_AND_TEST_GLOB = _.union(SRC_FILE_GLOB, TEST_GLOB);

module.exports = Object.freeze({
  BUILD_PATH: BUILD_PATH,
  APP_BUILD_PATH: APP_BUILD_PATH,
  TEST_BUILD_PATH: TEST_BUILD_PATH,
  UNIT_TEST_BUILD_PATH: UNIT_TEST_BUILD_PATH,
  INTEGRATION_TEST_BUILD_PATH: INTEGRATION_TEST_BUILD_PATH,
  COVERAGE: COVERAGE,
  STATIC_APP_GLOB: STATIC_APP_GLOB,
  SRC_FILE_GLOB: SRC_FILE_GLOB,
  UNIT_TEST_GLOB: UNIT_TEST_GLOB,
  INTEGRATION_TEST_GLOB: INTEGRATION_TEST_GLOB,
  INTEGRATION_TEST_RESOURCE_GLOB: INTEGRATION_TEST_RESOURCE_GLOB,
  TEST_GLOB: TEST_GLOB,
  SRC_AND_TEST_GLOB: SRC_AND_TEST_GLOB
});