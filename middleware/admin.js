module.exports = function (req, res, next){
    //Assumes it is called after 'auth' middleware    
    //@@if(!req.user.isAdmin) return res.status(403).send('Access denied');
    
    next();
}
