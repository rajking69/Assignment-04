
// Global state for job tracking - stores job data for filtered views
let interviewCount = []; 
let rejectedCount = [];  

// DOM element references - cached for performance
const mainContainer = document.querySelector('[data-section="positions-container"]');    
const interviewSection = document.querySelector('[data-filter-section="interview"]');   
const rejectedSection = document.querySelector('[data-filter-section="rejected"]');     

// Filter button references for active state management
const filterAllBtn = document.querySelector('[data-filter="all"]');
const filterInterviewBtn = document.querySelector('[data-filter="interview"]'); 
const filterRejectedBtn = document.querySelector('[data-filter="rejected"]');

// Counter display elements for real-time updates
const interviewCountValue = document.querySelector('[data-counter="interview"]');  
const rejectedCountValue = document.querySelector('[data-counter="rejected"]');   
const totalCountValue = document.querySelector('[data-counter="total"]');         
const jobsCountDisplay = document.querySelector('.jobs-count');                   

// Initialize total count display with actual number of job cards in DOM
const jobList = document.querySelector('[data-section="positions-container"] .positions-grid').childElementCount;
totalCountValue.textContent = jobList;

// Function to render interview jobs in filtered view
function updateScreen_Interview(jobData) {
    interviewSection.innerHTML = ""; 

    // Show empty state if no interview jobs
    if (jobData.length === 0) {
        interviewSection.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16">
                <img src="assets/word.png" alt="No jobs" class="w-16 h-16 mb-4 opacity-50">
                <h3 class="text-lg font-semibold text-neutral mb-2">No jobs available</h3>
                <p class="text-sm text-gray-500">Check back soon for new job opportunities</p>
            </div>
        `;
        return;
    }

    for (let job of jobData) {
        interviewSection.innerHTML += `
            <article class="position-card border-l-4 border-green-500 bg-base-100 rounded-lg shadow p-6 relative" 
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
                    <span class="position-status badge badge-outline text-green-600 border-green-600 text-xs">${job.status.toUpperCase()}</span>
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
}

