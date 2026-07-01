// ============================================================
// AEROLUXE — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. HEADER SCROLL BEHAVIOR ----
    const header = document.getElementById('header');
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- 2. ACTIVE NAV LINK ----
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const setActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });

    // ---- 3. MOBILE NAV ----
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navClose = document.getElementById('nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openNav = () => {
        mobileNav.classList.add('open');
        mobileOverlay.classList.add('active');
        hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
        mobileNav.classList.remove('open');
        mobileOverlay.classList.remove('active');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openNav);
    navClose.addEventListener('click', closeNav);
    mobileOverlay.addEventListener('click', closeNav);
    mobileLinks.forEach(link => link.addEventListener('click', closeNav));

    // ---- 4. SCROLL REVEAL ----
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay based on sibling index
                const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 0.08}s`;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- 5. GALLERY FILTER ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                const cat = item.dataset.cat;
                const show = filter === 'all' || cat === filter;
                
                if (show) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.4s ease both';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- 6. BOOKING FORM → WHATSAPP ----
    const WHATSAPP_NUMBER = '6281234567890'; // Ganti dengan nomor WhatsApp asli

    const bookingForm = document.getElementById('booking-form');
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name     = document.getElementById('f-name').value.trim();
        const phone    = document.getElementById('f-phone').value.trim();
        const service  = document.getElementById('f-service').value;
        const route    = document.getElementById('f-route').value.trim();
        const date     = document.getElementById('f-date').value;
        const message  = document.getElementById('f-message').value.trim();

        // Validation
        if (!name) { showFieldError('f-name', 'Nama lengkap wajib diisi'); return; }
        if (!phone) { showFieldError('f-phone', 'Nomor WhatsApp wajib diisi'); return; }
        if (!service) { showFieldError('f-service', 'Pilih jenis layanan'); return; }

        // Format tanggal
        const formattedDate = date 
            ? new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : 'Akan dikonfirmasi';

        // Build WhatsApp message
        const wa = [
            `🛫 *Reservasi AeroLUXE*`,
            `━━━━━━━━━━━━━━━━━`,
            `👤 *Nama:* ${name}`,
            `📞 *Kontak:* ${phone}`,
            `✈️ *Layanan:* ${service}`,
            route ? `🗺️ *Rute:* ${route}` : null,
            `📅 *Tanggal:* ${formattedDate}`,
            message ? `💬 *Catatan:* ${message}` : null,
            `━━━━━━━━━━━━━━━━━`,
            `Mohon konfirmasi ketersediaan dan detail harga. Terima kasih! 🙏`
        ].filter(Boolean).join('\n');

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(wa)}`;

        // Animate button
        const btn = document.getElementById('btn-submit-form');
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Membuka WhatsApp...';
        btn.disabled = true;

        setTimeout(() => {
            window.open(url, '_blank');
            btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Kirim via WhatsApp';
            btn.disabled = false;
            bookingForm.reset();
            showSuccessToast();
        }, 800);
    });

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#FF4D4D';
        field.focus();
        
        let errorEl = field.parentElement.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.style.cssText = 'color:#FF4D4D;font-size:0.75rem;margin-top:4px;display:block;';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        
        setTimeout(() => {
            field.style.borderColor = '';
            if (errorEl) errorEl.remove();
        }, 3000);
    }

    function showSuccessToast() {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: linear-gradient(135deg, #C9A84C, #A07B2A);
            color: #0A0A0F;
            padding: 16px 28px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 8px 32px rgba(201,168,76,0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInUp 0.4s ease both;
        `;
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Formulir terkirim! WhatsApp terbuka.';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.4s ease both';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---- 7. SMOOTH SCROLL for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- 8. HERO PARALLAX ----
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
            }
        }, { passive: true });
    }

    // ---- 9. STYLE for toast animations ----
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutDown {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleEl);

    console.log('%c✈ AeroLUXE Loaded', 'color: #C9A84C; font-size: 14px; font-weight: bold;');
});
