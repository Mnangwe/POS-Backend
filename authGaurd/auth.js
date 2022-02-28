require("dotenv").config();

const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) res.sendStatus(401).send('Failed Authorization')

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken;

// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];

//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token || token == null)
//     return res.status(401).send({ message: "User not logged in" });

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//     if (err) res.status(403).send({ message: err.message });
//     // console.log("from auth: ", user)
//     req.user = user;
//     return next();
//   });
// }

// module.exports = authenticateToken;

