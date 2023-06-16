const autoBind = require('auto-bind-inheritance');

module.exports = class Middleware{
    constructor(){
        autoBind(this);
    }
}