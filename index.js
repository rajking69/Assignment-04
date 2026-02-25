
// Global state for job tracking
let interviewCount = [];
let rejectedCount = [];

// DOM element references
const mainContainer = document.querySelector('[data-section="positions-container"]');
const interviewSection = document.querySelector('[data-filter-section="interview"]');
const rejectedSection = document.querySelector('[data-filter-section="rejected"]');

// Filter button references
const filterAllBtn = document.querySelector('[data-filter="all"]');
const filterInterviewBtn = document.querySelector('[data-filter="interview"]');
const filterRejectedBtn = document.querySelector('[data-filter="rejected"]');

// Counter display elements
const interviewCountValue = document.querySelector('[data-counter="interview"]');
const rejectedCountValue = document.querySelector('[data-counter="rejected"]');
const totalCountValue = document.querySelector('[data-counter="total"]');
const jobsCountDisplay = document.querySelector('.jobs-count');

const jobList = document.querySelector('[data-section="positions-container"] .positions-grid').childElementCount;
totalCountValue.textContent = jobList;

// Utility functions
const JobUtils = {
    findJobIndex(jobArray, companyName) {
        return jobArray.findIndex(job => job.company === companyName);
    },

    removeJobByCompany(jobArray, companyName) {
        const index = this.findJobIndex(jobArray, companyName);
        if (index !== -1) {
            jobArray.splice(index, 1);
        }
    },

    extractJobData(positionCard) {
        return {
            company: positionCard.querySelector('.organization-name').innerText,
            title: positionCard.querySelector('.position-title').innerText,
            details: positionCard.querySelector('.position-details').innerText,
            description: positionCard.querySelector('.position-description').innerText,
            status: 'Interview'
        };
    },

    updateCounts() {
        interviewCountValue.textContent = interviewCount.length;
        rejectedCountValue.textContent = rejectedCount.length;
        const totalJobs = document.querySelector('[data-section="positions-container"] .positions-grid').childElementCount;
        totalCountValue.textContent = totalJobs;
        return totalJobs;
    },

    updateMainContainerStatus(companyName, statusType) {
        const statusConfig = {
            interview: {
                text: 'INTERVIEW',
                badgeClass: 'position-status badge badge-outline text-green-600 border-green-600 text-xs',
                borderClass: 'border-green-500',
                removeClass: 'border-red-500'
            },
            rejected: {
                text: 'REJECTED',
                badgeClass: 'position-status badge badge-outline text-red-600 border-red-600 text-xs',
                borderClass: 'border-red-500',
                removeClass: 'border-green-500'
            }
        };

        const config = statusConfig[statusType];
        if (!config) return;

        const cards = mainContainer.querySelectorAll('.position-card');
        cards.forEach(card => {
            const cardCompany = card.querySelector('.organization-name')?.innerText;
            if (cardCompany === companyName) {
                const badge = card.querySelector('.position-status');
                badge.innerText = config.text;
                badge.className = config.badgeClass;
                card.classList.add('border-l-4', config.borderClass);
                card.classList.remove(config.removeClass);
            }
        });
    }
};

