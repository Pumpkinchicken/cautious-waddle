const examDate = new Date('2027-05-04T08:00:00');
const today = new Date();
const days = Math.max(0, Math.ceil((examDate - today) / 86400000));
document.querySelector('#daysLeft').textContent = days;

const dialog = document.querySelector('#studyDialog');
document.querySelector('#planButton').addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-action').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#practice').scrollIntoView({ behavior: 'smooth' });
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const toast = document.querySelector('.toast');
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}
document.querySelector('#drillButton').addEventListener('click', () => showToast('Loading your Cultural Diffusion practice set…'));
document.querySelector('.continue').addEventListener('click', (event) => showToast(`Opening ${event.currentTarget.dataset.unit}…`));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.find((entry) => entry.isIntersecting);
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-30% 0px -60%' });
sections.forEach((section) => observer.observe(section));
