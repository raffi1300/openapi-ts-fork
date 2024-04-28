#!/usr/bin/env node

'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import camelCase from 'camelcase';
import { program } from 'commander';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)).toString());

const params = program
    .name(Object.keys(pkg.bin)[0])
    .usage('[options]')
    .version(pkg.version)
    .option('-i, --input <value>', 'OpenAPI specification (path, url, or string content)')
    .option('-o, --output <value>', 'Output directory')
    .option('-c, --client <value>', 'HTTP client to generate [angular, axios, fetch, node, xhr]')
    .option('-d, --debug', 'Run in debug mode?')
    .option('--base [value]', 'Manually set base in OpenAPI config instead of inferring from server value')
    .option('--dry-run [value]', 'Skip writing files to disk?')
    .option('--enums <value>', 'Export enum definitions (javascript, typescript)')
    .option('--exportCore [value]', 'Write core files to disk')
    .option('--exportModels [value]', 'Write models to disk')
    .option('--exportServices [value]', 'Write services to disk')
    .option('--format [value]', 'Process output folder with formatter?')
    .option('--lint [value]', 'Process output folder with linter?')
    .option('--name <value>', 'Custom client class name')
    .option('--operationId [value]', 'Use operationd ID?')
    .option('--postfixServices <value>', 'Service name postfix')
    .option('--request <value>', 'Path to custom request file')
    .option('--schemas [value]', 'Write schemas to disk')
    .option('--serviceResponse [value]', 'Define shape of returned value from service calls')
    .option('--useDateType [value]', 'Output Date instead of string for the format "date-time" in the models')
    .option('--useOptions [value]', 'Use options instead of arguments')
    .parse(process.argv)
    .opts();

const stringToBoolean = value => {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return value;
};

const processParams = (obj, booleanKeys) => {
    for (const key of booleanKeys) {
        const value = obj[key];
        if (typeof value === 'string') {
            const parsedValue = stringToBoolean(value);
            delete obj[key];
            obj[camelCase(key)] = parsedValue;
        }
    }
    return obj;
};

async function start() {
    let userConfig;
    try {
        const { createClient } = await import(new URL('../dist/node/index.js', import.meta.url));
        userConfig = processParams({...params, name: 'Creo'}, [
            'dryRun',
            'exportCore',
            'exportModels',
            'exportServices',
            'format',
            'lint',
            'operationId',
            'schemas',
            'useDateType',
            'useOptions',
        ]);
        await createClient(userConfig);
        process.exit(0);
    } catch (error) {
        if (!userConfig.dryRun) {
            const logName = `openapi-ts-error-${Date.now()}.log`;
            const logPath = path.resolve(process.cwd(), logName);
            writeFileSync(logPath, `${error.message}\n${error.stack}`);
            console.error(`🔥 Unexpected error occurred. Log saved to ${logPath}`);
        }
        console.error(`🔥 Unexpected error occurred. ${error.message}`);
        process.exit(1);
    }
}

start();
