#!/bin/bash
set -e # exit if any step fails
 
cp  config/localtest.sample.json config/localtest.json
cp  database.sample.json database.json

`npm bin`/gulp unit
`npm bin`/gulp coverage