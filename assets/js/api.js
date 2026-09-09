





// const API_URL = "http://localhost:3000/github/codersusheel";

// const projectsContainer =
//     document.getElementById("projects");

// async function loadProjects() {

//     try {

//         console.log("Fetching:", API_URL);

//         const response =
//             await fetch(API_URL);

//         console.log("Status:", response.status);

//         const data =
//             await response.json();

//         console.log("API Data:", data);

//         if (!data.success) {
//             throw new Error(data.message || "API failed");
//         }

//         projectsContainer.innerHTML = `
//             <h2>API Connected ✅</h2>
//             <p>Total Projects: ${data.total}</p>
//         `;

//     } catch (error) {

//         console.error("Haprocard Error:", error);

//         projectsContainer.innerHTML = `
//             <h2>Failed to load projects ❌</h2>
//             <p>${error.message}</p>
//         `;
//     }
// }

// loadProjects();






















// const API_URL = "http://localhost:3000/github/codersusheel";

// const projectsContainer = document.getElementById("projects");


// // ====================================
// // Load Projects
// // ====================================

// async function loadProjects() {

//     try {

//         projectsContainer.innerHTML =
//             "<p>Loading projects...</p>";

//         const response = await fetch(API_URL);

//         if (!response.ok) {
//             throw new Error("API request failed");
//         }

//         const data = await response.json();

//         if (!data.success) {
//             throw new Error(data.message || "API failed");
//         }

//         renderProjects(data.projects);

//     } catch (error) {

//         console.error("Haprocard Error:", error);

//         projectsContainer.innerHTML = `
//             <h2>Failed to load projects ❌</h2>
//             <p>${error.message}</p>
//         `;
//     }
// }


// // ====================================
// // Render Projects
// // ====================================

// function renderProjects(projects) {

//     if (!projects.length) {

//         projectsContainer.innerHTML = `
//             <p>No projects found.</p>
//         `;

//         return;
//     }

//     projectsContainer.innerHTML = projects.map(project => `

//         <article class="project-card">

//             ${
//                 project.image
//                     ? `
//                         <img
//                             src="${project.image}"
//                             alt="${project.title || project.id}"
//                             class="project-image"
//                         >
//                     `
//                     : ""
//             }

//             <div class="project-content">

//                 <h2>
//                     ${project.title || project.id}
//                 </h2>

//                 ${
//                     project.category
//                         ? `<p>${project.category}</p>`
//                         : ""
//                 }

//                 ${
//                     project.description
//                         ? `<p>${project.description}</p>`
//                         : ""
//                 }

//                 ${
//                     project.technologies?.length
//                         ? `
//                             <p>
//                                 <strong>Technologies:</strong>
//                                 ${project.technologies.join(", ")}
//                             </p>
//                         `
//                         : ""
//                 }

//                 <div class="project-links">

//                     ${
//                         project.live
//                             ? `
//                                 <a
//                                     href="${project.live}"
//                                     target="_blank"
//                                     rel="noopener"
//                                 >
//                                     Live Demo
//                                 </a>
//                             `
//                             : ""
//                     }

//                     ${
//                         project.github
//                             ? `
//                                 <a
//                                     href="${project.github}"
//                                     target="_blank"
//                                     rel="noopener"
//                                 >
//                                     GitHub
//                                 </a>
//                             `
//                             : ""
//                     }

//                 </div>

//             </div>

//         </article>

//     `).join("");
// }


// // ====================================
// // Start API
// // ====================================

// loadProjects();




























const API_URL = "http://localhost:3000/github/codersusheel";

const projectsContainer =
document.getElementById("projects");

// ====================================
// Clean Markdown
// ====================================

