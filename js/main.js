// ── Projects data ──
// To add/remove/edit projects, modify this array only.
const projects = [
  {
    icon: '⛏',
    name: 'minecraft mods',
    desc: 'Our catalog of Java mods for NeoForge and Forge, with CurseForge and Modrinth links for every version.',
    tags: ['Java', 'NeoForge', 'Forge'],
    github: 'https://github.com/Lothrazar/MinecraftWorkbench',
    demo: 'https://lothrazar.github.io/MinecraftWorkbench/',
  },
  {
    icon: '🎨',
    name: 'skin.painter',
    desc: 'Minecraft skin viewer and editor with a 3D preview, animations and a pixel editor. Runs fully in the browser.',
    tags: ['JavaScript', 'skinview3d'],
    github: 'https://github.com/Lothrazar/MinecraftSkinPainter',
    demo: 'https://lothrazar.github.io/MinecraftSkinPainter/',
  },
  // Hidden for now, uncomment to show again
  // {
  //   icon: '📋',
  //   name: 'KanbanURL',
  //   desc: 'A zero-backend kanban board where the whole board lives in the URL. Share the link, share the board.',
  //   tags: ['JavaScript', 'HTML/CSS'],
  //   github: 'https://github.com/Lothrazar/KanbanURL',
  //   demo: 'https://lothrazar.github.io/KanbanURL/',
  // },
  {
    icon: '🔍',
    name: 'GithubTools',
    desc: 'Browser utilities for auditing your GitHub repos: open issues, pull requests and default branches.',
    tags: ['JavaScript', 'GitHub API'],
    github: 'https://github.com/Lothrazar/GithubTools',
    demo: 'https://lothrazar.github.io/GithubTools/',
  },
];

function buildProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-icon">${p.icon}</div>
      <div class="project-name">
        ${(p.demo || p.github) ? `<a href="${p.demo || p.github}" target="_blank" rel="noopener">${p.name}</a>` : p.name}
      </div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      ${(p.github || p.demo) ? `
      <div class="project-links">
        ${p.github ? `<a href="${p.github}" class="project-link" target="_blank" rel="noopener">github</a>` : ''}
        ${p.demo ? `<a href="${p.demo}" class="project-link" target="_blank" rel="noopener">demo</a>` : ''}
      </div>` : ''}
    </div>
  `).join('');
}

buildProjects();

document.getElementById('year').textContent = new Date().getFullYear();

// ── Live stats ──
// The HTML holds a snapshot so the page still reads fine offline or when an API is rate limited.
// The CurseForge project count (120) is a fixed number from the author portal: its API needs a secret key, which cannot live in a public page.
function formatCount(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M+';
  }
  if (n >= 1000) {
    return Math.floor(n / 1000) + 'K+';
  }
  return String(n);
}

function setStat(id, value) {
  document.getElementById(id).textContent = value;
}

async function loadModrinthStats() {
  const res = await fetch('https://api.modrinth.com/v2/user/Lothrazar/projects');
  if (!res.ok) {
    return;
  }
  const mods = await res.json();
  setStat('stat-downloads', formatCount(mods.reduce((sum, m) => sum + m.downloads, 0)));
}

async function loadGithubStats() {
  const res = await fetch('https://api.github.com/users/Lothrazar');
  if (!res.ok) {
    return;
  }
  const user = await res.json();
  setStat('stat-repos', user.public_repos);
  setStat('stat-years', new Date().getFullYear() - new Date(user.created_at).getFullYear());
}

loadModrinthStats().catch(() => {});
loadGithubStats().catch(() => {});
