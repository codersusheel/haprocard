const express = require("express");

const {
    getHaprocardRepositories
} = require("../services/githubService");

const {
    parseHaprocard
} = require("../utils/haprocardParser");

const router = express.Router();

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const repositories =
            await getHaprocardRepositories(username);

        const projects = repositories.map(
            ({ repo, markdown }) => {

                console.log("========== HAPROCARD ==========");
                console.log("Repository:", repo.name);
                console.log("Markdown:");
                console.log(markdown);

                const card =
                    parseHaprocard(markdown);

                console.log("Parsed Card:");
                console.log(card);

                return {
                    ...card,

                    github: card.github || repo.html_url,

                    live: card.live || repo.homepage || null,

                    repository: {
                        name: repo.name,
                        language: repo.language,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        updated: repo.updated_at
                    }
                };
            }
        );

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