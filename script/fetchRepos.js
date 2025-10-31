document.addEventListener('DOMContentLoaded', () => {
  const featuredCarousel = document.getElementById('featured-carousel');
  const repoCountElement = document.getElementById('repoCount');

  async function fetchAllRepos() {
    let page = 1;
    let allRepos = [];
    let hasMore = true;

    // Fetch all pages of repositories
    while (hasMore) {
      const response = await fetch(`https://api.github.com/users/jvcataquiz/repos?per_page=100&page=${page}`);
      const repos = await response.json();

      allRepos = allRepos.concat(repos);

      if (repos.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Filter repositories (Java or TypeScript)
    const javaRepos = allRepos
      .filter(repo => repo.language === 'Java' || repo.language === 'TypeScript')
      .reverse();

    // Update repo count
    if (repoCountElement) repoCountElement.textContent = javaRepos.length;

    if (!featuredCarousel) {
      console.error("Element #featured-carousel not found!");
      return;
    }

    // Display each repository
    javaRepos.forEach(repo => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';

      const fullDescription = repo.description || 'No description available.';
      const shortDescription =
        fullDescription.length > 100
          ? fullDescription.substring(0, 100) + '...'
          : fullDescription;

      const emojis = ["💻", "🖥️", "🖱️", "⌨️", "🕹️", "📱", "📡", "🛠️", "⚙️", "🧩", "🤖", "🔋", "💾", "🗄️"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      projectCard.innerHTML = `
        <div class="project-image">${randomEmoji}</div>
        <div class="project-info">
          <h3>${repo.name}</h3>
          <p>${shortDescription}</p>
          <div class="project-tags">
            ${repo.html_url ? `<a href="${repo.html_url}" target="_blank" class="tag">View</a>` : ''}
          </div>
        </div>
      `;

      featuredCarousel.appendChild(projectCard);
    });
  }

  // ✅ Run function after DOM is loaded
  fetchAllRepos();
});
