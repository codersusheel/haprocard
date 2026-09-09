
console.log(
    "GitHub Token Loaded:",
    process.env.GITHUB_TOKEN ? "YES" : "NO"
);



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


async function getUserRepositories(username) {
    const url =
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

    return await githubFetch(url);
}


async function hasHaprocard(username, repo) {
    const url =
        `https://api.github.com/repos/${username}/${repo}/contents/haprocard.md`;

    try {
        await githubFetch(url);
        return true;
    } catch {
        return false;
    }
}


async function getHaprocardRepositories(username) {
    const repos = await getUserRepositories(username);

    const activeProjects = [];

    for (const repo of repos) {
        const exists = await hasHaprocard(
            username,
            repo.name
        );

        if (exists) {
            activeProjects.push(repo);
        }
    }

    return activeProjects;
}


module.exports = {
    getHaprocardRepositories
};