// ============================================
// RECEIPT PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Set receipt date to current date
    setCurrentDate();
    
    // Generate booking ID if not present in URL
    generateBookingId();
    
    // Load booking details from URL or localStorage
    loadBookingDetails();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Set current date in receipt
function setCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    // Update receipt date
    const dateElements = document.querySelectorAll('.fw-bold');
    dateElements.forEach(element => {
        if (element.textContent.includes('Date') || element.previousElementSibling?.textContent?.includes('Date')) {
            element.textContent = now.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
        }
    });
    
    // Update payment date if exists
    const paymentDateElement = document.querySelector('.fw-medium:contains("8 January 2026, 14:30 EST")');
    if (paymentDateElement) {
        paymentDateElement.textContent = now.toLocaleDateString('en-US', options) + ' EST';
    }
}

// Generate booking ID
function generateBookingId() {
    const bookingIdElement = document.querySelector('.fw-medium:contains("BDG001")');
    if (bookingIdElement && bookingIdElement.textContent === 'BDG001') {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        bookingIdElement.textContent = `BDG${randomNum}`;
        
        // Update receipt number
        const receiptNoElement = document.querySelector('.fw-bold:contains("MP-")');
        if (receiptNoElement) {
            receiptNoElement.textContent = `MP-2026-${randomNum.toString().padStart(3, '0')}`;
        }
    }
}

// Load booking details from URL parameters
function loadBookingDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentMethod = urlParams.get('payment');
    const bookingId = urlParams.get('booking');
    
    if (paymentMethod) {
        updatePaymentMethod(paymentMethod);
    }
    
    if (bookingId) {
        updateBookingId(bookingId);
    }
}

// Update payment method display
function updatePaymentMethod(method) {
    const methodElement = document.querySelector('.fw-medium:contains("Credit Card ending")');
    if (!methodElement) return;
    
    switch (method) {
        case 'paypal':
            methodElement.textContent = 'PayPal';
            break;
        case 'bank':
            methodElement.textContent = 'Bank Transfer';
            break;
        case 'card':
        default:
            methodElement.textContent = 'Credit Card ending in 3456';
    }
}

// Update booking ID
function updateBookingId(bookingId) {
    const bookingElements = document.querySelectorAll('.fw-medium');
    bookingElements.forEach(element => {
        if (element.textContent.startsWith('BDG')) {
            element.textContent = bookingId;
        }
    });
}

// Print receipt using Bootstrap print styles
function printReceipt() {
    createToast('Preparing receipt for printing...', 'info');
    
    // Add print-specific class
    document.body.classList.add('printing');
    
    // Wait a moment then print
    setTimeout(() => {
        window.print();
        
        // Remove print class after printing
        setTimeout(() => {
            document.body.classList.remove('printing');
            createToast('Print dialog opened', 'success');
        }, 100);
    }, 500);
}

// Download receipt as PDF (simulated)
function downloadReceipt() {
    createToast('Generating PDF receipt...', 'info');
    
    // Show loading state
    const downloadBtn = event?.target || document.querySelector('button[onclick="downloadReceipt()"]');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Generating...';
    downloadBtn.disabled = true;
    
    // Simulate PDF generation
    setTimeout(() => {
        createToast('Receipt downloaded as PDF', 'success');
        
        // Create a temporary download link
        const link = document.createElement('a');
        const receiptContent = document.querySelector('.card').outerHTML;
        const blob = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Marine Tourism Guide Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; }
                    .text-primary { color: #2563eb; }
                    .fw-bold { font-weight: bold; }
                    .border-bottom { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
                </style>
            </head>
            <body>${receiptContent}</body>
            </html>
        `], { type: 'text/html' });
        
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `MarineParadise-Receipt-${new Date().getTime()}.html`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }, 2000);
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

// Helper function to check if element contains text
Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};