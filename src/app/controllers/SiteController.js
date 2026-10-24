
class SiteController {
    index(req, res) {
        
        res.render('user/login',{
            hideHeader: true
        }); 
    }
}

module.exports = new SiteController()