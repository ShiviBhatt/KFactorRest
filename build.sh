#!/bin/bash
set -e # exit if any step fails

npm install
`npm bin`/gulp build

# Install db-migrate package to process migrations
npm install db-migrate 