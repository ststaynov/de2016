'use strict';

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

// Require the main task definitions
require('./gulp/tasks.js');
