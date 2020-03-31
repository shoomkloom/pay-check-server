
module.exports = function asyncMiddleware(handler){
    return async (req, res, next) => {
        try{
            await handle(req, res);
        }
        catch(ex){
            next(ex);
        }
    };
}