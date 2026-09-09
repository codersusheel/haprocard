const express = require("express");

const router = express.Router();

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: "GitHub user not found or GitHub API error"
            });
        }

        const repos = await response.json();

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
            message: "Server error"
        });
    }
});

module.exports = router;