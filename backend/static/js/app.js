// Add this at the beginning of the file
console.log('Loading app.js...');

if (typeof templates === 'undefined') {
    console.error('Templates not loaded! Make sure templates.js is loaded before app.js');
}

// Initialize the application
async function initializeApp() {
    console.log('Initializing app...');
    
    // Check if user is logged in
    let currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.isLoggedIn) {
        console.log('User not logged in, redirecting to login page');
        window.location.href = '/login';
        return;
    }
    
    // Check admin status
    const isAdmin = currentUser.email === 'ahkstltd@gmail.com';
    console.log('User is admin:', isAdmin);
    
    // Set default login state if not present
    if (!currentUser.hasOwnProperty('isLoggedIn')) {
        currentUser.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    if (isAdmin) {
        // Add admin-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .admin-badge {
                position: fixed;
                top: 1rem;
                right: 1rem;
                padding: 0.5rem 1rem;
                background-color: #4F46E5;
                color: white;
                border-radius: 0.5rem;
                font-weight: 600;
                z-index: 50;
            }
            
            .admin-highlight {
                border: 2px solid #4F46E5 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add admin badge
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.textContent = 'Admin Mode';
        document.body.appendChild(adminBadge);
        
        // Show admin tab
        const adminTab = document.getElementById('adminTab');
        if (adminTab) {
            adminTab.classList.remove('hidden');
            // Make admin tab more prominent
            const adminButton = adminTab.querySelector('button');
            if (adminButton) {
                adminButton.classList.add('admin-highlight');
            }
        }
    }
    
    // Wait for templates to be available
    let retries = 0;
    const maxRetries = 5;
    
    async function waitForTemplates() {
        if (typeof window.templates !== 'undefined') {
            console.log('Templates found:', Object.keys(window.templates));
            return true;
        }
        
        if (retries >= maxRetries) {
            console.error('Templates not available after maximum retries');
            return false;
        }
        
        console.log('Waiting for templates to load...');
        retries++;
        await new Promise(resolve => setTimeout(resolve, 100));
        return waitForTemplates();
    }
    
    const templatesLoaded = await waitForTemplates();
    if (!templatesLoaded) {
        console.error('Failed to initialize: Templates not available');
        return;
    }
    
    // Wait for all required elements
    const requiredElements = [
        'mainContent',
        'tabContent',
        'timePeriodBadge',
        'progressBar',
        'progressPercentage',
        'adminTab'
    ];
    
    // Check if all required elements exist
    const elements = {};
    for (const id of requiredElements) {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.error(`Required element not found: ${id}`);
            return;
        }
    }
    
    console.log('All required elements found, initializing...');
    
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log('Found tab buttons:', tabButtons.length);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabName);
            if (!tabName) return;
            
            // Update button states
            tabButtons.forEach(btn => {
                if (btn && btn.classList) {
                    btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
                    btn.classList.add('border-transparent', 'hover:border-gray-300');
                }
            });
            
            if (this.classList) {
                this.classList.add('active', 'border-blue-600', 'text-blue-600');
                this.classList.remove('border-transparent', 'hover:border-gray-300');
            }
            
            // Load tab content
            loadTabContent(tabName);
        });
    });
    
    // Set up navigation buttons
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    if (prevButton) prevButton.addEventListener('click', () => navigateTask('prev'));
    if (nextButton) nextButton.addEventListener('click', () => navigateTask('next'));
    
    // Update admin tab visibility
    if (currentUser.email === 'ahkstltd@gmail.com' && elements.adminTab) {
        elements.adminTab.classList.remove('hidden');
    }
    
    // Initialize time period indicator
    updateTimePeriodIndicator();
    setInterval(updateTimePeriodIndicator, 60000);
    
    // Start with habits tab
    console.log('Loading default habits tab...');
    const defaultTab = document.querySelector('[data-tab="habits"]');
    if (defaultTab) {
        defaultTab.click();
    } else {
        console.error('Default habits tab not found');
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const mainContent = document.getElementById('mainContent');
    const loginPrompt = document.getElementById('loginPrompt');

    if (user.isLoggedIn) {
        if (mainContent) mainContent.classList.remove('hidden');
        if (loginPrompt) loginPrompt.classList.add('hidden');
        initializeApp();
    } else {
        if (mainContent) mainContent.classList.add('hidden');
        if (loginPrompt) loginPrompt.classList.remove('hidden');
        
        // If we're not on the login or home page, redirect to login
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/login') {
            window.location.href = '/login';
        }
    }
});

