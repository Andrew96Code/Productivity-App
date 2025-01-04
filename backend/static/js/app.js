// Form visibility functions
function showAddHabitForm() {
    document.getElementById('addHabitForm').classList.remove('hidden');
}

function hideAddHabitForm() {
    document.getElementById('addHabitForm').classList.add('hidden');
}

function showAddGoalForm() {
    document.getElementById('addGoalForm').classList.remove('hidden');
}

function hideAddGoalForm() {
    document.getElementById('addGoalForm').classList.add('hidden');
}

function showAddTimeEntryForm() {
    document.getElementById('addTimeEntryForm').classList.remove('hidden');
}

function hideAddTimeEntryForm() {
    document.getElementById('addTimeEntryForm').classList.add('hidden');
}

function showSelectPathForm() {
    document.getElementById('selectPathForm').classList.remove('hidden');
}

function hideSelectPathForm() {
    document.getElementById('selectPathForm').classList.add('hidden');
}

function showAddActivityForm() {
    document.getElementById('addActivityForm').classList.remove('hidden');
}

function hideAddActivityForm() {
    document.getElementById('addActivityForm').classList.add('hidden');
}

function showAddFriendForm() {
    document.getElementById('addFriendForm').classList.remove('hidden');
}

function hideAddFriendForm() {
    document.getElementById('addFriendForm').classList.add('hidden');
}

function showCreateChallengeForm() {
    document.getElementById('createChallengeForm').classList.remove('hidden');
}

function hideCreateChallengeForm() {
    document.getElementById('createChallengeForm').classList.add('hidden');
}

// Timer functionality
let timerInterval;
let timeLeft;
let isPaused = false;

function startTimer() {
    if (!timerInterval) {
        const duration = parseInt(document.getElementById('timerDuration').value);
        timeLeft = duration * 60;
        document.getElementById('startTimerBtn').classList.add('hidden');
        document.getElementById('pauseTimerBtn').classList.remove('hidden');
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function pauseTimer() {
    if (timerInterval) {
        if (!isPaused) {
            clearInterval(timerInterval);
            document.getElementById('pauseTimerBtn').textContent = 'Resume';
        } else {
            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('pauseTimerBtn').textContent = 'Pause';
        }
        isPaused = !isPaused;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = parseInt(document.getElementById('timerDuration').value) * 60;
    isPaused = false;
    document.getElementById('startTimerBtn').classList.remove('hidden');
    document.getElementById('pauseTimerBtn').classList.add('hidden');
    document.getElementById('pauseTimerBtn').textContent = 'Pause';
    updateTimerDisplay();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Timer completed!');
        document.getElementById('startTimerBtn').classList.remove('hidden');
        document.getElementById('pauseTimerBtn').classList.add('hidden');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Form submission handlers
async function createHabit(event) {
    event.preventDefault();
    const title = document.getElementById('habitTitle').value;
    const category = document.getElementById('habitCategory').value;
    const frequency = document.getElementById('habitFrequency').value;
    
    try {
        const response = await fetch('/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                category,
                frequency,
                user_id: currentUser.id
            })
        });
        
        if (response.ok) {
            hideAddHabitForm();
            loadHabits();
        } else {
            alert('Failed to create habit. Please try again.');
        }
    } catch (error) {
        console.error('Error creating habit:', error);
        alert('An error occurred. Please try again.');
    }
}

async function createGoal(event) {
    event.preventDefault();
    const title = document.getElementById('goalTitle').value;
    const category = document.getElementById('goalCategory').value;
    const deadline = document.getElementById('goalDeadline').value;
    
    try {
        const response = await fetch('/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                category,
                deadline,
                user_id: currentUser.id
            })
        });
        
        if (response.ok) {
            hideAddGoalForm();
            loadGoals();
        } else {
            alert('Failed to create goal. Please try again.');
        }
    } catch (error) {
        console.error('Error creating goal:', error);
        alert('An error occurred. Please try again.');
    }
}

// Initialize date display
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = currentDate;
});

// Quiz functionality
let currentQuestion = null;
let selectedAnswer = null;
let quizScore = 0;
let questionsAnswered = 0;
const TOTAL_QUESTIONS = 5;

