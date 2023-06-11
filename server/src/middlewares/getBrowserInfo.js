const useragent = require("useragent");

function getBrowserInfo(req, res, next) {
  req.useragent = useragent.parse(req.headers["user-agent"]);
  next();
}
module.exports = getBrowserInfo;