// Get current time period
function getCurrentTimePeriod() {
    const hour = new Date().getHours();
    
    if (hour >= timePeriodsConfig.morning.start && hour < timePeriodsConfig.morning.end) {
        return { period: 'morning', label: timePeriodsConfig.morning.text };
    } else if (hour >= timePeriodsConfig.afternoon.start && hour < timePeriodsConfig.afternoon.end) {
        return { period: 'afternoon', label: timePeriodsConfig.afternoon.text };
    } else {
        return { period: 'evening', label: timePeriodsConfig.evening.text };
    }
}

// Task flow configuration
const taskFlow = [
    { tab: 'habits', tasks: ['Set daily goals', 'Review habits'] },
    { tab: 'focus', tasks: ['Plan focus sessions', 'Set priorities'] },
    { tab: 'learning', tasks: ['Choose learning path', 'Complete daily quiz'] },
    { tab: 'wellness', tasks: ['Log mood', 'Track wellness activities'] },
    { tab: 'social', tasks: ['Check team challenges', 'Connect with friends'] },
    { tab: 'rewards', tasks: ['Review points', 'Check prize draw entries'] }
];

// Global variables
let currentTaskIndex = 0;
let completedTasks = new Set();

// Update progress bar
function updateProgress() {
    const totalTasks = taskFlow.reduce((sum, section) => sum + section.tasks.length, 0);
    const progress = (completedTasks.size / totalTasks) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressPercentage) progressPercentage.textContent = `${Math.round(progress)}%`;
}

// Navigate between tasks
function navigateTask(direction) {
    console.log('Navigating:', direction);
    const currentTaskSet = taskFlow[currentTaskIndex];
    
    if (direction === 'next') {
        // Check if current tasks are completed
        const isComplete = checkTaskCompletion(currentTaskSet.tab);
        console.log('Tasks completed check:', isComplete);
        
        if (isComplete) {
            // Mark current tasks as completed
            currentTaskSet.tasks.forEach(task => completedTasks.add(`${currentTaskSet.tab}-${task}`));
            
            if (currentTaskIndex < taskFlow.length - 1) {
                currentTaskIndex++;
                console.log('Moving to next tab:', taskFlow[currentTaskIndex].tab);
                const nextTab = document.querySelector(`[data-tab="${taskFlow[currentTaskIndex].tab}"]`);
                if (nextTab) nextTab.click();
            } else {
                console.log('All tasks completed');
                // Handle completion
            }
            
            updateProgress();
            updateNavigationButtons();
        } else {
            console.log('Tasks not completed');
        }
    } else if (direction === 'prev' && currentTaskIndex > 0) {
        currentTaskIndex--;
        console.log('Moving to previous tab:', taskFlow[currentTaskIndex].tab);
        const prevTab = document.querySelector(`[data-tab="${taskFlow[currentTaskIndex].tab}"]`);
        if (prevTab) prevTab.click();
        updateProgress();
        updateNavigationButtons();
    }
}

// Check task completion
function checkTaskCompletion(tabName) {
    const form = document.getElementById(`${tabName}Form`);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
}

