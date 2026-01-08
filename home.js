// ============================================
// HOME PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // Bootstrap Form Validation
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();

                // Newsletter Form Handler
                if (form.id === 'newsletterForm') {
                    const fullName = document.getElementById('fullName').value;
                    const email = document.getElementById('email').value;
                    const interest = document.getElementById('interest').value;

                    // Show Bootstrap toast notification
                    const toast = new bootstrap.Toast(document.getElementById('successToast'));
                    toast.show();

                    // Clear form
                    form.reset();
                    form.classList.remove('was-validated');
                }
            }

            form.classList.add('was-validated');
        }, false);
    });

    // Package Card Click
    document.querySelectorAll('.package-item').forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('btn') && !e.target.closest('a')) {
                const packageName = this.querySelector('.card-title').textContent;
                console.log(`Clicked: ${packageName}`);
            }
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Calendar & Trip Planning Logic
    const calendarGrid = document.getElementById('calendarGrid');
    if (calendarGrid) {
        let currentDate = new Date();
        // Set to a fixed near-future date for demo purposes if desired, or just use today
        // currentDate.setMonth(currentDate.getMonth() + 1); 

        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Render Initial Calendar
        renderCalendar(currentMonth, currentYear);

        // Event Listeners for Month Nav
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });

        function renderCalendar(month, year) {
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            document.getElementById('currentMonthYear').textContent = `${monthNames[month]} ${year}`;

            let html = '';

            // Empty cells for previous month days
            for (let i = 0; i < firstDay; i++) {
                html += `<div class="calendar-day empty"></div>`;
            }

            // Days
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const dayOfWeek = date.getDay(); // 0 is Sunday

                // Simulate seasonality
                let seasonClass = '';
                // Low season: May (4) to Sept (8) roughly in some areas, or maybe Nov-Feb
                // Let's just make random logic for demo visual
                // Peak: Weekends (Fri/Sat) or specific months like March/April

                if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri, Sat
                    seasonClass = 'peak-season';
                } else if (month >= 4 && month <= 8) {
                    seasonClass = 'low-season';
                }

                html += `
                    <div class="calendar-day ${isToday ? 'today' : ''} ${seasonClass}" onclick="selectDate(this, ${day}, ${month}, ${year}, '${seasonClass}')">
                        ${day}
                    </div>
                `;
            }

            calendarGrid.innerHTML = html;
        }
    }
});

// Select Date Handler (Global or scoped, but making it accessible)
function selectDate(element, day, month, year, seasonClass) {
    // UI Update
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Show Info Panel
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('dateInfoPlaceholder').classList.add('d-none');

    const contentPanel = document.getElementById('dateInfoContent');
    contentPanel.classList.remove('d-none');
    contentPanel.style.opacity = '0';
    setTimeout(() => {
        contentPanel.style.transition = 'opacity 0.3s ease';
        contentPanel.style.opacity = '1';
    }, 10);

    // Update Content
    document.getElementById('selectedDateDisplay').textContent = `${monthNames[month]} ${day}, ${year}`;

    const badge = document.getElementById('seasonBadge');
    if (seasonClass.includes('peak-season')) {
        badge.className = 'badge bg-warning text-dark mb-4';
        badge.textContent = 'High Demand - Book Early!';
    } else if (seasonClass.includes('low-season')) {
        badge.className = 'badge bg-success mb-4';
        badge.textContent = 'Peaceful & Quiet - Best Rates';
    } else {
        badge.className = 'badge bg-info text-white mb-4';
        badge.textContent = 'Good Travel Conditions';
    }
}

// Create and show Bootstrap toast
function createToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }

    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
    });
}