#!/usr/bin/env node

import fs from 'fs';

/**
 * Relative to the root of the project
 */
const DICTIONARY_FILE = '.local.dic';

// Retrieve content of the file
const fileContent = fs.readFileSync(DICTIONARY_FILE, 'utf8');
const fileContentLines = fileContent.split('\n');

// Remove duplicate and empty lines
const uniquesLines = [...new Set(fileContentLines)].filter(Boolean);

// Sort lines
const sortedLines = [...uniquesLines].sort((a, b) => a.localeCompare(b));

// Make sure to have a blank last line
sortedLines.push('');

// Rewrite existing file
fs.writeFileSync(DICTIONARY_FILE, sortedLines.join('\n'));
