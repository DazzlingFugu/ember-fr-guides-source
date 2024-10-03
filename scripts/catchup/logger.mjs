import chalk from 'chalk'
import { execSync } from 'child_process'

// A shortcut for console.log
export const log = console.log

// Prints fancy success
export function success(message) {
  log(`${chalk.green(message)} ✓`)
}

// Prints fancy error
export function raise(message) {
  log(`${chalk.red('Error:')} ${message}`)
}

// Prints fancy warning
export function warn(message) {
  log(`${chalk.yellow('Warning:')} ${message}`)
}

// Returns fancy action required
export function action(message) {
  return `${chalk.blueBright('ACTION REQUIRED:')} ${message}`
}

/* 
 * Executes a shell command using execSync with an additional log.
 * If the command failed, execSync throws the error, so use runShell inside a try...catch.
 */
export function runShell(command) {
  log(`Attempting to execute: "${chalk.bold(command)}"`);
  execSync(command);
}

/*
 * Prints the messages stored in warnings.
 * Should always be called before forcing the process to exit.
 */
export function printActionsRequired(warnings) {
  if (!warnings.length) return
  log(`
The process has been completed with warnings.
Here are all the actions you should perform manually to fully complete it:

`)
  for (const warning of warnings) {
    warn(warning)
  }
}