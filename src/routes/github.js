const express = require("express");
const {
    getHaprocardRepositories
} = require("../services/githubService");

const router = express.Router();

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const repos = await getHaprocardRepositories(username);

        const projects = repos.map((repo) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: repo.updated_at
        }));

        res.json({
            success: true,
            username,
            total: projects.length,
            projects
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;