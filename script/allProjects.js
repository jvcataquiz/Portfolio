document.addEventListener('DOMContentLoaded', () => {
    const featuredCarousel = document.getElementById('featured-carousel');
    const repoCountElement = document.getElementById('repoCount');

    async function fetchAllRepos() {
        let page = 1;
        let allRepos = [];
        let hasMore = true;

        try {
            while (hasMore) {
                const response = await fetch(`https://api.github.com/users/jvcataquiz/repos?per_page=100&page=${page}`);
                const repos = await response.json();

                if (repos.length > 0) {
                    allRepos = allRepos.concat(repos);
                    page++;
                } else {
                    hasMore = false;
                }
            }

            repoCountElement.textContent = allRepos.length;

            allRepos.forEach(repo => {
                // Create project card
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';

                // Add project info
                const projectInfo = `
                    <div class="project-card">
                      <div class="project-image">🤖</div>
                       <div class="project-info">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <div class="project-tags">
                            ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                        </div>
                        </div>
                    </div>
                `;
                projectCard.innerHTML = projectInfo;

                // Append project card to the carousel
                featuredCarousel.appendChild(projectCard);
            });
        } catch (error) {
            console.error('Error fetching repositories:', error);
            repoCountElement.textContent = 'Error';
        }
    }

    fetchAllRepos();
});
