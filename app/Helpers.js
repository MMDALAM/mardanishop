const path = require('path');
const autoBind = require('auto-bind-inheritance');
const moment = require('jalali-moment');
moment.locale('fa', { useGregorianParser: true }); 

module.exports = class Helpers{
    constructor(req, res) {
        autoBind(this);
        this.req = req;
        this.res = res;
    }

    getObjects() {
        return {
            auth: this.auth(),
            viewPath : this.viewPath,
            ...this.getGlobalVaribales(),
            req: this.req,
            date: this.date,
        }
    }

    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user
        }
    }

    getGlobalVaribales() {
        return {
            errors : this.req.flash('errors')
        }
    }

    viewPath(dir) {
        return path.resolve(config.layout.view_dir + '/' + dir)
    }

    date(time) {
        return moment(time);
    }
}