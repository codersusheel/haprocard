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

                const card =
                    parseHaprocard(markdown);

                return {
                    ...card,

                    // GitHub repository fallback data
                    github: card.github || repo.html_url,

                    // If Live is missing, use GitHub homepage
                    live: card.live || repo.homepage || null,

                    // GitHub repository information
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