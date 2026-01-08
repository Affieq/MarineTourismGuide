// ============================================
// PAYMENT METHOD PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize payment method tabs
    const paymentTabs = document.getElementById('paymentTabs');
    if (paymentTabs) {
        paymentTabs.addEventListener('shown.bs.tab', function(event) {
            const activeTab = event.target.getAttribute('data-bs-target');
            console.log(`Selected payment method: ${activeTab}`);
        });
    }
    
    // Credit card input formatting
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formatted.substring(0, 19);
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/gi, '').substring(0, 4);
        });
    }
    
    // Initialize form validation
    const cardForm = document.getElementById('cardForm');
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (cardForm.checkValidity()) {
                processCardPayment();
            }
            
            cardForm.classList.add('was-validated');
        }, false);
    }
    
    // Load saved card if exists
    loadSavedCard();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Process payment based on selected method
function processPayment() {
    const activeTab = document.querySelector('#paymentTabs .nav-link.active');
    const method = activeTab.getAttribute('data-bs-target');
    
    switch (method) {
        case '#card':
            processCardPayment();
            break;
        case '#paypal':
            payWithPayPal();
            break;
        case '#bank':
            processBankTransfer();
            break;
        default:
            createToast('Please select a payment method', 'warning');
    }
}

// Process credit card payment
function processCardPayment() {
    const cardForm = document.getElementById('cardForm');
    
    if (!cardForm.checkValidity()) {
        cardForm.classList.add('was-validated');
        createToast('Please fill in all card details', 'warning');
        return;
    }
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Basic validation
    if (cardNumber.length !== 16) {
        createToast('Please enter a valid 16-digit card number', 'warning');
        return;
    }
    
    if (!validateExpiryDate(expiryDate)) {
        createToast('Please enter a valid expiry date (MM/YY)', 'warning');
        return;
    }
    
    if (cvv.length < 3) {
        createToast('Please enter a valid CVV', 'warning');
        return;
    }
    
    // Save card if checked
    if (document.getElementById('saveCard').checked) {
        saveCardInfo(cardNumber, cardName, expiryDate);
    }
    
    // Show processing modal
    const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
    processingModal.show();
    
    // Simulate payment processing
    setTimeout(() => {
        processingModal.hide();
        
        // Simulate successful payment
        createToast('Payment successful! Redirecting to receipt...', 'success');
        
        setTimeout(() => {
            window.location.href = 'receipt.html?payment=card&booking=BDG001';
        }, 1500);
    }, 3000);
}

// PayPal payment
function payWithPayPal() {
    createToast('Redirecting to PayPal...', 'info');
    
    // Show processing modal
    const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
    processingModal.show();
    
    // Simulate PayPal redirect
    setTimeout(() => {
        processingModal.hide();
        createToast('PayPal payment completed!', 'success');
        
        setTimeout(() => {
            window.location.href = 'receipt.html?payment=paypal&booking=BDG001';
        }, 1500);
    }, 2000);
}

// Bank transfer
function processBankTransfer() {
    createToast('Bank transfer instructions have been sent to your email', 'info');
    
    setTimeout(() => {
        window.location.href = 'receipt.html?payment=bank&booking=BDG001';
    }, 1500);
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
    if (!expiryDate || !expiryDate.includes('/')) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
}

// Save card info
function saveCardInfo(cardNumber, cardName, expiryDate) {
    // Mask card number for storage
    const maskedCard = '**** **** **** ' + cardNumber.slice(-4);
    
    const cardInfo = {
        number: maskedCard,
        name: cardName,
        expiry: expiryDate,
        lastUsed: new Date().toISOString()
    };
    
    localStorage.setItem('marineSavedCard', JSON.stringify(cardInfo));
}

// Load saved card
function loadSavedCard() {
    const savedCard = localStorage.getItem('marineSavedCard');
    if (savedCard) {
        const cardInfo = JSON.parse(savedCard);
        
        // Pre-fill form with saved card (masked)
        document.getElementById('cardName').value = cardInfo.name;
        // Note: For security, we don't pre-fill card number or CVV
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