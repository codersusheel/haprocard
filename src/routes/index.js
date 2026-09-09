const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        name: "Haprocard API",
        version: "1.0.0",
        status: "running",
        message: "GitHub to Website Project Showcase API"
    });
});

module.exports = router;