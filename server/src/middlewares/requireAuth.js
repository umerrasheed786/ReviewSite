const passport = require("passport");

function requireAuth(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized',error:err });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}
module.exports = requireAuth