const TemplateGenerator = {
    createEmptyState() {
        return `
            <div class="flex flex-col items-center justify-center py-16">
                <img src="assets/word.png" alt="No jobs" class="w-16 h-16 mb-4 opacity-50">
                <h3 class="text-lg font-semibold text-neutral mb-2">No jobs available</h3>
                <p class="text-sm text-gray-500">Check back soon for new job opportunities</p>
            </div>
        `;
    },

    createJobCard(job, borderColor, statusColor) {
        return `
            <article class="position-card border-l-4 ${borderColor} bg-base-100 rounded-lg shadow p-6 relative" 
                     data-status="${job.status.toLowerCase()}" 
                     data-position-id="${job.id || ''}">
                <button class="position-action remove-action absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        data-action="delete"
                        aria-label="Delete job application">
                    <img src="assets/delete.png" alt="Delete" class="h-5 w-5">
                </button>
                
                <header class="position-header">
                    <h3 class="organization-name text-lg font-bold text-neutral">${job.company}</h3>
                    <p class="position-title text-sm text-gray-600">${job.title}</p>
                    <p class="position-details text-xs text-gray-500 mt-1">${job.details}</p>
                </header>
                
                <div class="position-status-container mt-3">
                    <span class="position-status badge badge-outline ${statusColor} text-xs">${job.status.toUpperCase()}</span>
                </div>
                
                <div class="position-description text-sm text-gray-700 mt-3">
                    ${job.description}
                </div>
                
                <footer class="position-actions flex gap-2 mt-4">
                    <button class="position-action interview-action btn btn-sm btn-outline border-green-500 text-green-600 hover:bg-green-50"
                            data-action="interview">
                        INTERVIEW
                    </button>
                    <button class="position-action rejected-action btn btn-sm btn-outline border-red-500 text-red-600 hover:bg-red-50"
                            data-action="rejected">
                        REJECTED
                    </button>
                </footer>
            </article>
        `;
    }
};

// Function to render interview jobs in filtered view
function updateScreen_Interview(jobData) {
    if (jobData.length === 0) {
        interviewSection.innerHTML = TemplateGenerator.createEmptyState();
        return;
    }

    interviewSection.innerHTML = jobData
        .map(job => TemplateGenerator.createJobCard(job, 'border-green-500', 'text-green-600 border-green-600'))
        .join('');
}

// Function to render rejected jobs in filtered view
function updateScreen_Rejected(jobData) {
    if (jobData.length === 0) {
        rejectedSection.innerHTML = TemplateGenerator.createEmptyState();
        return;
    }

    rejectedSection.innerHTML = jobData
        .map(job => TemplateGenerator.createJobCard(job, 'border-red-500', 'text-red-600 border-red-600'))
        .join('');
}

const EventHandlers = {
    handleDelete(positionCard) {
        const companyName = positionCard.querySelector('.organization-name').innerText;

        JobUtils.removeJobByCompany(interviewCount, companyName);
        JobUtils.removeJobByCompany(rejectedCount, companyName);

        const allPositionCards = mainContainer.querySelectorAll('.position-card');
        allPositionCards.forEach(card => {
            const cardCompany = card.querySelector('.organization-name')?.innerText;
            if (cardCompany === companyName) {
                card.remove();
            }
        });

        const totalJobs = JobUtils.updateCounts();
        positionCard.remove();
        updateScreen_Interview(interviewCount);
        updateScreen_Rejected(rejectedCount);
        jobsCountDisplay.textContent = `${totalJobs}`;
    },

    handleInterview(positionCard) {
        const jobInfo = JobUtils.extractJobData(positionCard);
        const companyName = jobInfo.company;

        JobUtils.removeJobByCompany(rejectedCount, companyName);

        if (JobUtils.findJobIndex(interviewCount, companyName) === -1) {
            interviewCount.push(jobInfo);
        }

        JobUtils.updateCounts();
        updateScreen_Interview(interviewCount);
        JobUtils.updateMainContainerStatus(companyName, 'interview');
    },

    handleRejected(positionCard) {
        const jobInfo = JobUtils.extractJobData(positionCard);
        jobInfo.status = 'Rejected';
        const companyName = jobInfo.company;

        JobUtils.removeJobByCompany(interviewCount, companyName);

        if (JobUtils.findJobIndex(rejectedCount, companyName) === -1) {
            rejectedCount.push(jobInfo);
        }

        JobUtils.updateCounts();
        updateScreen_Rejected(rejectedCount);
        JobUtils.updateMainContainerStatus(companyName, 'rejected');
    }
};

