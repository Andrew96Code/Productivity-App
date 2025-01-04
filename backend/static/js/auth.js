// Global variable for current user
let currentUser = null;

// Time periods configuration
const timePeriodsConfig = {
    morning: {
        start: 5,
        end: 11,
        color: 'bg-yellow-500',
        text: 'Morning Routine'
    },
    afternoon: {
        start: 11,
        end: 17,
        color: 'bg-blue-500',
        text: 'Afternoon Check-in'
    },
    evening: {
        start: 17,
        end: 23,
        color: 'bg-purple-500',
        text: 'Evening Reflection'
    }
};

function getCurrentTimePeriod() {
    const hour = new Date().getHours();
    for (const [period, config] of Object.entries(timePeriodsConfig)) {
        if (hour >= config.start && hour < config.end) {
            return { period, config };
        }
    }
    return { period: 'evening', config: timePeriodsConfig.evening };
}

function updateTimePeriodIndicator() {
    const { period, config } = getCurrentTimePeriod();
    const badge = document.getElementById('timePeriodBadge');
    if (badge) {
        badge.className = `inline-block px-4 py-2 rounded-full text-white font-semibold ${config.color}`;
        badge.textContent = config.text;
    }
}

// Function to show main content and hide login/signup forms
async function showMainContent() {
    // Hide welcome section
    const welcomeSection = document.querySelector('.bg-blue-600');
    if (welcomeSection) {
        welcomeSection.classList.add('hidden');
    }
    
    // Hide auth forms
    const authSection = document.querySelector('.grid.md\\:grid-cols-2');
    if (authSection) {
        authSection.classList.add('hidden');
    }
    
    // Show main content
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        
        // Wait for the next frame to ensure DOM is updated
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Initialize the interface
        updateTimePeriodIndicator();
        
        // Initialize navigation buttons
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const tabContent = document.getElementById('tabContent');
        
        if (!prevButton || !nextButton || !tabContent) {
            console.error('Required navigation elements not found. Retrying...');
            // Retry after a short delay
            setTimeout(showMainContent, 100);
            return;
        }
        
        // Initialize tabs
        switchTab('habits');
        updateNavigationButtons();
        updateTabButtons();
        
        // Add event listener for rewards tab if the element exists
        const rewardsTab = document.querySelector('[data-tab="rewards"]');
        if (rewardsTab && typeof loadRewardsData === 'function') {
            rewardsTab.addEventListener('click', loadRewardsData);
        }
        
        // Start periodic updates
        setInterval(updateTimePeriodIndicator, 60000);
    } else {
        console.error('Main content element not found');
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginButton = document.getElementById('loginButton');
    const errorDiv = document.getElementById('loginError');
    
    try {
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        errorDiv.classList.add('hidden');
        
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response data:', data); // Debug log
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        if (!data.user || !data.session) {
            throw new Error('Invalid response from server');
        }
        
        // Store user data
        currentUser = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('session', JSON.stringify(data.session));
        
        // Show main content
        showMainContent();
        
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = error.message || 'An error occurred during login. Please try again.';
        errorDiv.classList.remove('hidden');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
}

async function signup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const signupButton = document.getElementById('signupButton');
    const errorDiv = document.getElementById('signupError');
    
    try {
        signupButton.disabled = true;
        signupButton.textContent = 'Creating Account...';
        errorDiv.classList.add('hidden');
        
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Signup response data:', data); // Debug log
        
        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }
        
        if (!data.data || !data.data.user || !data.data.session) {
            throw new Error('Invalid response from server');
        }
        
        // Store user data
        currentUser = data.data.user;
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('session', JSON.stringify(data.data.session));
        
        // Show main content
        showMainContent();
        
    } catch (error) {
        console.error('Signup error:', error);
        errorDiv.textContent = error.message || 'An error occurred during signup. Please try again.';
        errorDiv.classList.remove('hidden');
    } finally {
        signupButton.disabled = false;
        signupButton.textContent = 'Create Account';
    }
}

// Check for existing session on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('user');
    const storedSession = localStorage.getItem('session');
    
    if (storedUser && storedSession) {
        try {
            currentUser = JSON.parse(storedUser);
            const session = JSON.parse(storedSession);
            
            // Check if session is still valid
            if (session.expires_at && new Date(session.expires_at) > new Date()) {
                showMainContent();
            } else {
                // Clear invalid session
                localStorage.removeItem('user');
                localStorage.removeItem('session');
            }
        } catch (error) {
            console.error('Error restoring session:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('session');
        }
    }
}); 