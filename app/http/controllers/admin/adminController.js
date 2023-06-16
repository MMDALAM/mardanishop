const controller = require('app/http/controllers/controller');

class adminController extends controller{
    async showAdmin(req, res, next) {
        try {
            res.render('admin/admin')
        } catch (err) {
            next(err)
        }
    }

}

module.exports = new adminController();