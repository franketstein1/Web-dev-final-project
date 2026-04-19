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

    // THEME SYSTEM (TIME-BASED AUTO + MANUAL OVERRIDE)
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');

    // manualThemeOverride: 'dark', 'light', or null (= auto)
    let manualThemeOverride = localStorage.getItem('theme-override'); // 'dark'|'light'|null

    /**
     * Returns 'dark' or 'light' based on the current local hour.
     * Day   = 06:00 – 17:59  → light
     * Night = 18:00 – 05:59  → dark
     */
    function getThemeByTime() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }

    /** Apply a theme to the DOM and update the button icon. */
    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
    }

    /** Update the toggle button to reflect the current mode. */
    function updateToggleIcon() {
        if (!themeToggleBtn) return;
        if (manualThemeOverride === null || manualThemeOverride === undefined || manualThemeOverride === '') {
            themeToggleBtn.textContent = '🌓'; // auto mode
            themeToggleBtn.title = 'Theme: Auto (click for Dark)';
        } else if (manualThemeOverride === 'dark') {
            themeToggleBtn.textContent = '☀️'; // currently dark → click for light
            themeToggleBtn.title = 'Theme: Dark (click for Light)';
        } else {
            themeToggleBtn.textContent = '🌙'; // currently light → click for Auto
            themeToggleBtn.title = 'Theme: Light (click for Auto)';
        }
    }

    /** Full refresh: pick auto-time or manual, then sync icon. */
    function refreshTheme() {
        const isAuto = !manualThemeOverride;
        const theme = isAuto ? getThemeByTime() : manualThemeOverride;
        applyTheme(theme);
        updateToggleIcon();
    }

    // Initial application
    refreshTheme();

    // Re-check every 60 s so the auto theme switches at the boundary hour
    setInterval(() => {
        if (!manualThemeOverride) refreshTheme();
    }, 60 * 1000);

    // Toggle cycles: auto → dark → light → auto
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (!manualThemeOverride) {
                // auto → dark
                manualThemeOverride = 'dark';
            } else if (manualThemeOverride === 'dark') {
                // dark → light
                manualThemeOverride = 'light';
            } else {
                // light → auto
                manualThemeOverride = '';
            }

            if (manualThemeOverride) {
                localStorage.setItem('theme-override', manualThemeOverride);
            } else {
                localStorage.removeItem('theme-override');
            }

            refreshTheme();
        });
    }


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
