function cleanValue(value) {
    if (!value) return null;

    // Markdown link:
    // [text](url) → url
    const markdownLink = value.match(/\[.*?\]\((.*?)\)/);

    if (markdownLink) {
        return markdownLink[1].trim();
    }

    return value
        .replace(/\\\*/g, "")
        .replace(/\*\*/g, "")
        .trim();
}


function parseHaprocard(markdown) {
    const data = {};

    // --------------------------------
    // Basic metadata
    // --------------------------------

    const fields = [
        "ID",
        "Category",
        "Status",
        "Author",
        "Date"
    ];

    for (const field of fields) {

        const regex = new RegExp(
            `(?:\\*\\*)?\\\\?\\*\\*${field}:\\\\?\\*\\*(?:\\*\\*)?\\s*(.+)`,
            "i"
        );

        const match = markdown.match(regex);

        if (match) {
            data[field.toLowerCase()] =
                cleanValue(match[1]);
        }
    }


    // --------------------------------
    // Title
    // --------------------------------

    const titleMatch = markdown.match(
        /^#\s+(.+)$/m
    );

    if (titleMatch) {
        data.title = titleMatch[1].trim();
    }


    // --------------------------------
    // Description
    // --------------------------------

    const descriptionMatch = markdown.match(
        /##\s*Description\s*\n([\s\S]*?)(?=\n##\s|\n\*\*|$)/i
    );

    if (descriptionMatch) {
        data.description =
            descriptionMatch[1].trim();
    } else {
        data.description = null;
    }


    // --------------------------------
    // Technologies
    // --------------------------------

    const technologiesMatch = markdown.match(
        /##\s*Technologies\s*\n([\s\S]*?)(?=\n##\s|\n\*\*|$)/i
    );

    if (technologiesMatch) {

        data.technologies =
            technologiesMatch[1]
                .trim()
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

    } else {

        data.technologies = [];

    }


    // --------------------------------
    // Image
    // --------------------------------

    const imageMatch = markdown.match(
        /##\s*Image\s*\n\s*(.+)/i
    );

    if (imageMatch) {
        data.image =
            cleanValue(imageMatch[1]);
    } else {
        data.image = null;
    }


    // --------------------------------
    // Live
    // --------------------------------

    const liveMatch = markdown.match(
        /##\s*Live\s*\n\s*(.+)/i
    );

    if (liveMatch) {
        data.live =
            cleanValue(liveMatch[1]);
    } else {
        data.live = null;
    }


    // --------------------------------
    // GitHub
    // --------------------------------

    const githubMatch = markdown.match(
        /##\s*GitHub\s*\n\s*(.+)/i
    );

    if (githubMatch) {
        data.github =
            cleanValue(githubMatch[1]);
    } else {
        data.github = null;
    }


    // --------------------------------
    // Tags
    // --------------------------------

    const tagsMatch = markdown.match(
        /##\s*Tags\s*\n\s*(.+)/i
    );

    if (tagsMatch) {

        data.tags =
            tagsMatch[1]
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

    } else {

        data.tags = [];

    }


    // --------------------------------
    // Featured
    // --------------------------------

    const featuredMatch = markdown.match(
        /(?:\*\*)?\\\\?\*{2}Featured:\\\\?\*{2}(?:\*\*)?\s*(true|false)/i
    );

    data.featured = featuredMatch
        ? featuredMatch[1].toLowerCase() === "true"
        : false;


    return data;
}


module.exports = {
    parseHaprocard
};