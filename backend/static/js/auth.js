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

// Add time period colors
const timePeriodColors = {
    morning: 'bg-yellow-500',
    afternoon: 'bg-blue-500',
    evening: 'bg-purple-500',
    admin: 'bg-gray-500'
};

// Update time period indicator
function updateTimePeriodIndicator() {
    const badge = document.getElementById('timePeriodBadge');
    if (!badge) return;

    const period = getCurrentTimePeriod();
    const color = timePeriodColors[period.period] || 'bg-gray-500';
    
    badge.className = `inline-block px-4 py-2 rounded-full text-white font-semibold ${color}`;
    badge.textContent = period.label;
}

// Get user preferences
function getUserPreferences() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        morning: user.timePreferences?.morning || '05:00',
        afternoon: user.timePreferences?.afternoon || '12:00',
        evening: user.timePreferences?.evening || '17:00'
    };
}

// Convert time string to hour
function timeStringToHour(timeString) {
    return parseInt(timeString.split(':')[0]);
}

// Get current time period based on user preferences
function getCurrentTimePeriod() {
    if (isAdminUser()) {
        return { period: 'admin', label: 'Admin View' };
    }
    
    const prefs = getUserPreferences();
    const hour = new Date().getHours();
    
    const morningHour = timeStringToHour(prefs.morning);
    const afternoonHour = timeStringToHour(prefs.afternoon);
    const eveningHour = timeStringToHour(prefs.evening);
    
    if (hour >= morningHour && hour < afternoonHour) {
        return { period: 'morning', label: 'Morning Review' };
    } else if (hour >= afternoonHour && hour < eveningHour) {
        return { period: 'afternoon', label: 'Afternoon Check-in' };
    } else {
        return { period: 'evening', label: 'Evening Review' };
    }
}

// Check if user is admin
function isAdminUser() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.email === 'ahkstltd@gmail.com';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Show main content after login
async function showMainContent() {
    try {
        console.log('Showing main content...');
        
        // Hide welcome section
        const welcomeSection = document.querySelector('.bg-blue-600');
        if (welcomeSection) {
            console.log('Hiding welcome section');
            welcomeSection.classList.add('hidden');
        }
        
        // Hide auth section
        const authSection = document.querySelector('.max-w-6xl.mx-auto.mt-8.px-4');
        const authForms = authSection.querySelector('.grid.md\\:grid-cols-2');
        if (authForms) {
            console.log('Hiding auth forms');
            authForms.classList.add('hidden');
        }
        
        // Show main content
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            console.log('Found main content element, removing hidden class');
            mainContent.classList.remove('hidden');
            
            // Initialize the app
            console.log('Initializing app after login...');
            await initializeApp();
            
        } else {
            console.error('Main content element not found');
        }
        
    } catch (error) {
        console.error('Error showing main content:', error);
        // Show error message to user
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = 'Error loading application. Please try refreshing the page.';
            errorDiv.classList.remove('hidden');
        }
    }
}

// Login function
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    
    try {
        // Here you would typically make an API call to validate credentials
        // For demo purposes, we'll use a simple check
        if (email && password) {
            const user = {
                email: email,
                isLoggedIn: true
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to app dashboard
            window.location.href = '/app';
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        loginError.textContent = error.message;
        loginError.classList.remove('hidden');
    }
}

// Signup function
async function signup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const morningTime = document.getElementById('morningTime').value;
    const afternoonTime = document.getElementById('afternoonTime').value;
    const eveningTime = document.getElementById('eveningTime').value;
    const signupError = document.getElementById('signupError');
    
    try {
        // Validate time sequence
        const morningHour = timeStringToHour(morningTime);
        const afternoonHour = timeStringToHour(afternoonTime);
        const eveningHour = timeStringToHour(eveningTime);
        
        if (morningHour >= afternoonHour || afternoonHour >= eveningHour) {
            throw new Error('Times must be in sequence: Morning < Afternoon < Evening');
        }
        
        // Here you would typically make an API call to create account
        // For demo purposes, we'll use a simple check
        if (email && password && password.length >= 6) {
            const user = {
                email: email,
                isLoggedIn: true,
                timePreferences: {
                    morning: morningTime,
                    afternoon: afternoonTime,
                    evening: eveningTime
                }
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to app dashboard
            window.location.href = '/app';
        } else {
            throw new Error('Invalid signup details');
        }
    } catch (error) {
        signupError.textContent = error.message;
        signupError.classList.remove('hidden');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Check auth state on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentPath = window.location.pathname;
    
    // Redirect logic
    if (user.isLoggedIn) {
        // If logged in and on login page, redirect to app dashboard
        if (currentPath === '/login') {
            window.location.href = '/app';
        }
        // If logged in and on landing page, redirect to app dashboard
        else if (currentPath === '/') {
            window.location.href = '/app';
        }
    } else {
        // If not logged in and trying to access app, redirect to login
        if (currentPath === '/app') {
            window.location.href = '/login';
        }
    }
}); 