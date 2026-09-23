// site.js — только для index.html
const header = document.querySelector('header');
addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 10);
}, { passive: true });

// бургер-меню (кнопка создаётся в JS, HTML трогать не нужно)
const nav = document.querySelector('nav');
const toggle = document.createElement('button');
toggle.className = 'nav-toggle';
toggle.setAttribute('aria-label', 'Меню');
toggle.innerHTML = '<span></span>';
header.insertBefore(toggle, nav);
toggle.onclick = () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
};

// reveal-on-scroll: добавь class="reveal" секциям/карточкам в index.html
// (например <section class="section dark reveal" id="about">, <article class="reveal">...)
const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('in-view'));
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));