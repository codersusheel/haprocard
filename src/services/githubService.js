console.log(
    "GitHub Token Loaded:",
    process.env.GITHUB_TOKEN ? "YES" : "NO"
);


// ------------------------------------
// GitHub API Fetch
// ------------------------------------

async function githubFetch(url) {
    const response = await fetch(url, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "GitHub API request failed"
        );
    }

    return data;
}


// ------------------------------------
// Get user repositories
// ------------------------------------

async function getUserRepositories(username) {
    const url =
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

    return await githubFetch(url);
}


// ------------------------------------
// Get haprocard.md
// ------------------------------------

async function getHaprocardFile(username, repo) {
    const url =
        `https://api.github.com/repos/${username}/${repo}/contents/haprocard.md`;

    try {
        const data = await githubFetch(url);

        if (!data.content) {
            return null;
        }

        return Buffer
            .from(data.content, "base64")
            .toString("utf8");

    } catch {
        return null;
    }
}


// ------------------------------------
// Get active Haprocard projects
// ------------------------------------

async function getHaprocardRepositories(username) {
    const repos = await getUserRepositories(username);

    const activeProjects = [];

    for (const repo of repos) {

        const markdown = await getHaprocardFile(
            username,
            repo.name
        );

        if (markdown) {
            activeProjects.push({
                repo,
                markdown
            });
        }
    }

    return activeProjects;
}


module.exports = {
    getHaprocardRepositories
};












// ------------------------------------
// Get single Haprocard project
// ------------------------------------

async function getHaprocardRepository(username, repo) {

    const markdown = await getHaprocardFile(
        username,
        repo
    );

    if (!markdown) {
        return null;
    }

    const repositories =
        await getUserRepositories(username);

    const repository =
        repositories.find(
            item => item.name.toLowerCase() === repo.toLowerCase()
        );

    if (!repository) {
        return null;
    }

    return {
        repo: repository,
        markdown
    };
}


// ------------------------------------
// Export
// ------------------------------------

module.exports = {
    getHaprocardRepositories,
    getHaprocardRepository
};