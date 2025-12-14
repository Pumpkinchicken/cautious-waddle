const data = [
  {
    title: 'Modern Web Dashboard',
    description: 'Starter dashboard layout with responsive cards, charts placeholders, and dark mode.',
    tags: ['dashboard', 'analytics', 'layout'],
    category: 'tool',
    url: 'https://example.com/dashboard',
    featured: true,
  },
  {
    title: 'Content Strategy Playbook',
    description: 'Step-by-step guide to plan, write, and launch content with templates and checklists.',
    tags: ['content', 'marketing', 'guide'],
    category: 'guide',
    url: 'https://example.com/playbook',
    featured: false,
  },
  {
    title: 'API Design Principles',
    description: 'A concise primer on REST and GraphQL design, naming conventions, and pagination.',
    tags: ['api', 'rest', 'graphql'],
    category: 'article',
    url: 'https://example.com/api-design',
    featured: true,
  },
  {
    title: 'Team Onboarding Checklist',
    description: 'Printable and digital onboarding flow with links to docs, accounts, and role expectations.',
    tags: ['onboarding', 'ops', 'hr'],
    category: 'resource',
    url: 'https://example.com/onboarding',
    featured: false,
  },
  {
    title: 'Product Discovery Toolkit',
    description: 'Experiments board, interview scripts, and scoring frameworks for early discovery.',
    tags: ['product', 'research', 'framework'],
    category: 'tool',
    url: 'https://example.com/discovery',
    featured: true,
  },
  {
    title: 'Accessibility Starter',
    description: 'Checklist and component patterns to ship accessible forms, navigation, and media.',
    tags: ['accessibility', 'a11y', 'ui'],
    category: 'guide',
    url: 'https://example.com/accessibility',
    featured: false,
  },
  {
    title: 'Analytics Event Catalog',
    description: 'Opinionated event names, properties, and governance for consistent product analytics.',
    tags: ['analytics', 'events', 'tracking'],
    category: 'resource',
    url: 'https://example.com/events',
    featured: false,
  },
  {
    title: 'Brand Identity Kit',
    description: 'Color palettes, typography suggestions, and usage rules for cohesive branding.',
    tags: ['brand', 'design', 'identity'],
    category: 'resource',
    url: 'https://example.com/brand-kit',
    featured: false,
  },
];

const quickTags = ['analytics', 'dashboard', 'accessibility', 'content', 'product', 'design'];
const popularSearches = ['dashboard templates', 'api design', 'a11y checklist', 'research plan'];

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const resultList = document.getElementById('result-list');
const quickTagsContainer = document.getElementById('quick-tags');
const status = document.getElementById('status');
const sortSelect = document.getElementById('sort-select');
const filterSelect = document.getElementById('filter-select');
const popularContainer = document.getElementById('popular-searches');
const featuredList = document.getElementById('featured-list');

function createChip(label, handler) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.textContent = label;
  chip.addEventListener('click', () => handler(label));
  return chip;
}

function highlight(text, term) {
  if (!term.trim()) return text;
  const regex = new RegExp(`(${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function renderFeatured(items) {
  featuredList.innerHTML = '';
  items
    .filter((item) => item.featured)
    .forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      link.textContent = item.title;
      const description = document.createElement('p');
      description.textContent = item.description;
      li.appendChild(link);
      li.appendChild(description);
      featuredList.appendChild(li);
    });
}

function renderChips(container, items, handler) {
  container.innerHTML = '';
  items.forEach((item) => container.appendChild(createChip(item, handler)));
}

function computeScore(item, term) {
  if (!term) return 0;
  const lowerTerm = term.toLowerCase();
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const tags = item.tags.join(' ').toLowerCase();

  const startsWith = title.startsWith(lowerTerm) ? 6 : 0;
  const includesTitle = title.includes(lowerTerm) ? 4 : 0;
  const includesDescription = description.includes(lowerTerm) ? 2 : 0;
  const includesTag = tags.includes(lowerTerm) ? 3 : 0;
  return startsWith + includesTitle + includesDescription + includesTag;
}

function sortResults(items, sortBy, term) {
  const base = [...items];
  if (sortBy === 'title') {
    return base.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy === 'category') {
    return base.sort((a, b) => a.category.localeCompare(b.category));
  }
  return base.sort((a, b) => computeScore(b, term) - computeScore(a, term));
}

function renderResults(items, term) {
  resultList.innerHTML = '';

  if (items.length === 0) {
    const li = document.createElement('li');
    li.className = 'result';
    li.innerHTML = '<p class="muted">No results yet. Try a different keyword or pick a category chip.</p>';
    resultList.appendChild(li);
    return;
  }

  const template = document.getElementById('result-template');

  items.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    clone.querySelector('.result__title').innerHTML = highlight(item.title, term);
    clone.querySelector('.result__description').innerHTML = highlight(item.description, term);
    clone.querySelector('.result__type').textContent = item.category;
    clone.querySelector('.pill').textContent = item.tags.join(' • ');
    clone.querySelector('.meta').textContent = `${item.tags.length} tags • ${item.category}`;
    clone.querySelector('.result__link').href = item.url;
    resultList.appendChild(clone);
  });
}

function filterResults(term) {
  const cleaned = term.trim();
  const filter = filterSelect.value;

  const filtered = data.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter;
    if (!matchesFilter) return false;
    if (!cleaned) return true;
    const lowerTerm = cleaned.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerTerm) ||
      item.description.toLowerCase().includes(lowerTerm) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerTerm))
    );
  });

  const sorted = sortResults(filtered, sortSelect.value, cleaned);
  renderResults(sorted, cleaned);
  status.textContent = cleaned
    ? `${sorted.length} result${sorted.length === 1 ? '' : 's'} for "${cleaned}"`
    : `${sorted.length} available items`;
}

function handleSearch() {
  filterResults(searchInput.value);
}

function handleQuickTag(tag) {
  searchInput.value = tag;
  filterResults(tag);
  searchInput.focus();
}

function clearSearch() {
  searchInput.value = '';
  filterResults('');
  searchInput.focus();
}

function init() {
  renderChips(quickTagsContainer, quickTags, handleQuickTag);
  renderChips(popularContainer, popularSearches, (value) => handleQuickTag(value));
  renderFeatured(data);
  filterResults('');

  searchInput.addEventListener('input', () => filterResults(searchInput.value));
  searchButton.addEventListener('click', handleSearch);
  clearButton.addEventListener('click', clearSearch);
  sortSelect.addEventListener('change', handleSearch);
  filterSelect.addEventListener('change', handleSearch);

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
    if (event.key === 'Escape') {
      clearSearch();
    }
  });
}

init();
