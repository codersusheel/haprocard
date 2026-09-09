function cleanText(value) {
    if (!value) return "";

    // Remove escaped markdown characters
    value = value.replace(/\\([*_`])/g, "$1");

    // Convert markdown link [text](url) to URL
    const linkMatch = value.match(/\[.*?\]\((.*?)\)/);

    if (linkMatch) {
        return linkMatch[1].trim();
    }

    // Remove markdown bold characters
    return value
        .replace(/\*/g, "")
        .trim();
}


// ------------------------------------
// Get metadata field
// ------------------------------------

function getField(markdown, field) {

    const lines = markdown.split("\n");

    for (const line of lines) {

        const cleanLine = line
            .replace(/\\([*_`])/g, "$1")
            .replace(/\*/g, "")
            .trim();

        const regex = new RegExp(
            `^${field}:\\s*(.+)$`,
            "i"
        );

        const match = cleanLine.match(regex);

        if (match) {
            return cleanText(match[1]);
        }
    }

    return null;
}


// ------------------------------------
// Get section content
// ------------------------------------

function getSection(markdown, sectionName) {

    const regex = new RegExp(
        `##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
        "i"
    );

    const match = markdown.match(regex);

    if (!match) {
        return null;
    }

    return match[1].trim();
}


// ------------------------------------
// Parse Haprocard
// ------------------------------------

function parseHaprocard(markdown) {

    // Normalize escaped markdown
    markdown = markdown.replace(/\\([*_`])/g, "$1");


    // --------------------------------
    // Title
    // --------------------------------

    const titleMatch = markdown.match(
        /^#\s+(.+)$/m
    );

    const title = titleMatch
        ? cleanText(titleMatch[1])
        : null;


    // --------------------------------
    // Basic fields
    // --------------------------------

    const id = getField(markdown, "ID");
    const category = getField(markdown, "Category");
    const status = getField(markdown, "Status");
    const author = getField(markdown, "Author");
    const date = getField(markdown, "Date");


    // --------------------------------
    // Description
    // --------------------------------

    const descriptionSection =
        getSection(markdown, "Description");

    const description =
        descriptionSection
            ? descriptionSection.trim()
            : null;


    // --------------------------------
    // Technologies
    // --------------------------------

    const technologiesSection =
        getSection(markdown, "Technologies");

    const technologies =
        technologiesSection
            ? technologiesSection
                .split(",")
                .map(item => cleanText(item))
                .filter(Boolean)
            : [];


    // --------------------------------
    // Image
    // --------------------------------

    const imageSection =
        getSection(markdown, "Image");

    const image =
        imageSection
            ? cleanText(imageSection.split("\n")[0])
            : null;


    // --------------------------------
    // Live
    // --------------------------------

    const liveSection =
        getSection(markdown, "Live");

    const live =
        liveSection
            ? cleanText(liveSection.split("\n")[0])
            : null;


    // --------------------------------
    // GitHub
    // --------------------------------

    const githubSection =
        getSection(markdown, "GitHub");

    const github =
        githubSection
            ? cleanText(githubSection.split("\n")[0])
            : null;


    // --------------------------------
    // Tags
    // --------------------------------

    const tagsSection =
        getSection(markdown, "Tags");

    const tags =
        tagsSection
            ? tagsSection
                .split(",")
                .map(item => cleanText(item))
                .filter(Boolean)
            : [];


    // --------------------------------
    // Featured
    // --------------------------------

    const featuredValue =
        getField(markdown, "Featured");

    const featured =
        featuredValue
            ? featuredValue.toLowerCase() === "true"
            : false;


    // --------------------------------
    // Final object
    // --------------------------------

    return {
        id,
        title,
        category,
        status,
        author,
        date,
        description,
        technologies,
        image,
        live,
        github,
        tags,
        featured
    };
}


module.exports = {
    parseHaprocard
};