// Function to save form data
function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });

    // Save to localStorage with timestamp
    const key = `${formId}_${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(key, JSON.stringify(formData));
}

// Function to load morning work for afternoon check-in
function loadMorningWork() {
    const today = new Date().toISOString().split('T')[0];
    const morningData = JSON.parse(localStorage.getItem(`habitsForm_${today}`) || '{}');
    
    const morningProgressReview = document.getElementById('morningProgressReview');
    if (!morningProgressReview) return;

    let content = '<div class="space-y-3">';
    
    if (morningData.mainFocus) {
        content += `
            <div class="mb-3">
                <h6 class="font-medium text-gray-700">Main Focus:</h6>
                <p class="text-gray-600">${morningData.mainFocus}</p>
            </div>
        `;
    }

    content += '<div class="mb-3"><h6 class="font-medium text-gray-700">Habits:</h6>';
    for (let i = 1; i <= 3; i++) {
        const habitText = morningData[`habit${i}`];
        const habitCompleted = morningData[`habit${i}_completed`];
        if (habitText) {
            content += `
                <div class="flex items-center space-x-2">
                    <span class="text-gray-600">${habitText}</span>
                    <span class="text-${habitCompleted ? 'green' : 'gray'}-500">
                        ${habitCompleted ? '✓' : '○'}
                    </span>
                </div>
            `;
        }
    }
    content += '</div></div>';

    morningProgressReview.innerHTML = content;
}

// Function to load daily summary for evening review
function loadDailySummary() {
    const today = new Date().toISOString().split('T')[0];
    const morningData = JSON.parse(localStorage.getItem(`habitsForm_${today}`) || '{}');
    const afternoonData = JSON.parse(localStorage.getItem(`afternoonCheckIn_${today}`) || '{}');

    // Update morning routine review
    const morningRoutineReview = document.getElementById('morningRoutineReview');
    if (morningRoutineReview) {
        let morningContent = '<div class="space-y-2 pl-4">';
        if (morningData.mainFocus) {
            morningContent += `
                <div>
                    <span class="text-gray-700">Main Focus:</span>
                    <p class="text-gray-600">${morningData.mainFocus}</p>
                </div>
            `;
        }
        morningContent += '<div><span class="text-gray-700">Habits:</span>';
        for (let i = 1; i <= 3; i++) {
            const habitText = morningData[`habit${i}`];
            const habitCompleted = morningData[`habit${i}_completed`];
            if (habitText) {
                morningContent += `
                    <div class="flex items-center space-x-2">
                        <span class="text-gray-600">${habitText}</span>
                        <span class="text-${habitCompleted ? 'green' : 'gray'}-500">
                            ${habitCompleted ? '✓' : '○'}
                        </span>
                    </div>
                `;
            }
        }
        morningContent += '</div></div>';
        morningRoutineReview.innerHTML = morningContent;
    }

    // Update afternoon check-in review
    const afternoonCheckInReview = document.getElementById('afternoonCheckInReview');
    if (afternoonCheckInReview && afternoonData.progressCheck) {
        let afternoonContent = '<div class="space-y-2 pl-4">';
        afternoonContent += `
            <div>
                <span class="text-gray-700">Progress Check:</span>
                <p class="text-gray-600">${afternoonData.progressCheck}</p>
            </div>
            <div>
                <span class="text-gray-700">Focus Level:</span>
                <p class="text-gray-600">${afternoonData.focusLevel || 'Not specified'}</p>
            </div>
        `;
        afternoonContent += '</div>';
        afternoonCheckInReview.innerHTML = afternoonContent;
    }
}

// Update loadTabContent function to handle form data
function loadTabContent(tabName) {
    const tabContent = document.getElementById('tabContent');
    if (!tabContent || !window.templates[tabName]) return;
    
    tabContent.innerHTML = window.templates[tabName];
    
    // Add form submission handlers
    const form = document.getElementById(`${tabName}Form`);
    if (form) {
        // Show/hide content based on time period
        const { period } = getCurrentTimePeriod();
        const morningContent = form.querySelector('.morning-content');
        const afternoonContent = form.querySelector('.afternoon-content');
        const eveningContent = form.querySelector('.evening-content');

        if (morningContent) morningContent.style.display = period === 'morning' ? 'block' : 'none';
        if (afternoonContent) afternoonContent.style.display = period === 'afternoon' ? 'block' : 'none';
        if (eveningContent) eveningContent.style.display = period === 'evening' ? 'block' : 'none';

        // Add form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveFormData(`${tabName}Form`);
        });

        // Add change event listeners to save data
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                saveFormData(`${tabName}Form`);
            });
        });

        // Load relevant data based on time period
        if (period === 'afternoon') {
            loadMorningWork();
            loadAfternoonData(tabName);
        } else if (period === 'evening') {
            loadDailySummary();
            loadEveningData(tabName);
        }
    }
}

// Function to load afternoon data for each tab
function loadAfternoonData(tabName) {
    const today = new Date().toISOString().split('T')[0];
    const morningData = JSON.parse(localStorage.getItem(`${tabName}Form_${today}`) || '{}');
    
    // Load tab-specific morning data
    const reviewDiv = document.getElementById(`morning${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Review`);
    if (!reviewDiv) return;

    let content = '<div class="space-y-3">';
    
    switch (tabName) {
        case 'focus':
            if (morningData.morningPriorities) {
                content += `
                    <div>
                        <h6 class="font-medium text-gray-700">Morning Priorities:</h6>
                        <p class="text-gray-600">${morningData.morningPriorities}</p>
                    </div>
                `;
            }
            break;
        case 'learning':
            if (morningData.morningLearningGoal) {
                content += `
                    <div>
                        <h6 class="font-medium text-gray-700">Learning Goals:</h6>
                        <p class="text-gray-600">${morningData.morningLearningGoal}</p>
                    </div>
                `;
            }
            break;
        case 'wellness':
            if (morningData.morningMoodLevel) {
                content += `
                    <div>
                        <h6 class="font-medium text-gray-700">Morning Mood:</h6>
                        <p class="text-gray-600">${morningData.morningMoodLevel}/10</p>
                    </div>
                `;
            }
            break;
        case 'social':
            if (morningData.morningSocialGoals) {
                content += `
                    <div>
                        <h6 class="font-medium text-gray-700">Connection Goals:</h6>
                        <p class="text-gray-600">${morningData.morningSocialGoals}</p>
                    </div>
                `;
            }
            break;
    }
    
    content += '</div>';
    reviewDiv.innerHTML = content;
}

// Function to load evening data for each tab
function loadEveningData(tabName) {
    const today = new Date().toISOString().split('T')[0];
    const morningData = JSON.parse(localStorage.getItem(`${tabName}Form_${today}`) || '{}');
    const afternoonData = JSON.parse(localStorage.getItem(`${tabName}Form_afternoon_${today}`) || '{}');
    
    const summaryDiv = document.getElementById(`${tabName}Summary`);
    if (!summaryDiv) return;

    let content = '<div class="space-y-3">';
    
    switch (tabName) {
        case 'focus':
            content += `
                <div>
                    <h6 class="font-medium text-gray-700">Morning Priorities:</h6>
                    <p class="text-gray-600">${morningData.morningPriorities || 'Not set'}</p>
                </div>
                <div>
                    <h6 class="font-medium text-gray-700">Afternoon Progress:</h6>
                    <p class="text-gray-600">${afternoonData.focusProgress || 'No progress recorded'}</p>
                </div>
            `;
            break;
        case 'learning':
            content += `
                <div>
                    <h6 class="font-medium text-gray-700">Learning Goals:</h6>
                    <p class="text-gray-600">${morningData.morningLearningGoal || 'Not set'}</p>
                </div>
                <div>
                    <h6 class="font-medium text-gray-700">Progress:</h6>
                    <p class="text-gray-600">${afternoonData.learningProgress || 'No progress recorded'}</p>
                </div>
            `;
            break;
        case 'wellness':
            content += `
                <div>
                    <h6 class="font-medium text-gray-700">Mood Tracking:</h6>
                    <p class="text-gray-600">Morning: ${morningData.morningMoodLevel || 'Not recorded'}/10</p>
                    <p class="text-gray-600">Afternoon: ${afternoonData.afternoonMoodLevel || 'Not recorded'}/10</p>
                </div>
                <div>
                    <h6 class="font-medium text-gray-700">Progress on Goals:</h6>
                    <p class="text-gray-600">${afternoonData.wellnessProgress || 'No progress recorded'}</p>
                </div>
            `;
            break;
        case 'social':
            content += `
                <div>
                    <h6 class="font-medium text-gray-700">Connection Goals:</h6>
                    <p class="text-gray-600">${morningData.morningSocialGoals || 'Not set'}</p>
                </div>
                <div>
                    <h6 class="font-medium text-gray-700">Progress:</h6>
                    <p class="text-gray-600">${afternoonData.socialProgress || 'No progress recorded'}</p>
                </div>
            `;
            break;
    }
    
    content += '</div>';
    summaryDiv.innerHTML = content;
}

// Update navigation buttons
function updateNavigationButtons() {
    console.log('Updating navigation buttons');
    console.log('Current tab:', currentTaskIndex);
    console.log('Task completion status:', completedTasks);
    
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    if (!prevButton || !nextButton) {
        console.error('Navigation buttons not found');
        return;
    }
    
    // Previous button logic
    if (currentTaskIndex > 0) {
        console.log('Showing previous button');
        prevButton.classList.remove('hidden');
    } else {
        console.log('Hiding previous button');
        prevButton.classList.add('hidden');
    }
    
    // Next button logic
    const currentTab = taskFlow[currentTaskIndex]?.tab;
    const isCurrentTabComplete = currentTab ? checkTaskCompletion(currentTab) : false;
    const isNotLastTab = currentTaskIndex < taskFlow.length - 1;
    const shouldShow = isCurrentTabComplete && isNotLastTab;
    
    console.log('Next button conditions:', {
        isCurrentTabComplete,
        isNotLastTab,
        shouldShow
    });
    
    if (shouldShow) {
        console.log('Showing next button');
        nextButton.classList.remove('hidden');
    } else {
        console.log('Hiding next button');
        nextButton.classList.add('hidden');
    }
}

// Load admin dashboard data
async function loadAdminDashboard() {
    try {
        console.log('Loading admin dashboard data...');
        
        // Quick Stats
        const statsElements = {
            totalUsers: { value: '1,234', trend: '+12.5% this month' },
            activeUsers: { value: '456', trend: '37% of total users' },
            completedTasks: { value: '15,678', trend: 'Avg. 12.7 per user' },
            totalPoints: { value: '89,432', trend: 'Avg. 72.5 per user' }
        };

        // Update stats
        Object.entries(statsElements).forEach(([id, data]) => {
            const element = document.getElementById(id);
            const trendElement = document.getElementById(id === 'totalUsers' ? 'userGrowth' : 
                                id === 'activeUsers' ? 'activePercentage' : 
                                id === 'completedTasks' ? 'taskCompletion' : 'avgPointsPerUser');
            
            if (element) element.textContent = data.value;
            if (trendElement) trendElement.textContent = data.trend;
        });

        // User Table
        const userTableBody = document.getElementById('userTableBody');
        if (userTableBody) {
            const users = [
                { email: 'john.doe@example.com', status: 'Active', points: 245 },
                { email: 'jane.smith@example.com', status: 'Inactive', points: 180 },
                { email: 'bob.wilson@example.com', status: 'Active', points: 320 },
                { email: 'alice.jones@example.com', status: 'Active', points: 290 },
                { email: 'sarah.parker@example.com', status: 'Active', points: 410 }
            ];

            userTableBody.innerHTML = users.map(user => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                                ${user.email[0].toUpperCase()}
                            </div>
                            <span class="text-sm">${user.email}</span>
                        </div>
                    </td>
                    <td class="py-3">
                        <span class="px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}">
                            ${user.status}
                        </span>
                    </td>
                    <td class="py-3">
                        <span class="text-sm">${user.points}</span>
                    </td>
                    <td class="py-3">
                        <div class="flex space-x-2">
                            <button class="p-1 hover:bg-gray-100 rounded" title="Edit User">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                            </button>
                            <button class="p-1 hover:bg-gray-100 rounded" title="Delete User">
                                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        // Prize Draws
        const prizeDrawList = document.getElementById('prizeDrawList');
        if (prizeDrawList) {
            const prizeDraws = [
                { name: 'Weekly Wellness Challenge', entries: 156, endDate: '2024-03-20', prize: '£50 Amazon Voucher', status: 'Active' },
                { name: 'Monthly Mega Draw', entries: 892, endDate: '2024-03-31', prize: 'iPad Mini', status: 'Active' },
                { name: 'Productivity Champion', entries: 234, endDate: '2024-03-25', prize: 'Premium Subscription', status: 'Active' }
            ];

            prizeDrawList.innerHTML = prizeDraws.map(draw => `
                <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                        <h5 class="font-medium text-gray-900">${draw.name}</h5>
                        <p class="text-sm text-gray-600">Prize: ${draw.prize}</p>
                        <div class="flex items-center mt-1 text-sm text-gray-500">
                            <span class="mr-3">${draw.entries} entries</span>
                            <span>Ends: ${draw.endDate}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                            Edit
                        </button>
                        <button class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200">
                            End Draw
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Recent Activity
        const recentActivity = document.getElementById('recentActivity');
        if (recentActivity) {
            const activities = [
                { type: 'user_joined', user: 'Sarah Wilson', time: '5 minutes ago' },
                { type: 'prize_claimed', user: 'John Doe', prize: 'Weekly Wellness Draw', time: '2 hours ago' },
                { type: 'milestone_reached', user: 'Alice Brown', milestone: '100 tasks completed', time: '4 hours ago' },
                { type: 'points_awarded', user: 'Bob Martin', points: 50, reason: 'Perfect Week', time: 'Yesterday' },
                { type: 'user_joined', user: 'Mike Johnson', time: 'Yesterday' }
            ];

            recentActivity.innerHTML = activities.map(activity => {
                let icon, text;
                switch (activity.type) {
                    case 'user_joined':
                        icon = '<div class="p-2 bg-green-100 rounded-lg"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></div>';
                        text = `<strong>${activity.user}</strong> joined the platform`;
                        break;
                    case 'prize_claimed':
                        icon = '<div class="p-2 bg-yellow-100 rounded-lg"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg></div>';
                        text = `<strong>${activity.user}</strong> claimed prize in <strong>${activity.prize}</strong>`;
                        break;
                    case 'milestone_reached':
                        icon = '<div class="p-2 bg-blue-100 rounded-lg"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg></div>';
                        text = `<strong>${activity.user}</strong> reached milestone: ${activity.milestone}`;
                        break;
                    case 'points_awarded':
                        icon = '<div class="p-2 bg-purple-100 rounded-lg"><svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
                        text = `<strong>${activity.user}</strong> earned ${activity.points} points for ${activity.reason}`;
                        break;
                }

                return `
                    <div class="flex items-center space-x-4">
                        ${icon}
                        <div class="flex-1">
                            <p class="text-sm text-gray-900">${text}</p>
                            <span class="text-xs text-gray-500">${activity.time}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Failed to load admin dashboard. Please try again.</p>
                </div>
            `;
        }
    }
}

// Load rewards data
async function loadRewardsData() {
    try {
        const pointsDisplay = document.getElementById('pointsDisplay');
        const achievementsList = document.getElementById('achievementsList');
        const prizeDraws = document.getElementById('prizeDraws');

        // Update points display
        if (pointsDisplay) {
            pointsDisplay.textContent = '750'; // In a real app, this would be fetched from the server
        }

        // Load achievements
        if (achievementsList) {
            const achievements = [
                { name: 'Early Bird', description: 'Completed morning routine 7 days in a row', points: 100 },
                { name: 'Focus Master', description: 'Completed 10 deep work sessions', points: 150 },
                { name: 'Wellness Warrior', description: 'Tracked mood for 14 consecutive days', points: 200 }
            ];

            achievementsList.innerHTML = `
                <h4 class="text-lg font-semibold mb-4">Recent Achievements</h4>
                <div class="space-y-4">
                    ${achievements.map(achievement => `
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="font-medium text-gray-900">${achievement.name}</h5>
                                    <p class="text-sm text-gray-600">${achievement.description}</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
                                    +${achievement.points} pts
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Load prize draws
        if (prizeDraws) {
            const availableDraws = [
                { 
                    name: 'Weekly Wellness Draw',
                    prize: '£50 Amazon Voucher',
                    entries: 3,
                    totalEntries: 156,
                    endDate: '2024-03-20'
                },
                {
                    name: 'Monthly Mega Draw',
                    prize: 'iPad Mini',
                    entries: 5,
                    totalEntries: 892,
                    endDate: '2024-03-31'
                }
            ];

            prizeDraws.innerHTML = `
                <h4 class="text-lg font-semibold mb-4">Active Prize Draws</h4>
                <div class="space-y-4">
                    ${availableDraws.map(draw => `
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="font-medium text-gray-900">${draw.name}</h5>
                                    <p class="text-sm text-gray-600">Prize: ${draw.prize}</p>
                                    <div class="mt-2 text-sm">
                                        <span class="text-blue-600">${draw.entries} entries</span>
                                        <span class="text-gray-500"> (${draw.totalEntries} total)</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">Ends: ${draw.endDate}</p>
                                </div>
                                <button class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm">
                                    Enter Draw
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading rewards data:', error);
        const rewardsContent = document.getElementById('rewardsContent');
        if (rewardsContent) {
            rewardsContent.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Failed to load rewards data. Please try again.</p>
                </div>
            `;
        }
    }
}

// Preview time period for admin
function previewTimePeriod(period) {
    console.log('Previewing time period:', period);
    const mainContent = document.getElementById('tabContent');
    if (!mainContent) return;

    // Override the current time period for preview
    const originalGetTimePeriod = getCurrentTimePeriod;
    getCurrentTimePeriod = () => {
        switch (period) {
            case 'morning':
                return { period: 'morning', label: 'Morning Routine' };
            case 'afternoon':
                return { period: 'afternoon', label: 'Afternoon Check-in' };
            case 'evening':
                return { period: 'evening', label: 'Evening Review' };
            default:
                return originalGetTimePeriod();
        }
    };

    // Update the time period badge
    updateTimePeriodIndicator();

    // Load the appropriate content based on time period
    let content = '';
    switch (period) {
        case 'morning':
            content = `
                <div class="space-y-8">
                    <div class="bg-yellow-50 p-4 rounded-lg mb-6">
                        <p class="text-yellow-800 font-medium">🌅 Morning Routine View</p>
                        <p class="text-yellow-600 text-sm">Start your day with intention and clarity</p>
                    </div>
                    
                    ${window.templates.habits}
                    
                    <div class="mt-8">
                        ${window.templates.focus}
                    </div>
                    
                    <div class="mt-8">
                        ${window.templates.wellness}
                    </div>
                </div>
            `;
            break;
            
        case 'afternoon':
            content = `
                <div class="space-y-8">
                    <div class="bg-blue-50 p-4 rounded-lg mb-6">
                        <p class="text-blue-800 font-medium">☀️ Afternoon Check-in View</p>
                        <p class="text-blue-600 text-sm">Track your progress and maintain momentum</p>
                    </div>
                    
                    ${window.templates.focus}
                    
                    <div class="mt-8">
                        ${window.templates.learning}
                    </div>
                    
                    <div class="mt-8">
                        ${window.templates.social}
                    </div>
                </div>
            `;
            break;
            
        case 'evening':
            content = `
                <div class="space-y-8">
                    <div class="bg-purple-50 p-4 rounded-lg mb-6">
                        <p class="text-purple-800 font-medium">🌙 Evening Review View</p>
                        <p class="text-purple-600 text-sm">Reflect on your achievements and plan for tomorrow</p>
                    </div>
                    
                    ${window.templates.habits}
                    
                    <div class="mt-8">
                        ${window.templates.rewards}
                    </div>
                    
                    <div class="mt-8">
                        <div class="bg-white p-6 rounded-lg shadow mb-6">
                            <h4 class="text-lg font-semibold mb-4">Tomorrow's Planning</h4>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Key Goals for Tomorrow</label>
                                    <textarea class="w-full px-3 py-2 border rounded-lg" rows="3" placeholder="What would you like to achieve tomorrow?"></textarea>
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Potential Challenges</label>
                                    <textarea class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="What challenges might you face?"></textarea>
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Support Needed</label>
                                    <textarea class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="What support or resources will you need?"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    mainContent.innerHTML = content;

    // Add a "Return to Admin View" button
    const returnButton = document.createElement('button');
    returnButton.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors';
    returnButton.textContent = 'Return to Admin View';
    returnButton.onclick = () => {
        getCurrentTimePeriod = originalGetTimePeriod;
        updateTimePeriodIndicator();
        loadTabContent('admin');
    };
    document.body.appendChild(returnButton);

    // Remove the return button after returning to admin view
    setTimeout(() => {
        document.body.removeChild(returnButton);
    }, 5000);
}

// Update time period indicator
function updateTimePeriodIndicator() {
    const period = getCurrentTimePeriod();
    const morningBadge = document.getElementById('morningBadge');
    const afternoonBadge = document.getElementById('timePeriodBadge');
    const eveningBadge = document.getElementById('eveningBadge');
    
    if (!afternoonBadge || !morningBadge || !eveningBadge) return;

    // Reset all badges to default state with preserved clickability
    const baseClasses = 'inline-block px-4 py-2 rounded-full text-white font-semibold cursor-pointer transition-all duration-200';
    morningBadge.className = `${baseClasses} bg-yellow-500 opacity-50 transform scale-90 hover:bg-yellow-600`;
    afternoonBadge.className = `${baseClasses} bg-blue-500 opacity-50 transform scale-90 hover:bg-blue-600`;
    eveningBadge.className = `${baseClasses} bg-purple-500 opacity-50 transform scale-90 hover:bg-purple-600`;

    // Update content
    morningBadge.textContent = 'Morning Routine';
    afternoonBadge.textContent = 'Afternoon Check-in';
    eveningBadge.textContent = 'Evening Review';

    // Highlight current period
    switch (period.period) {
        case 'morning':
            morningBadge.className = `${baseClasses} bg-yellow-500 shadow-lg transform scale-110 hover:bg-yellow-600`;
            break;
        case 'afternoon':
            afternoonBadge.className = `${baseClasses} bg-blue-500 shadow-lg transform scale-110 hover:bg-blue-600`;
            break;
        case 'evening':
            eveningBadge.className = `${baseClasses} bg-purple-500 shadow-lg transform scale-110 hover:bg-purple-600`;
            break;
    }

    // Add click handlers for all badges
    [
        { badge: morningBadge, period: 'morning' },
        { badge: afternoonBadge, period: 'afternoon' },
        { badge: eveningBadge, period: 'evening' }
    ].forEach(({ badge, period: badgePeriod }) => {
        if (!badge.onclick) {
            badge.addEventListener('click', () => {
                previewTimePeriod(badgePeriod);
            });
        }
    });
} 