function cleanMarkdown(value) {

if (!value) {
    return "";
}

return value
    .replace(/\\([*_`])/g, "$1")
    .replace(/!\[([^\]]*)\]\((.*?)\)/g, "$2")
    .replace(/\[([^\]]*)\]\((.*?)\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

}

// ====================================
// Clean URL
// ====================================

function cleanUrl(value) {

if (!value) {
    return "";
}

const markdownImage =
    value.match(/!\[.*?\]\((.*?)\)/);

if (markdownImage) {
    return markdownImage[1].trim();
}

const markdownLink =
    value.match(/\[.*?\]\((.*?)\)/);

if (markdownLink) {
    return markdownLink[1].trim();
}

return value.trim();

}

// ====================================
// Escape HTML
// ====================================

function escapeHTML(value) {

if (!value) {
    return "";
}

return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ====================================
// Load Projects
// ====================================

async function loadProjects() {

try {

    projectsContainer.innerHTML = `
        <p class="loading">
            Loading projects...
        </p>
    `;


    const response =
        await fetch(API_URL);


    if (!response.ok) {

        throw new Error(
            `API request failed (${response.status})`
        );
    }


    const data =
        await response.json();


    if (!data.success) {

        throw new Error(
            data.message || "API failed"
        );
    }


    renderProjects(data.projects);


} catch (error) {

    console.error(
        "Haprocard Error:",
        error
    );


    projectsContainer.innerHTML = `
        <div class="api-error">

            <h2>
                Failed to load projects ❌
            </h2>

            <p>
                ${escapeHTML(error.message)}
            </p>

        </div>
    `;
}

}

// ====================================
// Render Projects
// ====================================

function renderProjects(projects) {

if (!projects || projects.length === 0) {

    projectsContainer.innerHTML = `
        <p>
            No projects found.
        </p>
    `;

    return;
}


projectsContainer.innerHTML = projects.map(
    project => {

        const title =
            cleanMarkdown(
                project.title ||
                project.id ||
                "Untitled Project"
            );


        const category =
            cleanMarkdown(
                project.category
            );


        const description =
            cleanMarkdown(
                project.description
            );


        const image =
            cleanUrl(
                project.image
            );


        const live =
            cleanUrl(
                project.live
            );


        const github =
            cleanUrl(
                project.github
            );


        const technologies =
            Array.isArray(project.technologies)
                ? project.technologies
                    .map(item =>
                        cleanMarkdown(item)
                    )
                    .filter(Boolean)
                : [];


        const tags =
            Array.isArray(project.tags)
                ? project.tags
                    .map(tag =>
                        cleanMarkdown(tag)
                    )
                    .filter(Boolean)
                : [];


        return `

            <article class="project-card">


                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                class="project-image"
                                loading="lazy"
                            >
                        `
                        : ""
                }


                <div class="project-content">


                    ${
                        project.featured
                            ? `
                                <span class="project-featured">
                                    ⭐ Featured
                                </span>
                            `
                            : ""
                    }


                    <h2>
                        ${escapeHTML(title)}
                    </h2>


                    ${
                        category
                            ? `
                                <p class="project-category">
                                    ${escapeHTML(category)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        description
                            ? `
                                <p class="project-description">
                                    ${escapeHTML(description)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        technologies.length
                            ? `
                                <div class="project-technologies">

                                    <strong>
                                        Technologies
                                    </strong>

                                    <div class="technology-list">

                                        ${
                                            technologies
                                                .map(
                                                    tech => `
                                                        <span>
                                                            ${escapeHTML(tech)}
                                                        </span>
                                                    `
                                                )
                                                .join("")
                                        }

                                    </div>

                                </div>
                            `
                            : ""
                    }


                    ${
                        tags.length
                            ? `
                                <div class="project-tags">

                                    ${
                                        tags
                                            .map(
                                                tag => `
                                                    <span>
                                                        #${escapeHTML(tag)}
                                                    </span>
                                                `
                                            )
                                            .join("")
                                    }

                                </div>
                            `
                            : ""
                    }


                    <div class="project-links">


                        ${
                            live
                                ? `
                                    <a
                                        href="${escapeHTML(live)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Live Demo
                                    </a>
                                `
                                : ""
                        }


                        ${
                            github
                                ? `
                                    <a
                                        href="${escapeHTML(github)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                `
                                : ""
                        }


                    </div>


                </div>


            </article>

        `;

    }
).join("");

}

// ====================================
// Start
// ====================================

loadProjects();
