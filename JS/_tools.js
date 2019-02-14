'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const options = require('../JS/_globalOptions.js');

const tools = {
    capitalize: txt => {
        if (typeof txt === 'string') {
            txt = txt.replace(/\b\w/g, l => l.toUpperCase());
        } else {
            console.log('\x1b[31m', 'What you tried to capitalize isn\'t a string', '\x1b[0m');
        }
        return txt;
    },
    phrase: ({
        phrase,
        terminal = 'base',
        vars = {},
        implicitComfirmation = global.implicitComfirmation
    }) => {
        if (implicitComfirmation) {
            let confirm = tools.phrasing.build({
                phrase,
                terminal: 'implicitComfirmation',
                vars
            });

            if (confirm) {
                vars.confirm = confirm;
            }
        }
        const output = tools.phrasing.build({
            phrase,
            terminal,
            vars
        });

        return output;
    },
    phrasing: {
        build: ({
            phrase,
            terminal,
            vars
        }) => {
            let str = tools.phrasing.find({
                phrase: `${phrase}.${terminal}`
            });
            if (str) {
                str = tools.phrasing.rand(str);
                str = tools.phrasing.tags({
                    str,
                    vars
                });
            }

            return str;
        },
        find: ({
            phrase,
            lib = require('../phrases.json'),
        }) => {
            // check if the phrase exists
            let directions = phrase.split('.'),
                str;

            directions.forEach(x => {
                if (str) {
                    str = str[x];
                } else if (lib[x]) {
                    str = lib[x];
                } else {
                    return false;
                }
            });

            return str;
        },
        rand: str => {
            // choose a random phrase from the array
            let key = 0;
            if (Array.isArray(str)) {
                if (global.randomPhrase && str.length > 0) {
                    key = Math.floor(Math.random() * str.length);
                }
            }
            return str[key];
        },
        tags: ({
            str,
            vars
        }) => {
            // replace tags
            if (Object.keys(vars).length) {
                for (const i in vars) {
                    let r = new RegExp(`<${i}>`, "g");
                    str = str.replace(r, vars[i]);
                }
            }

            return str;
        }
    },
    checkContext: ({
        params,
        contexts
    }) => {
        if (contexts) {
            for (const x of contexts) {
                let name = x.name.split('/');
                name = name[6];
                if (!params[name]) {
                    params[name] = x.parameters[name];

                    // If we're relying on a context, assume it's a follow up
                    global.followUp = true;
                }
            }
        }
        return params;
    }
};

exports = module.exports = tools;