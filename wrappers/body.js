_browserifyRequire.modules[$filename] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var require = function (path) {
        return _browserifyRequire.fromFile($filename, path);
    };
    
    (function () {
        $body;
    }).call(module.exports);
    
    _browserifyRequire.modules[$filename]._cached = module.exports;
    return module.exports;
};
