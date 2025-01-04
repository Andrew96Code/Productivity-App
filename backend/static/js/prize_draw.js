// Prize Draw functionality
async function loadPrizeDraws() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/prize-draw/entries?user_id=${currentUser.id}`);
        const data = await response.json();
        
        // Only proceed if we're on the rewards tab
        const rewardsTab = document.getElementById('rewards');
        if (!rewardsTab || rewardsTab.classList.contains('hidden')) {
            return;
        }
        
        if (data.entries) {
            const drawsList = document.getElementById('entriesTimeline');
            if (drawsList) {
                drawsList.innerHTML = data.entries.map(entry => `
                    <div class="flex items-center space-x-4">
                        <div class="w-2 h-2 rounded-full ${getTimelineDotColor(entry.time_period)}"></div>
                        <div class="flex-1">
                            <p class="text-sm font-semibold">${formatTimePeriod(entry.time_period)}</p>
                            <p class="text-xs text-gray-500">${formatDate(entry.created_at)}</p>
                        </div>
                    </div>
                `).join('');
            }

            // Update entry counts if elements exist
            const morningElement = document.getElementById('morningEntries');
            const afternoonElement = document.getElementById('afternoonEntries');
            const eveningElement = document.getElementById('eveningEntries');
            
            if (morningElement) morningElement.textContent = data.summary?.morning || 0;
            if (afternoonElement) afternoonElement.textContent = data.summary?.afternoon || 0;
            if (eveningElement) eveningElement.textContent = data.summary?.evening || 0;
        }
    } catch (error) {
        console.error('Error loading prize draws:', error);
    }
}

function getTimelineDotColor(period) {
    const colors = {
        morning: 'bg-yellow-500',
        afternoon: 'bg-blue-500',
        evening: 'bg-purple-500'
    };
    return colors[period] || 'bg-gray-500';
}

function formatTimePeriod(period) {
    return period.charAt(0).toUpperCase() + period.slice(1) + ' Tasks Completed';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Only initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a short moment to ensure auth state is loaded
    setTimeout(loadPrizeDraws, 1000);
    
    // Add listener for tab changes
    const rewardsTab = document.querySelector('[data-tab="rewards"]');
    if (rewardsTab) {
        rewardsTab.addEventListener('click', loadPrizeDraws);
    }
}); 