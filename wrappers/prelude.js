function require (path) {
    // not EXACTLY like how node does it but more appropriate for the browser
    var mod
        = require.modules[path]
        || require.modules[path + '.js']
        || require.modules[path + '/index']
        || require.modules[path + '/index.js']
    ;
    
    if (!mod) throw new Error("Cannot find module '" + path + "'");
    return mod._cached ? mod._cached : mod();
}

var _browserifyRequire = require; // scoping >_<

require.modules = {};

require.fromFile = function (filename, path) {
    // require a file with respect to a path
    var resolved = _browserifyRequire.resolve(filename, path);
    return _browserifyRequire(resolved)
};

require.resolve = function (basefile, file) {
    if (!file.match(/^[\.\/]/)) return file;
    
    var basedir = basefile.match(/^[\.\/]/)
        ? basefile.replace(/[^\/]+$/, '')
        : basefile
    ;
    if (basedir === '') {
        basedir = '.';
    }
    
    var norm = file.replace(/[^\/]+\/\.\./g).replace(/\/+/g,'/');
    while (norm.match(/^\.\.\//)) {
        norm = norm.replace(/^\.\.\//, '');
        basedir = basedir.replace(/^[^\/]+$/, '');
        if (basedir === '') throw new Error("Couldn't resolve path"
            + "'" + file + "' with respect to filename '" + basefile + "': "
            + "file can't resolve past base"
        );
    }
    
    var n = basedir.match(/\//)
        ? basedir.replace(/[^\/]+$/,'') + norm
        : norm.replace(/^\.\//, basedir + '/');
    return n.replace(/\/.\//, '/');
};