// Main event handler using event delegation for all button clicks
document.addEventListener('click', function (event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const positionCard = btn.closest('.position-card');
    if (!positionCard) return;

    const action = btn.getAttribute('data-action');
    const actionHandlers = {
        delete: EventHandlers.handleDelete,
        interview: EventHandlers.handleInterview,
        rejected: EventHandlers.handleRejected
    };

    const handler = actionHandlers[action];
    if (handler) {
        handler(positionCard);
    }
});

const FilterManager = {
    updateButtonStyles(activeId) {
        const buttons = { all: filterAllBtn, interview: filterInterviewBtn, rejected: filterRejectedBtn };
        
        Object.entries(buttons).forEach(([key, button]) => {
            if (key === activeId) {
                button.classList.remove('btn-outline');
                button.classList.add('btn-primary');
            } else {
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline');
            }
        });
    },

    updateSectionVisibility(showMain, showInterview, showRejected) {
        interviewSection.style.display = showInterview ? 'block' : 'none';
        rejectedSection.style.display = showRejected ? 'block' : 'none';
        mainContainer.style.display = showMain ? 'block' : 'none';
    },

    updateJobCountDisplay(count, total) {
        const text = total !== undefined 
            ? `${count} out of ${total} jobs`
            : `${count} jobs`;
        jobsCountDisplay.textContent = text;
    }
};

// Filter function called from HTML onclick
function setActiveButton(id) {
    const totalJobs = document.querySelector('[data-section="positions-container"] .positions-grid').childElementCount;

    if (id === 'filter-all') {
        filterAllBtn.style.backgroundColor = '#3b82f6';
        filterAllBtn.style.color = 'white';
        filterAllBtn.style.borderColor = '#3b82f6';
        
        filterInterviewBtn.style.backgroundColor = 'transparent';
        filterInterviewBtn.style.color = '#3b82f6';
        filterInterviewBtn.style.borderColor = '#3b82f6';
        
        filterRejectedBtn.style.backgroundColor = 'transparent';
        filterRejectedBtn.style.color = '#3b82f6';
        filterRejectedBtn.style.borderColor = '#3b82f6';

        interviewSection.style.display = 'none';
        rejectedSection.style.display = 'none';
        mainContainer.style.display = 'block';

        jobsCountDisplay.textContent = `${totalJobs}`;
    }
    else if (id === 'filter-interview') {
        filterInterviewBtn.style.backgroundColor = '#10b981';
        filterInterviewBtn.style.color = 'white';
        filterInterviewBtn.style.borderColor = '#10b981';
        
        filterAllBtn.style.backgroundColor = 'transparent';
        filterAllBtn.style.color = '#3b82f6';
        filterAllBtn.style.borderColor = '#3b82f6';
        
        filterRejectedBtn.style.backgroundColor = 'transparent';
        filterRejectedBtn.style.color = '#3b82f6';
        filterRejectedBtn.style.borderColor = '#3b82f6';

        interviewSection.style.display = 'block';
        rejectedSection.style.display = 'none';
        mainContainer.style.display = 'none';
        updateScreen_Interview(interviewCount);

        const count = interviewCount.length;
        jobsCountDisplay.textContent = `${count} out of ${totalJobs}`;
    }
    else if (id === 'filter-rejected') {
        filterRejectedBtn.style.backgroundColor = '#ef4444';
        filterRejectedBtn.style.color = 'white';
        filterRejectedBtn.style.borderColor = '#ef4444';
        
        filterAllBtn.style.backgroundColor = 'transparent';
        filterAllBtn.style.color = '#3b82f6';
        filterAllBtn.style.borderColor = '#3b82f6';
        
        filterInterviewBtn.style.backgroundColor = 'transparent';
        filterInterviewBtn.style.color = '#3b82f6';
        filterInterviewBtn.style.borderColor = '#3b82f6';

        rejectedSection.style.display = 'block';
        interviewSection.style.display = 'none';
        mainContainer.style.display = 'none';
        updateScreen_Rejected(rejectedCount);

        const count = rejectedCount.length;
        jobsCountDisplay.textContent = `${count} out of ${totalJobs}`;
    }
}