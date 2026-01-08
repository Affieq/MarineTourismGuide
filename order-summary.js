// ============================================
// ORDER SUMMARY PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // Bootstrap Form Validation
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (form.checkValidity()) {
                saveBillingInfo();
            }

            form.classList.add('was-validated');
        }, false);
    });

    // Auto-save billing info on input change
    const billingInputs = document.querySelectorAll('#billingForm input, #billingForm select');
    billingInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (document.getElementById('saveBilling').checked) {
                saveBillingInfo();
            }
        });
    });

    // Initialize form with saved data if any
    // Initialize form with saved data if any
    // loadSavedBillingInfo(); // Disabled to ensure user inputs fresh data

    // Load package details from session storage
    loadPackageDetails();

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

let currentBasePrice = 998.00; // Default fallback

// Load package details
function loadPackageDetails() {
    const packageData = JSON.parse(sessionStorage.getItem('selectedPackage'));
    if (!packageData) return;

    // Update Text/Image Elements
    document.getElementById('bookingPackageTitle').textContent = packageData.title;
    document.getElementById('bookingPackageImage').src = packageData.image;
    document.getElementById('bookingLocation').textContent = packageData.location;
    document.getElementById('bookingDuration').textContent = packageData.duration;

    // Default to 1 Pax for the selected package price
    document.getElementById('bookingGuests').textContent = '1 Adult';
    document.getElementById('summaryBasePriceLabel').textContent = 'Package Price (1 Adult)';

    // Parse and Update Price
    const price = parseFloat(packageData.price);
    currentBasePrice = price;

    const serviceFee = price * 0.05;
    const tax = price * 0.08;
    const total = price + serviceFee + tax;

    // Update Summary Values
    document.getElementById('summaryBasePrice').textContent = `RM ${price.toFixed(2)}`;
    document.getElementById('summaryServiceFee').textContent = `RM ${serviceFee.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `RM ${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `RM ${total.toFixed(2)}`;


}



// Save billing info
function saveBillingInfo() {
    const billingData = {
        name: document.getElementById('billingName').value,
        email: document.getElementById('billingEmail').value,
        phone: document.getElementById('billingPhone').value,
        address: document.getElementById('billingAddress').value,
        city: document.getElementById('billingCity').value,
        state: document.getElementById('billingState').value,
        zip: document.getElementById('billingZip').value,
        country: document.getElementById('billingCountry').value
    };

    localStorage.setItem('marineBillingInfo', JSON.stringify(billingData));
    createToast('Billing information saved', 'success');
}

// Load saved billing info
function loadSavedBillingInfo() {
    const savedData = localStorage.getItem('marineBillingInfo');
    if (savedData) {
        const billingData = JSON.parse(savedData);

        for (const [key, value] of Object.entries(billingData)) {
            const element = document.getElementById(`billing${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element) {
                element.value = value;
            }
        }
    }
}

// Proceed to payment
function proceedToPayment() {
    const agreeTerms = document.getElementById('agreeTerms');

    if (!agreeTerms.checked) {
        createToast('Please agree to the Terms & Conditions', 'warning');
        agreeTerms.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Validate billing form
    const billingForm = document.getElementById('billingForm');
    if (!billingForm.checkValidity()) {
        billingForm.classList.add('was-validated');
        createToast('Please fill in all required fields', 'warning');
        return;
    }

    // Save billing info if checked
    if (document.getElementById('saveBilling').checked) {
        saveBillingInfo();
    }

    createToast('Redirecting to payment...', 'info');

    setTimeout(() => {
        window.location.href = 'payment-method.html';
    }, 1500);
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