// Static quiz questions
const quizQuestions = [
    {
        id: 1,
        text: "What is the most effective way to build a new habit?",
        options: [
            "Start big and aim for dramatic changes",
            "Start small and build gradually",
            "Wait for motivation",
            "Change everything at once"
        ],
        correct_index: 1
    },
    {
        id: 2,
        text: "Which technique is recommended for maintaining focus during work?",
        options: [
            "Multitasking constantly",
            "Working for hours without breaks",
            "The Pomodoro Technique (focused work with breaks)",
            "Checking emails every few minutes"
        ],
        correct_index: 2
    },
    {
        id: 3,
        text: "What is a key component of emotional intelligence?",
        options: [
            "Self-awareness",
            "Being always right",
            "Avoiding all conflicts",
            "Hiding your emotions"
        ],
        correct_index: 0
    },
    {
        id: 4,
        text: "Which is the most effective way to manage stress?",
        options: [
            "Ignoring it completely",
            "Regular exercise and meditation",
            "Working longer hours",
            "Avoiding all challenging situations"
        ],
        correct_index: 1
    },
    {
        id: 5,
        text: "What is the best approach to goal setting?",
        options: [
            "Setting vague, general goals",
            "Only focusing on long-term goals",
            "Setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
            "Not setting any goals"
        ],
        correct_index: 2
    },
    {
        id: 6,
        text: "Which is most important for maintaining good mental health?",
        options: [
            "Working constantly",
            "Maintaining work-life balance",
            "Avoiding all social interactions",
            "Never taking breaks"
        ],
        correct_index: 1
    },
    {
        id: 7,
        text: "What is the best way to improve time management?",
        options: [
            "Prioritizing tasks and planning ahead",
            "Doing everything at the last minute",
            "Never making any plans",
            "Taking on every request"
        ],
        correct_index: 0
    },
    {
        id: 8,
        text: "Which is most beneficial for learning?",
        options: [
            "Cramming all at once",
            "Never reviewing material",
            "Spaced repetition and active recall",
            "Passive reading only"
        ],
        correct_index: 2
    }
];

// Keep track of used questions
let usedQuestionIndices = new Set();

async function loadQuestion() {
    try {
        // Check if all questions are answered
        if (questionsAnswered >= TOTAL_QUESTIONS) {
            showQuizComplete();
            return;
        }

        // Get a random unused question
        let availableIndices = Array.from(Array(quizQuestions.length).keys())
            .filter(i => !usedQuestionIndices.has(i));
        
        if (availableIndices.length === 0) {
            // Reset used questions if we've used them all
            usedQuestionIndices.clear();
            availableIndices = Array.from(Array(quizQuestions.length).keys());
        }
        
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        usedQuestionIndices.add(randomIndex);
        currentQuestion = quizQuestions[randomIndex];
        selectedAnswer = null;
        
        // Update the question text
        const questionElement = document.getElementById('quizQuestion');
        if (questionElement) {
            questionElement.textContent = `Question ${questionsAnswered + 1} of ${TOTAL_QUESTIONS}: ${currentQuestion.text}`;
        }
        
        // Create the options buttons
        const optionsContainer = document.getElementById('quizOptions');
        if (optionsContainer) {
            optionsContainer.innerHTML = currentQuestion.options.map((option, index) => `
                <button type="button" class="w-full px-4 py-3 text-left border rounded-lg hover:bg-blue-50 answer-option" onclick="selectAnswer(${index})">
                    ${option}
                </button>
            `).join('');
        }
        
        // Reset the submit button state
        const submitButton = document.getElementById('submitAnswerBtn');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.onclick = submitAnswer;
        }
        
        // Show quiz content and hide results
        const quizContent = document.getElementById('quizContent');
        const quizResults = document.getElementById('quizResults');
        if (quizContent && quizResults) {
            quizContent.classList.remove('hidden');
            quizResults.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Error loading quiz question:', error);
        alert('Failed to load quiz question. Please try again.');
    }
}

