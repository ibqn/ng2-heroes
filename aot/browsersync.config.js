'use strict';

var fs   = require('fs'),
    path = require('path'),
    url  = require('url');

var baseDirs = ['aot'];

module.exports = {
    server:  baseDirs,
    injectChanges: false,
    files: ['./**/*.{html,css,js}'],
    watchOptions: {
        ignored: 'node_modules'
    },
    middleware: [
        require("connect-logger")(),
        function(req, res, next) {
            var fileName = url.parse(req.url);
            fileName = fileName.href.split(fileName.search).join('');
            var fileExists = baseDirs
            .map(function(e) { return fs.existsSync(e + fileName); })
            .some(function(e) { return e; });
            if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
                req.url = "/index.html";
            }
            return next();
        },
        function(req, res, next) {
            var fileName = url.parse(req.url);
            fileName = fileName.href.split(fileName.search).join("");
            if(fileName.match(/\.gz$/g)) {
                //res.setHeader('Content-Type', 'text/html');
                res.setHeader('Content-Encoding', 'gzip');
            }
            return next();
        },
    ],
    port: 8000,
    reloadDelay: 300,
    reloadDebounce: 500
};
