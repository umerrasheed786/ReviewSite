
const handleError = function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ status: false, message: err.message, stack: err.stack,errors:err.errors});
}
module.exports =  handleError