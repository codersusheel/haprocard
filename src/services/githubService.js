async function getUserRepositories(username) {
    const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
        throw new Error("GitHub user not found or GitHub API error");
    }

    return await response.json();
}

async function hasHaprocard(username, repo) {
    const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/haprocard.md`
    );

    return response.ok;
}

async function getHaprocardRepositories(username) {
    const repos = await getUserRepositories(username);
    const activeProjects = [];

    for (const repo of repos) {
        const exists = await hasHaprocard(username, repo.name);

        if (exists) {
            activeProjects.push(repo);
        }
    }

    return activeProjects;
}

module.exports = {
    getHaprocardRepositories
};