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
    buildDir = projectDir.dir('./build/built-electron', {empty: true});
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

function copyElectron() {
    console.log('Copying electron to ' + buildDir.path());
    // var electronDist = 'D:/tools/Development/node/electron-v1.4.15-win32-ia32';
    let electronDist = 'D:/tools/Development/node/electron-v1.7.4-win32-ia32';
    return projectDir.copyAsync(electronDist, buildDir.path(), {overwrite: true});
}

function cleanupRuntime() {
    console.log('----------------------');
    console.log('cleanupRuntime');
    console.log('exists', buildDir.exists('resources/default_app'));
    return buildDir.removeAsync('resources/default_app');
}

function createAsar() {
    console.log('-----------------------------');
    console.log('createAsar');
    let deferred = Q.defer();
    asar.createPackage(appDir.path(), buildDir.path('resources/app.asar'), function () {
        console.log('paquete asar creado');
        deferred.resolve();
    });
    return deferred.promise;
}

function updateResources() {
    console.log('-------------------');
    console.log('updateResources');
    let deferred = Q.defer();

    // Copy your icon from resource folder into build folder.
    // projectDir.copy('resources/windows/icon.ico', buildDir.path('icon.ico'));
    // console.log('copy icon from', projectDir.dir('./build/icons/icon.ico').path(), 'to', buildDir.path());
    console.log('copy icon');
    console.log('exists', projectDir.exists('build/icons/icon.ico'));
    projectDir.copy('build/icons/icon.ico', buildDir.path('icon.ico'));
    // projectDir.copy('build/icons/icon.ico', buildDir.path());
    // Replace Electron icon for your own.
    let icon = projectDir.path('build/icons/icon.ico');
    console.log('Replace Electron icon from', icon);
    let rcedit = require('rcedit');
    rcedit(buildDir.path('electron.exe'), {
        'icon': icon,
        'version-string': {
            'ProductName': manifest.name,
            'FileDescription': manifest.description
        }
    }, function (err) {
        if (!err) {
            deferred.resolve();
        }
    });
    return deferred.promise;
}
//Rename the electron exe
function rename() {
    console.log('--------------------');
    console.log('rename');
    console.log('from: electron.exe to:', manifest.name + '.exe');
    return buildDir.renameAsync('electron.exe', manifest.name + '.exe');
}

function createInstaller() {
    var deferred = Q.defer();

    function replace(str, patterns) {
        Object.keys(patterns).forEach(function (pattern) {
            console.log(pattern);
            var matcher = new RegExp('{{' + pattern + '}}', 'g');
            str = str.replace(matcher, patterns[pattern]);
        });
        return str;
    }

    var installScript = projectDir.read('resources/windows/installer.nsi');

    installScript = replace(installScript, {
        name: manifest.name,
        productName: manifest.name,
        version: manifest.version,
        src: buildDir.path(),
        dest: projectDir.path('dist/'+manifest.name+'.exe'),
        icon: buildDir.path('icon.ico'),
        setupIcon: buildDir.path('icon.ico'),
        banner: projectDir.path('resources/windows/banner.bmp')
    });
    buildDir.write('installer.nsi', installScript);

    // Note: NSIS have to be added to PATH (environment variables).
    var nsis = childProcess.spawn("C:/Program Files (x86)/NSIS/makensis.exe", [buildDir.path('installer.nsi')], {
        stdio: 'inherit'
    });

    nsis.on('error', function (err) {
        if (err.message === 'spawn makensis ENOENT') {
            throw "Can't find NSIS. Are you sure you've installed it and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });

    nsis.on('close', function () {
        deferred.resolve();
    });

    return deferred.promise;

}

function build() {
    return init()
        // .then(copyElectron)
        // .then(cleanupRuntime)
        // .then(createAsar)
        .then(updateResources)
        // .then(rename)
        // .then(createInstaller);
}


module.exports = {
    build: build
};

build();
