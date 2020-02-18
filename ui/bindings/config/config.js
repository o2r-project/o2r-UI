/*
 * (C) Copyright 2017 o2r project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const debug = require('debug')('bindings:config');
const path = require('path');

var env = process.env;
var c = {};

c.net={};
c.net.port = env.BINDINGS_PORT || 8092;

c.fs = {};
c.fs.base = env.BINDINGS_BASEPATH || '/tmp/o2r';
c.fs.compendium = path.join(c.fs.base, 'compendium');

debug(c);

module.exports = c;
