const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  const token = req.header("oauthToken");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Plaese authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, "JWT_secret");
    req.user = data.client;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Plaese authenticate using valid token" });
  }
};

module.exports = fetchUser;