function selectAnswer(index) {
    selectedAnswer = index;
    
    // Enable submit button
    const submitButton = document.getElementById('submitAnswerBtn');
    if (submitButton) {
        submitButton.disabled = false;
    }
    
    // Update visual feedback
    const options = document.querySelectorAll('.answer-option');
    options.forEach((option, i) => {
        if (i === index) {
            option.classList.add('bg-blue-50', 'border-blue-500');
        } else {
            option.classList.remove('bg-blue-50', 'border-blue-500');
        }
    });
}

async function submitAnswer() {
    if (selectedAnswer === null) {
        console.log('No answer selected');
        return;
    }
    
    console.log('Submitting answer:', selectedAnswer);
    
    try {
        // Check answer against current question's correct_index
        const isCorrect = selectedAnswer === currentQuestion.correct_index;
        
        // Update visual feedback
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, i) => {
            if (i === selectedAnswer) {
                option.classList.add(isCorrect ? 'bg-green-100' : 'bg-red-100');
            }
            if (i === currentQuestion.correct_index) {
                option.classList.add('bg-green-100');
            }
            option.disabled = true;
        });
        
        // Update score only if correct
        if (isCorrect) {
            quizScore++;
            document.getElementById('quizScore').textContent = `Score: ${quizScore} / ${TOTAL_QUESTIONS}`;
        }
        
        // Always increment questions answered and move to next question
        questionsAnswered++;
        console.log('Questions answered:', questionsAnswered);
        
        // Update task completion status
        checkTaskCompletion('learning');
        
        // Disable submit button
        const submitButton = document.getElementById('submitAnswerBtn');
        if (submitButton) {
            submitButton.disabled = true;
        }
        
        // Wait a moment to show feedback before loading next question or showing results
        setTimeout(() => {
            if (questionsAnswered >= TOTAL_QUESTIONS) {
                showQuizComplete();
            } else {
                loadQuestion();
            }
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Failed to submit answer. Please try again.');
    }
}

function showQuizComplete() {
    const quizContent = document.getElementById('quizContent');
    const quizResults = document.getElementById('quizResults');
    
    if (quizContent && quizResults) {
        quizContent.classList.add('hidden');
        quizResults.classList.remove('hidden');
        
        // Update final score display
        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = `${quizScore} out of ${TOTAL_QUESTIONS}`;
        }
        
        // Update task completion status
        taskCompletionStatus.learning = true;
        updateNavigationButtons();
    }
}

// Initialize quiz when learning tab is opened
document.addEventListener('DOMContentLoaded', () => {
    const learningTab = document.querySelector('[data-tab="learning"]');
    if (learningTab) {
        learningTab.addEventListener('click', () => {
            if (questionsAnswered === 0) {
                loadQuestion();
            }
        });
    }
});

// Global variables for task tracking
let currentTab = 'habits';
let taskCompletionStatus = {
    habits: false,
    focus: false,
    wellness: false,
    social: false,
    learning: false,
    rewards: false
};

