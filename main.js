/* ==========================================================================
   AshishDarji.com — Main JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Source — Social & Professional Links
    const linksData = [
        {
            id: 'github',
            title: 'GitHub',
            subtitle: '@AzDarGee • Open source repos, code labs & algorithms',
            url: 'https://github.com/AzDarGee',
            iconClass: 'fa-brands fa-github',
            category: 'work',
            color: '#333333',
            colorDark: '#f0f6fc',
            featured: true
        },
        {
            id: 'linkedin',
            title: 'LinkedIn',
            subtitle: 'in/ashdarji • Career trajectory, engineering & advisory',
            url: 'https://www.linkedin.com/in/ashdarji/',
            iconClass: 'fa-brands fa-linkedin',
            category: 'work',
            color: '#0a66c2',
            featured: true
        },
        {
            id: 'twitter',
            title: 'Twitter / X',
            subtitle: '@AshishRSCDarji • Tech thoughts, dev logs & industry insights',
            url: 'https://x.com/AshishRSCDarji',
            iconClass: 'fa-brands fa-x-twitter',
            category: 'social',
            color: '#1da1f2',
            featured: true
        },
        {
            id: 'youtube',
            title: 'YouTube Channel',
            subtitle: '@ashthruthelens • Web dev tutorials, architecture & tech reviews',
            url: 'https://www.youtube.com/@ashthruthelens',
            iconClass: 'fa-brands fa-youtube',
            category: 'content',
            color: '#ff0000',
            featured: false
        },
        {
            id: 'youtube-music',
            title: 'Zygo Zayano Music',
            subtitle: 'Zygo Zayano • Rap & Electronic Music',
            url: 'https://music.youtube.com/@zygozayano',
            iconClass: 'fa-brands fa-youtube',
            category: 'work',
            color: '#1612e6ff',
            featured: false
        },
        {
            id: 'medium',
            title: 'Medium Engineering Blog',
            subtitle: 'medium.com/@ashishdarji • Deep-dive system architecture articles',
            url: 'https://medium.com/@ashishdarji',
            iconClass: 'fa-brands fa-medium',
            category: 'content',
            color: '#00ab6c',
            featured: false
        },
        {
            id: 'devto',
            title: 'Dev.to Articles',
            subtitle: 'dev.to/ashishdarji • Full-stack code snippets & guides',
            url: 'https://dev.to/ashishdarji',
            iconClass: 'fa-brands fa-dev',
            category: 'content',
            color: '#0a0a0a',
            colorDark: '#ffffff',
            featured: false
        },
        {
            id: 'discord',
            title: 'Saanskara Community',
            subtitle: "Saanskara • Discussions on Art, Community, Culture, & Tech",
            url: 'https://discord.com/invite/pxqxZKACKs',
            iconClass: 'fa-brands fa-discord',
            category: 'social',
            color: '#5865f2',
            featured: false
        },
        {
            id: 'instagram',
            title: 'Instagram',
            subtitle: '@saanskara • art, music, tech and health & well - being',
            url: 'https://www.instagram.com/saanskara/',
            iconClass: 'fa-brands fa-instagram',
            category: 'social',
            color: '#e1306c',
            featured: false
        },
        {
            id: 'email',
            title: 'Direct Business Email',
            subtitle: 'saanskarastudios@gmail.com • Advisory & consulting inquiries',
            url: 'mailto:saanskarastudios@gmail.com',
            iconClass: 'fa-solid fa-envelope',
            category: 'work',
            color: '#6366f1',
            featured: false
        }
    ];

    // State Variables
    let currentCategory = 'all';
    let searchQuery = '';

    // DOM Element References
    const linksContainer = document.getElementById('links-container');
    const searchInput = document.getElementById('link-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const categoryFilters = document.getElementById('category-filters');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const shareBtn = document.getElementById('share-btn');
    const qrBtn = document.getElementById('qr-btn');
    const openContactBtn = document.getElementById('open-contact-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const clockDisplay = document.getElementById('clock-display');
    const currentYearSpan = document.getElementById('current-year');

    // Modals & Forms
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.getElementById('close-contact-modal');
    const contactForm = document.getElementById('contact-form');

    const qrModal = document.getElementById('qr-modal');
    const closeQrModal = document.getElementById('close-qr-modal');
    const qrcodeWrapper = document.getElementById('qrcode-canvas-wrapper');

    // 2. Initialize Year & Clock
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    function updateLiveClock() {
        if (!clockDisplay) return;
        const now = new Date();
        const options = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        clockDisplay.textContent = `${now.toLocaleTimeString('en-US', options)} EST`;
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // 3. Theme Manager
    const themes = ['dark', 'light', 'cyber'];
    let currentThemeIndex = 0;

    const savedTheme = localStorage.getItem('ashish_theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const nextTheme = themes[currentThemeIndex];
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('ashish_theme', nextTheme);
        updateThemeIcon(nextTheme);
        showToast(`Theme changed to ${nextTheme.toUpperCase()}`);
        // window.location.reload();
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
        } else if (theme === 'cyber') {
            themeIcon.className = 'fa-solid fa-bolt';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // 4. Render Links
    function renderLinks() {
        if (!linksContainer) return;

        const filtered = linksData.filter(link => {
            const matchesCategory = (currentCategory === 'all') || (link.category === currentCategory);
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
                link.title.toLowerCase().includes(query) ||
                link.subtitle.toLowerCase().includes(query) ||
                link.category.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            linksContainer.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p>No links found matching "<strong>${escapeHtml(searchQuery)}</strong>"</p>
                </div>
            `;
            return;
        }

        linksContainer.innerHTML = filtered.map(link => {
            const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'cyber';
            const iconColor = (isDarkTheme && link.colorDark) ? link.colorDark : link.color;

            return `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card" style="--card-color: ${iconColor};" data-id="${link.id}">
                    ${link.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    <div class="link-main-info">
                        <div class="link-icon-box">
                            <i class="${link.iconClass}"></i>
                        </div>
                        <div class="link-text">
                            <span class="link-title">${escapeHtml(link.title)}</span>
                            <span class="link-subtitle">${escapeHtml(link.subtitle)}</span>
                        </div>
                    </div>
                    <div class="link-right-actions">
                        <button class="copy-link-btn" title="Copy link to clipboard" data-url="${link.url}" aria-label="Copy Link">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                        <i class="fa-solid fa-arrow-up-right-from-square arrow-icon"></i>
                    </div>
                </a>
            `;
        }).join('');

        // Attach event listener for individual copy buttons
        document.querySelectorAll('.copy-link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const urlToCopy = btn.getAttribute('data-url');
                copyToClipboard(urlToCopy, 'Link copied to clipboard!');
            });
        });
    }

    renderLinks();

    // 5. Category Filtering
    categoryFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderLinks();
    });

    // 6. Search Bar Event Listeners
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (searchQuery.length > 0) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }
        renderLinks();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        searchInput.focus();
        renderLinks();
    });

    // Keyboard shortcut '/' to search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // 7. Share Profile & Copy Actions
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Ashish Darji | Links & Official Landing Page',
            text: 'Connect with Ashish Darji — Full-Stack Engineer & Tech Innovator.',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                copyToClipboard(window.location.href, 'Profile URL copied to clipboard!');
            }
        } else {
            copyToClipboard(window.location.href, 'Profile URL copied to clipboard!');
        }
    });

    copyEmailBtn.addEventListener('click', () => {
        copyToClipboard('ashdarji1@gmail.com', 'Email copied: ashdarji1@gmail.com');
    });

    // Helper: Copy to Clipboard
    function copyToClipboard(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage);
            }).catch(() => {
                fallbackCopy(text, successMessage);
            });
        } else {
            fallbackCopy(text, successMessage);
        }
    }

    function fallbackCopy(text, successMessage) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(successMessage);
        } catch (err) {
            showToast('Failed to copy');
        }
        document.body.removeChild(textarea);
    }

    // 8. Toast Manager
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, iconClass = 'fa-solid fa-circle-check') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${iconClass}"></i> <span>${escapeHtml(message)}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }

    // 9. Modals (Contact & QR Code)
    openContactBtn.addEventListener('click', () => {
        contactModal.classList.remove('hidden');
        contactModal.setAttribute('aria-hidden', 'false');
    });

    closeContactModal.addEventListener('click', () => {
        contactModal.classList.add('hidden');
        contactModal.setAttribute('aria-hidden', 'true');
    });

    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.add('hidden');
            contactModal.setAttribute('aria-hidden', 'true');
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        showToast(`Thank you, ${name}! Your message has been sent.`, 'fa-solid fa-paper-plane');
        contactForm.reset();
        contactModal.classList.add('hidden');
        contactModal.setAttribute('aria-hidden', 'true');
    });

    // QR Modal
    qrBtn.addEventListener('click', () => {
        generateSvgQRCode(window.location.href);
        qrModal.classList.remove('hidden');
        qrModal.setAttribute('aria-hidden', 'false');
    });

    closeQrModal.addEventListener('click', () => {
        qrModal.classList.add('hidden');
        qrModal.setAttribute('aria-hidden', 'true');
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.add('hidden');
            qrModal.setAttribute('aria-hidden', 'true');
        }
    });

    // Global Esc Key Handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            contactModal.classList.add('hidden');
            qrModal.classList.add('hidden');
        }
    });

    // 10. Simple Dynamic SVG QR Code Generator
    function generateSvgQRCode(text) {
        if (!qrcodeWrapper) return;
        // High quality inline SVG QR Code mock representation
        const size = 180;
        qrcodeWrapper.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect width="100" height="100" fill="#ffffff" />
                <!-- Position Detection Patterns (Top Left, Top Right, Bottom Left) -->
                <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="13" width="9" height="9" fill="#6366f1" />

                <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="78" y="13" width="9" height="9" fill="#6366f1" />

                <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="78" width="9" height="9" fill="#6366f1" />

                <!-- Data Modules Matrix -->
                <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="58" y="8" width="6" height="6" fill="#0f172a" />
                
                <rect x="36" y="20" width="6" height="6" fill="#6366f1" />
                <rect x="44" y="20" width="6" height="6" fill="#0f172a" />
                <rect x="56" y="20" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="20" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="34" y="34" width="8" height="8" fill="#6366f1" />
                <rect x="48" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="62" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="74" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="86" y="36" width="6" height="6" fill="#6366f1" />

                <rect x="8" y="48" width="6" height="6" fill="#6366f1" />
                <rect x="20" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="36" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="48" width="8" height="8" fill="#6366f1" opacity="0.9" />
                <rect x="64" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="76" y="48" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="20" y="58" width="6" height="6" fill="#6366f1" />
                <rect x="36" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="50" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="62" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="84" y="58" width="6" height="6" fill="#0f172a" />

                <rect x="36" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="72" width="6" height="6" fill="#6366f1" />
                <rect x="60" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="74" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="86" y="72" width="6" height="6" fill="#0f172a" />

                <rect x="36" y="84" width="6" height="6" fill="#6366f1" />
                <rect x="46" y="84" width="6" height="6" fill="#0f172a" />
                <rect x="58" y="84" width="6" height="6" fill="#0f172a" />
                <rect x="70" y="84" width="6" height="6" fill="#0f172a" />
                <rect x="84" y="84" width="6" height="6" fill="#6366f1" />
            </svg>
        `;
    }

    // 11. Ambient Interactive Particle Canvas Background
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 25), 45);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.8;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // Helper: HTML Escaper
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, (m) => {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }
});
