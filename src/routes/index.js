const express = require("express");
const githubRoutes = require("./github");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        name: "Haprocard API",
        version: "1.0.0",
        status: "running",
        message: "GitHub to Website Project Showcase API"
    });
});

router.use("/github", githubRoutes);

module.exports = router;