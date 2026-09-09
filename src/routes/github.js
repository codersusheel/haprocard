// const express = require("express");

// const {
//     getHaprocardRepositories
// } = require("../services/githubService");

// const {
//     parseHaprocard
// } = require("../utils/haprocardParser");

// const router = express.Router();

// router.get("/:username", async (req, res) => {
//     const { username } = req.params;

//     try {
//         const repositories =
//             await getHaprocardRepositories(username);

//         const projects = repositories.map(
//             ({ repo, markdown }) => {

//                 console.log("========== HAPROCARD ==========");
//                 console.log("Repository:", repo.name);
//                 console.log("Markdown:");
//                 console.log(markdown);

//                 const card =
//                     parseHaprocard(markdown);

//                 console.log("Parsed Card:");
//                 console.log(card);

//                 return {
//                     ...card,

//                     github: card.github || repo.html_url,

//                     live: card.live || repo.homepage || null,

//                     repository: {
//                         name: repo.name,
//                         language: repo.language,
//                         stars: repo.stargazers_count,
//                         forks: repo.forks_count,
//                         updated: repo.updated_at
//                     }
//                 };
//             }
//         );

//         res.json({
//             success: true,
//             username,
//             total: projects.length,
//             projects
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// module.exports = router;
















const express = require("express");

const {
    getHaprocardRepositories,
    getHaprocardRepository
} = require("../services/githubService");

const {
    parseHaprocard
} = require("../utils/haprocardParser");

const router = express.Router();


// ====================================
// GET ALL PROJECTS
// ====================================

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

                    github:
                        card.github ||
                        repo.html_url,

                    live:
                        card.live ||
                        repo.homepage ||
                        null,

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


// ====================================
// GET SINGLE PROJECT
// ====================================

router.get("/:username/:repo", async (req, res) => {

    const {
        username,
        repo
    } = req.params;

    try {

        const result =
            await getHaprocardRepository(
                username,
                repo
            );

        if (!result) {

            return res.status(404).json({
                success: false,
                message:
                    "Haprocard project not found"
            });
        }

        const card =
            parseHaprocard(
                result.markdown
            );

        const project = {

            ...card,

            github:
                card.github ||
                result.repo.html_url,

            live:
                card.live ||
                result.repo.homepage ||
                null,

            repository: {
                name: result.repo.name,
                language: result.repo.language,
                stars: result.repo.stargazers_count,
                forks: result.repo.forks_count,
                updated: result.repo.updated_at
            }
        };

        res.json({
            success: true,
            username,
            project
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