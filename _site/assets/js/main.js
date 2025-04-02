document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    feather.replace();

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    // Apply saved theme or default to dark mode
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        // Default to dark mode if no preference saved
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }

    // Update toggle button icon based on current theme
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggleBtn.innerHTML = '<i data-feather="sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i data-feather="moon"></i>';
    }
    feather.replace();

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');

        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i data-feather="moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i data-feather="sun"></i>';
        }
        feather.replace();
    });

    // Add arcade-style text animation to titles
    const typingElements = document.querySelectorAll('.intro-title, .intro-subtitle');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeEffect = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeEffect);
                element.classList.add('typing-done');
            }
        }, 50);
    });

    // Add active class to current nav link
    const currentPage = location.pathname;
    document.querySelectorAll('.nav-container a').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('active');
        }
    });
});