// Tab switching functionality
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Get required elements
    const contentDiv = document.getElementById('tabContent');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    if (!contentDiv || !tabButtons.length) {
        console.error('Required elements not found for tab switch');
        return;
    }
    
    try {
        // Update active tab
        currentTab = tabName;
        
        // Update tab button styles
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('border-blue-500', 'text-blue-600');
                button.classList.remove('border-transparent', 'text-gray-500');
            } else {
                button.classList.remove('border-blue-500', 'text-blue-600');
                button.classList.add('border-transparent', 'text-gray-500');
            }
        });
        
        // Load tab content
        loadTabContent(tabName);
        
        // Update navigation buttons after content is loaded
        setTimeout(updateNavigationButtons, 100);
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// Function to load tab content
async function loadTabContent(tabName) {
    const contentDiv = document.getElementById('tabContent');
    if (!contentDiv) {
        console.error('Tab content div not found in DOM');
        return;
    }
    
    try {
        // Clear current content
        contentDiv.innerHTML = '';
        
        // Add loading indicator
        contentDiv.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div><p class="mt-2 text-gray-600">Loading...</p></div>';
        
        // Create default content for each tab
        const defaultContent = {
            habits: `
                <div id="habitsForm">
                    <h3 class="text-xl font-bold mb-4">Daily Habits & Goals</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Morning Questions</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="mainFocus" class="block text-gray-700 font-medium mb-2">What is your main focus for today?</label>
                                    <textarea id="mainFocus" name="mainFocus" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">What habits will you focus on today?</label>
                                    <div class="space-y-2">
                                        <div class="flex items-center space-x-2">
                                            <input type="text" id="habit1" name="habit1" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                            <div class="flex items-center">
                                                <input type="checkbox" id="habit1_completed" name="habit1_completed" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                                <label for="habit1_completed" class="ml-2 text-sm text-gray-600">Completed</label>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="text" id="habit2" name="habit2" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                            <div class="flex items-center">
                                                <input type="checkbox" id="habit2_completed" name="habit2_completed" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                                <label for="habit2_completed" class="ml-2 text-sm text-gray-600">Completed</label>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <input type="text" id="habit3" name="habit3" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                            <div class="flex items-center">
                                                <input type="checkbox" id="habit3_completed" name="habit3_completed" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                                <label for="habit3_completed" class="ml-2 text-sm text-gray-600">Completed</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Evening Reflection</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="accomplishments" class="block text-gray-700 font-medium mb-2">What did you accomplish today?</label>
                                    <textarea id="accomplishments" name="accomplishments" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                                </div>
                                <div>
                                    <label for="improvements" class="block text-gray-700 font-medium mb-2">What could you have done better?</label>
                                    <textarea id="improvements" name="improvements" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                                </div>
                                <div>
                                    <label for="tomorrowGoals" class="block text-gray-700 font-medium mb-2">What are your goals for tomorrow?</label>
                                    <textarea id="tomorrowGoals" name="tomorrowGoals" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            focus: `
                <div id="focusForm">
                    <h3 class="text-xl font-bold mb-4">Focus & Time Management</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Focus Sessions</h4>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">What are your top 3 priorities?</label>
                                    <div class="space-y-2">
                                        <div>
                                            <label for="priority1" class="block text-gray-700 text-sm mb-1">Priority 1</label>
                                            <input type="text" id="priority1" name="priority1" class="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Enter your first priority" required>
                                        </div>
                                        <div>
                                            <label for="priority2" class="block text-gray-700 text-sm mb-1">Priority 2</label>
                                            <input type="text" id="priority2" name="priority2" class="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Enter your second priority" required>
                                        </div>
                                        <div>
                                            <label for="priority3" class="block text-gray-700 text-sm mb-1">Priority 3</label>
                                            <input type="text" id="priority3" name="priority3" class="w-full px-3 py-2 border rounded-lg" placeholder="Enter your third priority" required>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Schedule your focus sessions</label>
                                    <div class="space-y-2">
                                        <div class="flex items-center space-x-2">
                                            <div>
                                                <label for="session1_time" class="block text-gray-700 text-sm mb-1">Session 1 Time</label>
                                                <input type="time" id="session1_time" name="session1_time" class="px-3 py-2 border rounded-lg" required>
                                            </div>
                                            <div class="flex-1">
                                                <label for="session1_desc" class="block text-gray-700 text-sm mb-1">Session 1 Description</label>
                                                <input type="text" id="session1_desc" name="session1_desc" class="w-full px-3 py-2 border rounded-lg" placeholder="What will you work on?" required>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <div>
                                                <label for="session2_time" class="block text-gray-700 text-sm mb-1">Session 2 Time</label>
                                                <input type="time" id="session2_time" name="session2_time" class="px-3 py-2 border rounded-lg" required>
                                            </div>
                                            <div class="flex-1">
                                                <label for="session2_desc" class="block text-gray-700 text-sm mb-1">Session 2 Description</label>
                                                <input type="text" id="session2_desc" name="session2_desc" class="w-full px-3 py-2 border rounded-lg" placeholder="What will you work on?" required>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <div>
                                                <label for="session3_time" class="block text-gray-700 text-sm mb-1">Session 3 Time</label>
                                                <input type="time" id="session3_time" name="session3_time" class="px-3 py-2 border rounded-lg" required>
                                            </div>
                                            <div class="flex-1">
                                                <label for="session3_desc" class="block text-gray-700 text-sm mb-1">Session 3 Description</label>
                                                <input type="text" id="session3_desc" name="session3_desc" class="w-full px-3 py-2 border rounded-lg" placeholder="What will you work on?" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            learning: `
                <div id="learningForm">
                    <h3 class="text-xl font-bold mb-4">Daily Learning</h3>
                    <div class="bg-white p-6 rounded-lg shadow">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-lg font-semibold">Daily Quiz</h4>
                            <span id="quizScore" class="text-sm font-medium text-gray-600">Score: 0 / ${TOTAL_QUESTIONS}</span>
                        </div>
                        <div id="quizContent" class="space-y-6">
                            <div id="quizQuestion" class="text-lg font-medium mb-4"></div>
                            <div id="quizOptions" class="space-y-3"></div>
                            <div class="flex justify-end">
                                <button onclick="submitAnswer()" id="submitAnswerBtn" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50" disabled>
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                        <div id="quizResults" class="hidden text-center py-8">
                            <div class="text-4xl font-bold mb-4">Quiz Complete!</div>
                            <div class="text-lg mb-6">You scored: <span id="finalScore">0</span> points</div>
                            <p class="text-gray-600">Come back tomorrow for a new quiz!</p>
                        </div>
                    </div>
                </div>
            `,
            wellness: `
                <div id="wellnessForm">
                    <h3 class="text-xl font-bold mb-4">Wellness Tracking</h3>
                    <div class="space-y-6">
                        <div>
                            <label for="moodNotes" class="block text-gray-700 font-medium mb-2">How are you feeling today?</label>
                            <textarea id="moodNotes" name="moodNotes" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                        </div>
                        <div>
                            <label for="wellnessActivities" class="block text-gray-700 font-medium mb-2">What wellness activities did you do today?</label>
                            <textarea id="wellnessActivities" name="wellnessActivities" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                        </div>
                    </div>
                </div>
            `,
            social: `
                <div id="socialForm">
                    <h3 class="text-xl font-bold mb-4">Social Connections</h3>
                    <div class="space-y-6">
                        <div>
                            <label for="socialConnections" class="block text-gray-700 font-medium mb-2">Who did you connect with today?</label>
                            <textarea id="socialConnections" name="socialConnections" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                        </div>
                        <div>
                            <label for="conversations" class="block text-gray-700 font-medium mb-2">What meaningful conversations did you have?</label>
                            <textarea id="conversations" name="conversations" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                        </div>
                    </div>
                </div>
            `,
            rewards: `
                <div id="rewardsContent">
                    <h3 class="text-xl font-bold mb-4">Your Rewards</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Points Summary</h4>
                            <div class="text-3xl font-bold text-blue-600 mb-2">100</div>
                            <p class="text-gray-600">Total points earned</p>
                            
                            <div class="mt-4">
                                <h5 class="font-medium mb-2">Recent Activity</h5>
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span>Daily Tasks Completed</span>
                                        <span class="text-blue-600">+50 points</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>Quiz Score Bonus</span>
                                        <span class="text-blue-600">+30 points</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span>Wellness Streak</span>
                                        <span class="text-blue-600">+20 points</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Prize Draw Entries</h4>
                            <div class="space-y-4">
                                <div class="p-4 bg-blue-50 rounded-lg">
                                    <div class="font-medium">Weekly Prize Draw</div>
                                    <div class="text-sm text-gray-600 mt-1">2 entries</div>
                                    <div class="mt-2 text-sm">Next draw: Sunday</div>
                                </div>
                                <div class="p-4 bg-purple-50 rounded-lg">
                                    <div class="font-medium">Monthly Challenge</div>
                                    <div class="text-sm text-gray-600 mt-1">5 entries</div>
                                    <div class="mt-2 text-sm">Ends in 15 days</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Available Rewards</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="font-medium">Custom Theme</div>
                                        <div class="text-sm text-gray-600">Unlock app themes</div>
                                    </div>
                                    <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        200 points
                                    </button>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="font-medium">Extra Draw Entry</div>
                                        <div class="text-sm text-gray-600">1 bonus prize draw entry</div>
                                    </div>
                                    <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        150 points
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h4 class="text-lg font-semibold mb-4">Achievements</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="text-center p-3 bg-yellow-50 rounded-lg">
                                    <div class="text-2xl mb-1">🎯</div>
                                    <div class="font-medium">Goal Setter</div>
                                    <div class="text-sm text-gray-600">Set 5 goals</div>
                                </div>
                                <div class="text-center p-3 bg-green-50 rounded-lg">
                                    <div class="text-2xl mb-1">📚</div>
                                    <div class="font-medium">Quiz Master</div>
                                    <div class="text-sm text-gray-600">Perfect score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
        
        // Set the default content for the tab
        contentDiv.innerHTML = defaultContent[tabName] || '<p class="text-red-500">Content not available</p>';
        
        // Initialize tab-specific functionality
        if (tabName === 'habits') {
            // Add completion check listeners
            addCompletionCheckListeners();
        } else if (tabName === 'learning') {
            loadQuestion();
        } else if (tabName === 'rewards') {
            loadRewardsData();
        } else if (tabName === 'focus') {
            // Add completion check listeners for focus fields
            const focusFields = document.querySelectorAll('#focusForm input[required]');
            focusFields.forEach(field => {
                field.addEventListener('input', () => {
                    console.log(`Focus field ${field.id} changed`);
                    checkTaskCompletion('focus');
                });
                field.addEventListener('change', () => {
                    console.log(`Focus field ${field.id} changed`);
                    checkTaskCompletion('focus');
                });
            });
            // Initial check
            checkTaskCompletion('focus');
        } else if (tabName === 'wellness') {
            // Add completion check listeners for wellness fields
            const wellnessFields = document.querySelectorAll('#wellnessForm textarea[required]');
            wellnessFields.forEach(field => {
                field.addEventListener('input', () => {
                    console.log(`Wellness field ${field.id} changed`);
                    checkTaskCompletion('wellness');
                });
                field.addEventListener('change', () => {
                    console.log(`Wellness field ${field.id} changed`);
                    checkTaskCompletion('wellness');
                });
            });
            // Initial check
            checkTaskCompletion('wellness');
        } else if (tabName === 'social') {
            // Add completion check listeners for social fields
            const socialFields = document.querySelectorAll('#socialForm textarea[required]');
            socialFields.forEach(field => {
                field.addEventListener('input', () => {
                    console.log(`Social field ${field.id} changed`);
                    checkTaskCompletion('social');
                });
                field.addEventListener('change', () => {
                    console.log(`Social field ${field.id} changed`);
                    checkTaskCompletion('social');
                });
            });
            // Initial check
            checkTaskCompletion('social');
        }
        
        // Check initial completion status
        checkTaskCompletion(tabName);
        
    } catch (error) {
        console.error(`Error loading ${tabName} content:`, error);
        contentDiv.innerHTML = '<p class="text-red-500">Failed to load content. Please try again.</p>';
    }
}

// Function to check task completion
function checkTaskCompletion(tab) {
    console.log(`Checking completion for tab: ${tab}`);
    
    switch (tab) {
        case 'habits':
            const habitFields = document.querySelectorAll('#habitsForm input[required], #habitsForm select[required], #habitsForm textarea[required]');
            const allHabitsCompleted = Array.from(habitFields).every(field => {
                const value = field.value.trim();
                console.log(`Habit field ${field.id || field.name}: ${value}`);
                return value !== '';
            });
            taskCompletionStatus.habits = allHabitsCompleted;
            console.log('Habits completion:', allHabitsCompleted);
            break;
            
        case 'focus':
            const focusFields = document.querySelectorAll('#focusForm input[required]');
            console.log('Found focus fields:', focusFields.length);
            
            const allFocusCompleted = Array.from(focusFields).every(field => {
                const value = field.value.trim();
                console.log(`Focus field ${field.id}: value='${value}', length=${value.length}`);
                return value !== '';
            });
            
            console.log('Focus fields completion check:', allFocusCompleted);
            taskCompletionStatus.focus = allFocusCompleted;
            break;
            
        case 'wellness':
            const wellnessFields = document.querySelectorAll('#wellnessForm textarea[required]');
            console.log('Found wellness fields:', wellnessFields.length);
            
            const allWellnessCompleted = Array.from(wellnessFields).every(field => {
                const value = field.value.trim();
                console.log(`Wellness field ${field.id}: value='${value}', length=${value.length}`);
                return value !== '';
            });
            
            console.log('Wellness fields completion check:', allWellnessCompleted);
            taskCompletionStatus.wellness = allWellnessCompleted;
            break;
            
        case 'social':
            const socialFields = document.querySelectorAll('#socialForm textarea[required]');
            const allSocialCompleted = Array.from(socialFields).every(field => {
                const value = field.value.trim();
                console.log(`Social field ${field.id || field.name}: ${value}`);
                return value !== '';
            });
            taskCompletionStatus.social = allSocialCompleted;
            console.log('Social completion:', allSocialCompleted);
            break;
            
        case 'learning':
            taskCompletionStatus.learning = questionsAnswered >= TOTAL_QUESTIONS;
            console.log('Learning completion:', taskCompletionStatus.learning);
            break;
            
        case 'rewards':
            taskCompletionStatus.rewards = true; // Rewards tab is always considered complete
            console.log('Rewards completion: true');
            break;
    }
    
    // Update navigation buttons after any completion check
    updateNavigationButtons();
}

// Function to update navigation buttons
function updateNavigationButtons() {
    console.log('Updating navigation buttons');
    console.log('Current tab:', currentTab);
    console.log('Task completion status:', taskCompletionStatus);
    
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    // Check if buttons exist
    if (!prevButton || !nextButton) {
        console.error('Navigation buttons not found in DOM');
        return;
    }
    
    // Update tab order to include learning before wellness
    const tabs = ['habits', 'focus', 'learning', 'wellness', 'social', 'rewards'];
    const currentIndex = tabs.indexOf(currentTab);
    
    try {
        // Show/hide previous button
        if (currentIndex > 0) {
            prevButton.classList.remove('hidden');
            console.log('Showing previous button');
        } else {
            prevButton.classList.add('hidden');
            console.log('Hiding previous button');
        }
        
        // Show/hide next button based on task completion
        const isCurrentTabComplete = taskCompletionStatus[currentTab];
        const isNotLastTab = currentIndex < tabs.length - 1;
        
        console.log('Next button conditions:', {
            isCurrentTabComplete,
            isNotLastTab,
            shouldShow: isNotLastTab && isCurrentTabComplete
        });
        
        if (isNotLastTab && isCurrentTabComplete) {
            nextButton.classList.remove('hidden');
            console.log('Showing next button');
        } else {
            nextButton.classList.add('hidden');
            console.log('Hiding next button');
        }
        
        // Update button click handlers
        prevButton.onclick = () => {
            if (currentIndex > 0) {
                switchTab(tabs[currentIndex - 1]);
            }
        };
        
        nextButton.onclick = () => {
            if (currentIndex < tabs.length - 1 && taskCompletionStatus[currentTab]) {
                switchTab(tabs[currentIndex + 1]);
            }
        };
    } catch (error) {
        console.error('Error updating navigation buttons:', error);
    }
}

// Add event listeners for tab buttons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize task completion status
    taskCompletionStatus = {
        habits: false,
        focus: false,
        wellness: false,
        social: false,
        learning: false,
        rewards: false
    };
    
    // Initialize currentTab
    currentTab = 'habits';
    
    // Wait for a short delay to ensure all elements are rendered
    setTimeout(() => {
        initializeApp();
    }, 100);
});

// Function to initialize the application
function initializeApp() {
    console.log('Initializing app...');
    
    // Get required elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const contentDiv = document.getElementById('tabContent');
    const mainContent = document.getElementById('mainContent');
    
    // Check if main content is visible
    if (mainContent && mainContent.classList.contains('hidden')) {
        console.log('Main content is hidden, delaying initialization...');
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Verify all required elements exist
    if (!tabButtons.length || !prevButton || !nextButton || !contentDiv) {
        console.error('Required elements not found:', {
            tabButtons: tabButtons.length,
            prevButton: !!prevButton,
            nextButton: !!nextButton,
            contentDiv: !!contentDiv
        });
        // Retry initialization after a delay
        setTimeout(initializeApp, 100);
        return;
    }
    
    console.log('All required elements found, initializing...');
    
    // Add click handlers to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Tab button clicked:', button.dataset.tab);
            switchTab(button.dataset.tab);
        });
    });
    
    // Initialize navigation buttons
    updateNavigationButtons();
    
    // Load initial tab content
    loadTabContent('habits');
}

// Function to add completion check listeners to form fields
function addCompletionCheckListeners() {
    const tabs = ['habits', 'focus', 'wellness', 'social'];
    
    tabs.forEach(tab => {
        const formId = `${tab}Form`;
        const form = document.getElementById(formId);
        if (form) {
            const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
            fields.forEach(field => {
                field.addEventListener('input', () => {
                    console.log(`Field ${field.id || field.name} changed in ${tab} tab`);
                    checkTaskCompletion(tab);
                });
                field.addEventListener('change', () => {
                    console.log(`Field ${field.id || field.name} changed in ${tab} tab`);
                    checkTaskCompletion(tab);
                });
            });
        }
    });
}

// Function to load rewards data
async function loadRewardsData() {
    try {
        // For now, show static content
        document.getElementById('rewardsContent').innerHTML = `
            <h3 class="text-xl font-bold mb-4">Your Rewards</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h4 class="text-lg font-semibold mb-4">Points Summary</h4>
                    <div class="text-3xl font-bold text-blue-600 mb-2">100</div>
                    <p class="text-gray-600">Total points earned</p>
                    
                    <div class="mt-4">
                        <h5 class="font-medium mb-2">Recent Activity</h5>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Daily Tasks Completed</span>
                                <span class="text-blue-600">+50 points</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Quiz Score Bonus</span>
                                <span class="text-blue-600">+30 points</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Wellness Streak</span>
                                <span class="text-blue-600">+20 points</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h4 class="text-lg font-semibold mb-4">Prize Draw Entries</h4>
                    <div class="space-y-4">
                        <div class="p-4 bg-blue-50 rounded-lg">
                            <div class="font-medium">Weekly Prize Draw</div>
                            <div class="text-sm text-gray-600 mt-1">2 entries</div>
                            <div class="mt-2 text-sm">Next draw: Sunday</div>
                        </div>
                        <div class="p-4 bg-purple-50 rounded-lg">
                            <div class="font-medium">Monthly Challenge</div>
                            <div class="text-sm text-gray-600 mt-1">5 entries</div>
                            <div class="mt-2 text-sm">Ends in 15 days</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h4 class="text-lg font-semibold mb-4">Available Rewards</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium">Custom Theme</div>
                                <div class="text-sm text-gray-600">Unlock app themes</div>
                            </div>
                            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                200 points
                            </button>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium">Extra Draw Entry</div>
                                <div class="text-sm text-gray-600">1 bonus prize draw entry</div>
                            </div>
                            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                150 points
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h4 class="text-lg font-semibold mb-4">Achievements</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-3 bg-yellow-50 rounded-lg">
                            <div class="text-2xl mb-1">🎯</div>
                            <div class="font-medium">Goal Setter</div>
                            <div class="text-sm text-gray-600">Set 5 goals</div>
                        </div>
                        <div class="text-center p-3 bg-green-50 rounded-lg">
                            <div class="text-2xl mb-1">📚</div>
                            <div class="font-medium">Quiz Master</div>
                            <div class="text-sm text-gray-600">Perfect score</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Mark rewards tab as complete
        taskCompletionStatus.rewards = true;
        updateNavigationButtons();
        
    } catch (error) {
        console.error('Error loading rewards data:', error);
        document.getElementById('rewardsContent').innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Failed to load rewards data. Please try refreshing the page.</p>
            </div>
        `;
    }
} 