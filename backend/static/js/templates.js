// Define templates for each tab
console.log('Initializing templates...');

// Make sure window.templates is defined
window.templates = {
    habits: `
        <div id="habitsForm" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Daily Habits & Goals</h3>
            <div class="morning-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Morning Planning</h4>
                    <div class="space-y-4">
                        <div>
                            <label for="morningMood" class="block text-gray-700 font-medium mb-2">How are you feeling this morning?</label>
                            <textarea id="morningMood" name="morningMood" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="mainFocus" class="block text-gray-700 font-medium mb-2">What is your main focus for today?</label>
                            <textarea id="mainFocus" name="mainFocus" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Daily Habits to Build</label>
                            <div class="space-y-3">
                                <div class="flex items-center space-x-2">
                                    <input type="text" id="habit1" name="habit1" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                    <input type="checkbox" id="habit1_completed" class="w-4 h-4">
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="text" id="habit2" name="habit2" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                    <input type="checkbox" id="habit2_completed" class="w-4 h-4">
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input type="text" id="habit3" name="habit3" class="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter a habit..." required>
                                    <input type="checkbox" id="habit3_completed" class="w-4 h-4">
                                </div>
                            </div>
                        </div>
                        <div>
                            <label for="morningNotes" class="block text-gray-700 font-medium mb-2">Additional Notes</label>
                            <textarea id="morningNotes" name="morningNotes" class="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="afternoon-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Afternoon Check-in</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Morning Progress Review</h5>
                            <div id="morningProgressReview" class="space-y-2">
                                <!-- Morning habits and main focus will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="progressCheck" class="block text-gray-700 font-medium mb-2">How's your progress on today's main focus?</label>
                            <textarea id="progressCheck" name="progressCheck" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="focusLevel" class="block text-gray-700 font-medium mb-2">Current Focus Level</label>
                            <select id="focusLevel" name="focusLevel" class="w-full px-3 py-2 border rounded-lg" required>
                                <option value="">Select your focus level...</option>
                                <option value="high">High - In the zone</option>
                                <option value="moderate">Moderate - Maintaining focus</option>
                                <option value="low">Low - Need to refocus</option>
                            </select>
                        </div>
                        <div>
                            <label for="focusStrategy" class="block text-gray-700 font-medium mb-2">What would help you stay focused for the rest of the day?</label>
                            <textarea id="focusStrategy" name="focusStrategy" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evening-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Evening Review</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Daily Summary</h5>
                            <div id="morningRoutineReview" class="mb-4">
                                <h6 class="font-medium text-gray-700">Morning Routine</h6>
                                <!-- Morning routine summary will be displayed here -->
                            </div>
                            <div id="afternoonCheckInReview" class="mb-4">
                                <h6 class="font-medium text-gray-700">Afternoon Check-in</h6>
                                <!-- Afternoon check-in summary will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="eveningMood" class="block text-gray-700 font-medium mb-2">How are you feeling after today?</label>
                            <textarea id="eveningMood" name="eveningMood" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="achievements" class="block text-gray-700 font-medium mb-2">What did you achieve today?</label>
                            <textarea id="achievements" name="achievements" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="challenges" class="block text-gray-700 font-medium mb-2">What challenges did you face?</label>
                            <textarea id="challenges" name="challenges" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="tomorrowPrep" class="block text-gray-700 font-medium mb-2">What can you prepare for tomorrow?</label>
                            <textarea id="tomorrowPrep" name="tomorrowPrep" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    focus: `
        <div id="focusForm" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Focus & Time Management</h3>
            <div class="morning-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Morning Focus Planning</h4>
                    <div class="space-y-4">
                        <div>
                            <label for="morningPriorities" class="block text-gray-700 font-medium mb-2">Top 3 Priorities for Today</label>
                            <textarea id="morningPriorities" name="morningPriorities" class="w-full px-3 py-2 border rounded-lg" rows="3" required></textarea>
                        </div>
                        <div>
                            <label for="morningFocusStrategy" class="block text-gray-700 font-medium mb-2">Focus Strategy</label>
                            <select id="morningFocusStrategy" name="morningFocusStrategy" class="w-full px-3 py-2 border rounded-lg" required>
                                <option value="">Select a strategy...</option>
                                <option value="pomodoro">Pomodoro (25/5)</option>
                                <option value="deep">Deep Work (90 min)</option>
                                <option value="time-blocking">Time Blocking</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="afternoon-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Afternoon Focus Check-in</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Morning Priorities Review</h5>
                            <div id="morningPrioritiesReview" class="space-y-2">
                                <!-- Morning priorities will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="focusProgress" class="block text-gray-700 font-medium mb-2">Progress on Priorities</label>
                            <textarea id="focusProgress" name="focusProgress" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="afternoonFocusStrategy" class="block text-gray-700 font-medium mb-2">Adjust Focus Strategy</label>
                            <select id="afternoonFocusStrategy" name="afternoonFocusStrategy" class="w-full px-3 py-2 border rounded-lg" required>
                                <option value="">Select a strategy...</option>
                                <option value="pomodoro">Pomodoro (25/5)</option>
                                <option value="deep">Deep Work (90 min)</option>
                                <option value="time-blocking">Time Blocking</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evening-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Evening Focus Review</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Daily Focus Summary</h5>
                            <div id="focusSummary" class="space-y-2">
                                <!-- Focus summary will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="focusReflection" class="block text-gray-700 font-medium mb-2">Focus Reflection</label>
                            <textarea id="focusReflection" name="focusReflection" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="tomorrowFocusPrep" class="block text-gray-700 font-medium mb-2">Focus Strategy for Tomorrow</label>
                            <textarea id="tomorrowFocusPrep" name="tomorrowFocusPrep" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    learning: `
        <div id="learningForm" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Daily Learning</h3>
            <div class="morning-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Morning Learning Plan</h4>
                    <div class="space-y-4">
                        <div>
                            <label for="morningLearningGoal" class="block text-gray-700 font-medium mb-2">Today's Learning Goals</label>
                            <textarea id="morningLearningGoal" name="morningLearningGoal" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="morningLearningMethod" class="block text-gray-700 font-medium mb-2">Planned Learning Method</label>
                            <select id="morningLearningMethod" name="morningLearningMethod" class="w-full px-3 py-2 border rounded-lg" required>
                                <option value="">Choose a method...</option>
                                <option value="reading">Reading & Research</option>
                                <option value="video">Video Tutorials</option>
                                <option value="practice">Hands-on Practice</option>
                                <option value="teaching">Teaching Others</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="afternoon-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Afternoon Learning Check-in</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Morning Learning Review</h5>
                            <div id="morningLearningReview" class="space-y-2">
                                <!-- Morning learning goals will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="learningProgress" class="block text-gray-700 font-medium mb-2">Progress on Learning Goals</label>
                            <textarea id="learningProgress" name="learningProgress" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="learningChallenges" class="block text-gray-700 font-medium mb-2">Current Learning Challenges</label>
                            <textarea id="learningChallenges" name="learningChallenges" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evening-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Evening Learning Review</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Daily Learning Summary</h5>
                            <div id="learningSummary" class="space-y-2">
                                <!-- Learning summary will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="learningReflection" class="block text-gray-700 font-medium mb-2">Key Learnings Today</label>
                            <textarea id="learningReflection" name="learningReflection" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="tomorrowLearningPrep" class="block text-gray-700 font-medium mb-2">Tomorrow's Learning Plan</label>
                            <textarea id="tomorrowLearningPrep" name="tomorrowLearningPrep" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    wellness: `
        <div id="wellnessForm" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Wellness Tracking</h3>
            <div class="morning-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Morning Wellness Check</h4>
                    <div class="space-y-4">
                        <div>
                            <label for="morningMoodLevel" class="block text-gray-700 font-medium mb-2">Morning Mood (1-10)</label>
                            <input type="number" id="morningMoodLevel" name="morningMoodLevel" min="1" max="10" class="w-full px-3 py-2 border rounded-lg" required>
                        </div>
                        <div>
                            <label for="morningEnergyLevel" class="block text-gray-700 font-medium mb-2">Morning Energy Level</label>
                            <select id="morningEnergyLevel" name="morningEnergyLevel" class="w-full px-3 py-2 border rounded-lg" required>
                                <option value="">Rate your energy...</option>
                                <option value="high">High</option>
                                <option value="moderate">Moderate</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label for="morningWellnessGoals" class="block text-gray-700 font-medium mb-2">Wellness Goals for Today</label>
                            <textarea id="morningWellnessGoals" name="morningWellnessGoals" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="afternoon-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Afternoon Wellness Check-in</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Morning Wellness Review</h5>
                            <div id="morningWellnessReview" class="space-y-2">
                                <!-- Morning wellness data will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="afternoonMoodLevel" class="block text-gray-700 font-medium mb-2">Current Mood (1-10)</label>
                            <input type="number" id="afternoonMoodLevel" name="afternoonMoodLevel" min="1" max="10" class="w-full px-3 py-2 border rounded-lg" required>
                        </div>
                        <div>
                            <label for="wellnessProgress" class="block text-gray-700 font-medium mb-2">Progress on Wellness Goals</label>
                            <textarea id="wellnessProgress" name="wellnessProgress" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evening-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Evening Wellness Review</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Daily Wellness Summary</h5>
                            <div id="wellnessSummary" class="space-y-2">
                                <!-- Wellness summary will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="eveningMoodLevel" class="block text-gray-700 font-medium mb-2">Evening Mood (1-10)</label>
                            <input type="number" id="eveningMoodLevel" name="eveningMoodLevel" min="1" max="10" class="w-full px-3 py-2 border rounded-lg" required>
                        </div>
                        <div>
                            <label for="wellnessReflection" class="block text-gray-700 font-medium mb-2">Wellness Reflection</label>
                            <textarea id="wellnessReflection" name="wellnessReflection" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="tomorrowWellnessPrep" class="block text-gray-700 font-medium mb-2">Tomorrow's Wellness Plan</label>
                            <textarea id="tomorrowWellnessPrep" name="tomorrowWellnessPrep" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    social: `
        <div id="socialForm" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Social Connections</h3>
            <div class="morning-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Morning Social Planning</h4>
                    <div class="space-y-4">
                        <div>
                            <label for="morningSocialGoals" class="block text-gray-700 font-medium mb-2">Today's Connection Goals</label>
                            <textarea id="morningSocialGoals" name="morningSocialGoals" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="plannedInteractions" class="block text-gray-700 font-medium mb-2">Planned Interactions</label>
                            <textarea id="plannedInteractions" name="plannedInteractions" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="afternoon-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Afternoon Social Check-in</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Morning Social Review</h5>
                            <div id="morningSocialReview" class="space-y-2">
                                <!-- Morning social goals will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="socialProgress" class="block text-gray-700 font-medium mb-2">Progress on Connections</label>
                            <textarea id="socialProgress" name="socialProgress" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="remainingInteractions" class="block text-gray-700 font-medium mb-2">Remaining Planned Interactions</label>
                            <textarea id="remainingInteractions" name="remainingInteractions" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evening-content">
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 class="text-lg font-semibold mb-4">Evening Social Review</h4>
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-medium mb-3">Daily Social Summary</h5>
                            <div id="socialSummary" class="space-y-2">
                                <!-- Social summary will be displayed here -->
                            </div>
                        </div>
                        <div>
                            <label for="socialReflection" class="block text-gray-700 font-medium mb-2">Connection Reflection</label>
                            <textarea id="socialReflection" name="socialReflection" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                        <div>
                            <label for="tomorrowSocialPrep" class="block text-gray-700 font-medium mb-2">Tomorrow's Connection Plan</label>
                            <textarea id="tomorrowSocialPrep" name="tomorrowSocialPrep" class="w-full px-3 py-2 border rounded-lg" rows="2" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    rewards: `
        <div id="rewardsContent" class="space-y-6">
            <h3 class="text-xl font-bold mb-4">Rewards & Achievements</h3>
            <div class="bg-white p-6 rounded-lg shadow mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold">Your Points</h4>
                    <span class="text-2xl font-bold text-blue-600" id="pointsDisplay">0</span>
                </div>
                <div class="space-y-4">
                    <div id="achievementsList">
                        <!-- Achievements will be loaded here -->
                    </div>
                    <div id="prizeDraws">
                        <!-- Prize draw entries will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `,
    
    admin: `
        <div class="space-y-8">
            <h3 class="text-xl font-bold mb-4">Admin Dashboard</h3>
            
            <!-- Time Period Preview Controls -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="text-lg font-semibold mb-4">Time Period Preview</h4>
                <div class="space-y-4">
                    <div class="flex space-x-4">
                        <button onclick="previewTimePeriod('morning')" class="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            Preview Morning View
                        </button>
                        <button onclick="previewTimePeriod('afternoon')" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Preview Afternoon View
                        </button>
                        <button onclick="previewTimePeriod('evening')" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                            </svg>
                            Preview Evening View
                        </button>
                    </div>
                    <div id="timePeriodPreview" class="mt-4 p-4 border rounded-lg">
                        <p class="text-gray-500 text-center">Click a button above to preview that time period's view</p>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h5 class="text-sm font-medium text-gray-500 mb-1">Total Users</h5>
                    <div class="flex items-center justify-between">
                        <span id="totalUsers" class="text-2xl font-bold">0</span>
                        <span id="userGrowth" class="text-sm text-green-600">+0%</span>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h5 class="text-sm font-medium text-gray-500 mb-1">Active Users</h5>
                    <div class="flex items-center justify-between">
                        <span id="activeUsers" class="text-2xl font-bold">0</span>
                        <span id="activePercentage" class="text-sm text-blue-600">0%</span>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h5 class="text-sm font-medium text-gray-500 mb-1">Tasks Completed</h5>
                    <div class="flex items-center justify-between">
                        <span id="completedTasks" class="text-2xl font-bold">0</span>
                        <span id="taskCompletion" class="text-sm text-green-600">0 avg</span>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h5 class="text-sm font-medium text-gray-500 mb-1">Total Points</h5>
                    <div class="flex items-center justify-between">
                        <span id="totalPoints" class="text-2xl font-bold">0</span>
                        <span id="avgPointsPerUser" class="text-sm text-purple-600">0 avg</span>
                    </div>
                </div>
            </div>

            <!-- User Management -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold">User Management</h4>
                    <div class="flex space-x-2">
                        <input type="text" placeholder="Search users..." class="px-3 py-1 border rounded-lg">
                        <button class="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            Export Data
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left py-3">User</th>
                                <th class="text-left py-3">Status</th>
                                <th class="text-left py-3">Points</th>
                                <th class="text-left py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="userTableBody">
                            <!-- User rows will be populated here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Prize Draw Management -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold">Prize Draw Management</h4>
                    <button class="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                        Add New Draw
                    </button>
                </div>
                <div id="prizeDrawList" class="space-y-4">
                    <!-- Prize draws will be populated here -->
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="text-lg font-semibold mb-4">Recent Activity</h4>
                <div id="recentActivity" class="space-y-4">
                    <!-- Activity items will be populated here -->
                </div>
            </div>
        </div>
    `,
    
    schedule: `
        <div class="space-y-8">
            <h3 class="text-xl font-bold mb-4">Daily Schedule Preview</h3>
            
            <!-- Morning Preview -->
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div class="flex items-center mb-4">
                    <svg class="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <h4 class="text-lg font-semibold">Morning Routine (5 AM - 11 AM)</h4>
                </div>
                <div class="ml-8 space-y-2">
                    <p class="text-gray-600">• Set your daily intentions and mood</p>
                    <p class="text-gray-600">• Plan your main focus for the day</p>
                    <p class="text-gray-600">• Review and set up daily habits</p>
                    <p class="text-gray-600">• Organize your focus sessions</p>
                </div>
            </div>
            
            <!-- Afternoon Preview -->
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div class="flex items-center mb-4">
                    <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h4 class="text-lg font-semibold">Afternoon Check-in (11 AM - 5 PM)</h4>
                </div>
                <div class="ml-8 space-y-2">
                    <p class="text-gray-600">• Track progress on daily goals</p>
                    <p class="text-gray-600">• Update wellness metrics</p>
                    <p class="text-gray-600">• Log learning achievements</p>
                    <p class="text-gray-600">• Check team challenges and social connections</p>
                </div>
            </div>
            
            <!-- Evening Preview -->
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div class="flex items-center mb-4">
                    <svg class="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <h4 class="text-lg font-semibold">Evening Review (5 PM - 11 PM)</h4>
                </div>
                <div class="ml-8 space-y-2">
                    <p class="text-gray-600">• Reflect on daily achievements</p>
                    <p class="text-gray-600">• Complete habit tracking</p>
                    <p class="text-gray-600">• Review points and rewards</p>
                    <p class="text-gray-600">• Plan for tomorrow</p>
                </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg mt-6">
                <p class="text-sm text-blue-600">
                    <strong>Note:</strong> The app automatically adjusts to show the relevant content based on the time of day.
                    You can always access any section manually through the tabs above.
                </p>
            </div>
        </div>
    `
};

// Log available templates
console.log('Templates initialized with keys:', Object.keys(window.templates));

// Add a check to verify templates are loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Verifying templates after DOM load:', Object.keys(window.templates));
}); 