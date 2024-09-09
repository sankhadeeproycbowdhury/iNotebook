const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewere/fetchUser");


//  used to create an authentic user along with  a JWT token for verification
router.post(
  "/create",
  [
    body("email").isEmail(),
    body("name", "Enter a name with atleast length 2").isLength({ min: 2 }),
    body("password", "Enter a password with atleast length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPassword = await bcrypt.hashSync(req.body.password, salt);

    try {
      const user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });

      const data = {
        client: {
          id: user.id,
        },
      };

      const oauthToken = jwt.sign(data, "JWT_secret");
      success = true;
      res.json({ success, oauthToken });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ success, error: "Email already exists" });
      }
      console.error(error);
      return res.status(500).json({ success, error: "Server error" });
    }
  }
);


// Used to login in a pre-existing user
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "Enter a password with atleast length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Incorrect User Credentials" });
      }

      let passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Incorrect User Credentials" });
      }

      const data = {
        client: {
          id: user.id,
        },
      };

      const oauthToken = jwt.sign(data, "JWT_secret");
      success = true;
      res.json({ success, oauthToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success, error: "Internal Server error" });
    }
  }
);


// Fetch loggedin user info
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
});


module.exports = router;
