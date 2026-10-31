import { mkdir, writeFile } from 'node:fs/promises';

const headers = { 'User-Agent': 'ammar-portfolio-research', Accept: 'application/vnd.github+json' };
const response = await fetch('https://api.github.com/users/AmmarYasser455/repos?per_page=100', { headers });
if (!response.ok) throw new Error(`Repository list: ${response.status}`);
const repos = await response.json();
await mkdir('.research/readmes', { recursive: true });
const results = await Promise.all(repos.map(async (repo) => {
  const res = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers });
  let readme = null;
  if (res.ok) {
    const data = await res.json();
    readme = Buffer.from(data.content, 'base64').toString('utf8');
    await writeFile(`.research/readmes/${repo.name}.md`, readme);
  } else if (res.status !== 404) throw new Error(`${repo.name}: ${res.status}`);
  return { name: repo.name, url: repo.html_url, description: repo.description, language: repo.language,
    stars: repo.stargazers_count, topics: repo.topics, fork: repo.fork, size: repo.size,
    pushedAt: repo.pushed_at, homepage: repo.homepage, readmeAvailable: readme !== null,
    readmeImages: readme?.match(/!\[[^\]]*\]\([^\n]+\)|<img[^>]+>/g) ?? [] };
}));
await mkdir('docs', { recursive: true });
await writeFile('docs/github-inventory.json', JSON.stringify({ checkedOn: '2026-10-30', repositories: results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
