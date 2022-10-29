const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.replace("Bearer ", "");
    console.log(token);
    const decoded = jwt.verify(token, "secret");
    request.userData = decoded;
    next();
  } catch (err) {
    return response.status(401).json({
      message: "Authentification Failed"
    });
  }
};