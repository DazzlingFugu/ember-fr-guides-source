#!/usr/bin/env node

import { existsSync } from 'fs';
import { exec } from 'child_process';

function printWarning(message = '') {
  console.error([
    '',
    '**********************************************************************',
    '',
    message,
    '',
    '**********************************************************************',
    '',
  ].join('\n'));
}

/**
 * Relative to the root of the project
 */
const GIT_HOOKS_PATH='.githooks';

if (existsSync(GIT_HOOKS_PATH) === false) {

  printWarning(`Error, please check the folder '${GIT_HOOKS_PATH}' exists.`);
  process.exit(2);

}

exec(`git config core.hooksPath ${GIT_HOOKS_PATH}`);
