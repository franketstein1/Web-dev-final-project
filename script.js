document.addEventListener('DOMContentLoaded', () => {

    // REAL-TIME DIGITAL CLOCKS
    const nepalTimeEl = document.getElementById('nepal-time');
    const localTimeEl = document.getElementById('local-time');

    function updateClocks() {
        const now = new Date();

        // Standard formatting options
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        // Nepal Time (Asia/Kathmandu)
        const nepalTimeString = new Intl.DateTimeFormat('en-US', {
            ...timeOptions,
            timeZone: 'Asia/Kathmandu'
        }).format(now);

        nepalTimeEl.textContent = nepalTimeString;

        // User Local Time
        const localTimeString = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
        localTimeEl.textContent = localTimeString;
    }

    setInterval(updateClocks, 1000);
    updateClocks(); // Initial call

    // THEME SYSTEM (AUTO / MANUAL)
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Check if user has explicitly overriden the theme
    let manualThemeOverride = localStorage.getItem('theme-override');

    function determineAutoTheme() {
        if (manualThemeOverride) return; // Disable auto if manually set

        const now = new Date();
        const hour = now.getHours(); // 0 to 23

        // Light Mode: 6:00 AM (6) to 5:59 PM (17)
        if (hour >= 6 && hour < 18) {
            setTheme('light', false);
        } else {
            setTheme('dark', false);
        }
    }

    function setTheme(theme, isManual = false) {
        if (theme === 'light') {
            htmlEl.setAttribute('data-theme', 'light');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        }

        if (isManual) {
            manualThemeOverride = theme;
            localStorage.setItem('theme-override', theme);
        }
    }

    // Apply init theme
    if (manualThemeOverride) {
        setTheme(manualThemeOverride, true);
    } else {
        determineAutoTheme();
    }

    // Handle Manual Toggle
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme, true);
    });

    // Optionally check interval to switch themes automatically around 6 AM / 6 PM if NOT overridden
    setInterval(() => {
        if (!manualThemeOverride) {
            determineAutoTheme();
        }
    }, 60000); // Check every minute


    // MOBILE NAVIGATION
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
        });
    }

    // Close menu when a link is clicked
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
            });
        });
    }


    // CONTACT FORM SUBMISSION WITH FORMSPREE
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.innerHTML = 'Message Sent Successfully!';
                    submitBtn.style.background = '#10b981'; // Success green
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Formspree Error:', error);
                submitBtn.innerHTML = 'Failed to Send';
                submitBtn.style.background = '#ef4444'; // Error red
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

});
