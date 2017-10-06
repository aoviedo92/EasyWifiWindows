'use strict';
let Q = require('q');
let childProcess = require('child_process');
let asar = require('asar');
let jetpack = require('fs-jetpack');

let projectDir;
let buildDir;
let manifest;
let appDir;

function init() {
    console.log('----------------------------');
    // Project directory is the root of the application
    projectDir = jetpack;
    console.log('projectDir',projectDir.path());
    // Build directory is our destination where the final build will be placed
    buildDir = projectDir.dir('./build/win-ia32-unpacked');
    console.log('buildDir',buildDir.path());
    // vue app directory: build o app
    appDir = projectDir.dir('./dist/electron');
    // appDir = projectDir.dir('./build-app');
    console.log('build from: ' + appDir.path());
    // angular application's package.json file
    // manifest = appDir.read('./package.json', 'json');
    manifest = projectDir.read('./package.json', 'json');

    return Q();
}

function updateResources() {
    console.log('-------------------');
    console.log('updateResources');
    console.log('copy icon');
    console.log('exists', projectDir.exists('build/icons/icon.ico'));
    projectDir.copy('build/icons/icon.ico', buildDir.path('icon.ico'));
    // projectDir.copy('build/icons/icon.ico', buildDir.path());
    // Replace Electron icon for your own.
    let icon = projectDir.path('build/icons/icon.ico');
    console.log('Replace Electron icon from', icon);
    console.log(manifest.name, 'exists?', buildDir.exists(manifest.name+'.exe'));
    let rcedit = require('rcedit');
    rcedit(buildDir.path(manifest.name+'.exe'), {
        'icon': icon,
        'version-string': {
            'ProductName': manifest.name,
            'FileDescription': manifest.description
        }
    }, function (err) {
        err && console.error(err);
    });
}
function build() {
    return init()
        .then(updateResources)
}
build()