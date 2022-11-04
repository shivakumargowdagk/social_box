const express = require('express')

const {
    signup,
    isActiveUser,
    loginWithPassword,
    loginWithoutPassword,
    IsLoggedIn
} = require("../controllers/Auth");

const router = express.Router();

router.post("/register", signup);

router.get("/isActiveUser/:id", isActiveUser);

router.post("/login", loginWithPassword);

router.post(`/loginWithoutPassword`, loginWithoutPassword);

router.get("/:id/login", IsLoggedIn);


module.exports = router;