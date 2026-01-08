// ============================================
// SEARCH PACKAGE PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Filter Form Handler with Bootstrap
    const filterForm = document.getElementById('filterForm');
    const resultsCount = document.getElementById('resultsCount');
    const packageCards = document.querySelectorAll('.package-card');
    const totalPackages = packageCards.length;
    
    if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value.toLowerCase();
        const activity = document.getElementById('activity').value.toLowerCase();
        const duration = document.getElementById('duration').value;
        const priceRange = document.getElementById('price-range').value;
        
        let filteredCount = 0;
        
        packageCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const priceText = card.querySelector('.text-primary').textContent.replace('RM', '').trim();
            const price = parseInt(priceText.replace(',', ''));
            
            let showCard = true;
            
            // Destination filter
            if (destination) {
                if (destination === 'perhentian' && !cardText.includes('perhentian')) {
                    showCard = false;
                } else if (destination === 'redang' && !cardText.includes('redang')) {
                    showCard = false;
                } else if (destination === 'tioman' && !cardText.includes('tioman')) {
                    showCard = false;
                }
            }
            
            // Activity filter
            if (activity && !cardText.includes(activity)) {
                showCard = false;
            }
            
            // Price range filter (in RM)
            if (priceRange) {
                const rangeParts = priceRange.split('-');
                let min, max;
                
                if (rangeParts.length === 2) {
                    min = parseInt(rangeParts[0]);
                    max = parseInt(rangeParts[1]);
                    if (price < min || price > max) {
                        showCard = false;
                    }
                } else if (priceRange.endsWith('+')) {
                    min = parseInt(priceRange);
                    if (price < min) {
                        showCard = false;
                    }
                }
            }
            
            // Duration filter
            if (duration) {
                const durationText = card.querySelector('.bi-clock').parentElement.textContent;
                const daysMatch = durationText.match(/\d+/);
                const days = daysMatch ? parseInt(daysMatch[0]) : 0;
                
                if (duration === '1-2' && (days < 1 || days > 2)) {
                    showCard = false;
                } else if (duration === '3-4' && (days < 3 || days > 4)) {
                    showCard = false;
                } else if (duration === '5+' && days < 5) {
                    showCard = false;
                }
            }
            
            // Show/hide card
            if (showCard) {
                card.style.display = 'block';
                filteredCount++;
                
                // Add animation
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
        
        resultsCount.textContent = `Showing ${filteredCount} of ${totalPackages} packages`;
        
        // Show Bootstrap toast
        createToast(`Found ${filteredCount} Malaysian island package(s)`, filteredCount > 0 ? 'success' : 'warning');
    });

        
        // Clear Filters
        const clearBtn = filterForm.querySelector('button[type="reset"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                setTimeout(() => {
                    packageCards.forEach((card, index) => {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease-out';
                        card.style.animationDelay = `${0.1 * index}s`;
                    });
                    resultsCount.textContent = `Showing ${totalPackages} packages`;
                    createToast('Filters cleared', 'info');
                }, 100);
            });
        }
    }
    
    // Package Card Click
    packageCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn') && !e.target.closest('.btn')) {
                const packageName = this.querySelector('.card-title').textContent;
                createToast(`Viewing: ${packageName}`, 'info');
            }
        });
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle "Book Now" clicks
    const bookButtons = document.querySelectorAll('a[href="order-summary.html"]');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card');
            const packageData = {
                title: card.querySelector('.card-title').textContent,
                image: card.querySelector('.card-img-top').src,
                location: card.querySelector('.bi-geo-alt').parentElement.innerText.trim(),
                duration: card.querySelector('.bi-clock').parentElement.innerText.trim(),
                rating: card.querySelector('.bi-star-fill').parentElement.innerText.trim(),
                price: card.querySelector('.h4.text-primary').textContent.replace('RM', '').trim().replace(',', '')
            };
            
            sessionStorage.setItem('selectedPackage', JSON.stringify(packageData));
            window.location.href = 'order-summary.html';
        });
    });
});

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