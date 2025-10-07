// Elements
const serviceType = document.getElementById('serviceType');
const summaryService = document.getElementById('summary-service');
const summaryTotal = document.getElementById('summary-total');
const bedroomSelect = document.getElementById('bedroomSelect');
const fullBathroomSelect = document.getElementById('bathroomSelect');
const halfBathroomSelect = document.getElementById('halfBathroomSelect');

const summaryBedroomPrice = document.getElementById('summary-bedroom-price');
const summaryFrequency = document.getElementById('summary-frequency');
const summaryPayment = document.getElementById('summary-payment-method');
const summaryTip = document.getElementById('summary-tip');

const homeTypes = document.querySelectorAll('.home-type');
const summaryHomeType = document.getElementById('summary-home-type');
const paymentOptions = document.querySelectorAll('#paymentOptions > div');
const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
const tipRadios = document.querySelectorAll('input[name="tip"]');

const packageDiv = document.getElementById('packageDiv');
const packageSelect = document.getElementById('packageSelect');

const homeDiv = document.getElementById('homeTypeSummaryDiv');
const fullDiv = document.getElementById('fullBathroomSummaryDiv');
const halfDiv = document.getElementById('halfBathroomSummaryDiv');

const serviceDate = document.getElementById('serviceDate'); //<input type="date">
const summaryDate = document.getElementById('summary-date');

const noCleanCheckbox = document.getElementById('noCleanCheckbox');
const noCleanRooms = document.getElementById('noCleanRooms');
const additionalServices = document.querySelectorAll('#noCleanRooms .additional-service');

let selectedTip = 0;
let packagePrice = 0;
let fullBathroomPrice = 0;
let halfBathroomPrice = 0;

// --- Packages with Prices ---
const packages = {
    "care-clean": [
        { name: "Studio/1 Bedroom", price: 145 },
        { name: "2 Bedroom", price: 165 },
        { name: "3 Bedroom", price: 205 },
        { name: "4 Bedroom", price: 245 },
        { name: "5 Bedroom", price: 295 },
        { name: "6 Bedroom", price: 375 }
    ],
    "deep-clean": [
        { name: "Studio/1 Bedroom", price: 180 },
        { name: "2 Bedroom", price: 200 },
        { name: "3 Bedroom", price: 230 },
        { name: "4 Bedroom", price: 270 },
        { name: "5 Bedroom", price: 315 },
        { name: "6 Bedroom", price: 350 }
    ],
    "move-in-out-clean": [
        { name: "Studio/1 Bedroom", price: 200 },
        { name: "2 Bedroom", price: 280 },
        { name: "3 Bedroom", price: 300 },
        { name: "4 Bedroom", price: 380 },
        { name: "5 Bedroom", price: 400 },
        { name: "6 Bedroom", price: 480 }
    ],
    "post-construction": [
        { name: "Studio/1 Bedroom", price: 280 },
        { name: "2 Bedroom", price: 380 },
        { name: "3 Bedroom", price: 480 },
        { name: "4 Bedroom", price: 580 },
        { name: "5 Bedroom", price: 680 },
        { name: "6 Bedroom", price: 780 }
    ]
};

// --- Home Type Selection ---
homeTypes.forEach(type => {
    type.addEventListener('click', () => {
        const isSelected = type.classList.contains('selected');

        // Deselect all
        homeTypes.forEach(t => {
            t.classList.remove('selected', 'border-4', 'border-blue-500', 'border-pink-500', 'border-green-500');
        });

        if (!isSelected) {
            type.classList.add('selected', 'border-4');

            // Border color based on type
            if (type.dataset.type === 'single-family') type.classList.add('border-blue-500');
            else if (type.dataset.type === 'townhouse') type.classList.add('border-pink-500');
            else if (type.dataset.type === 'apartment') type.classList.add('border-green-500');

            // Enable dropdowns
            bedroomSelect.removeAttribute('disabled');
            fullBathroomSelect.removeAttribute('disabled');
            halfBathroomSelect.removeAttribute('disabled');

            // Show home type summary
            summaryHomeType.textContent = type.dataset.type
                .replace('-', ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
            homeDiv.classList.remove('hidden');

        } else {
            // Reset selection
            type.classList.remove('selected');
            bedroomSelect.setAttribute('disabled', true);
            fullBathroomSelect.setAttribute('disabled', true);
            halfBathroomSelect.setAttribute('disabled', true);
            bedroomSelect.value = '';
            fullBathroomSelect.value = '';
            halfBathroomSelect.value = '';

            summaryHomeType.textContent = '-';
            homeDiv.classList.add('hidden');
            fullDiv.classList.add('hidden');
            halfDiv.classList.add('hidden');
            removeNoCleanSummary();
            fullBathroomPrice = 0;
            halfBathroomPrice = 0;
            updateSummary();
        }
    });
});

// --- Full Bathrooms ($20 each) ---
fullBathroomSelect.addEventListener('change', () => {
    const fullBathrooms = parseInt(fullBathroomSelect.value) || 0;
    fullBathroomPrice = fullBathrooms * 20;
    updateBathroomSummary();
});

// --- Half Bathrooms ($10 each) ---
halfBathroomSelect.addEventListener('change', () => {
    const halfBathrooms = parseFloat(halfBathroomSelect.value) || 0;
    halfBathroomPrice = halfBathrooms * 10;
    updateBathroomSummary();
});

// --- Service Type ---
serviceType.addEventListener('change', () => {
    const selectedService = serviceType.value;
    summaryService.textContent = serviceType.options[serviceType.selectedIndex].text;

    // Populate package dropdown
    packageSelect.innerHTML = '<option value="" disabled selected>Select a Package</option>';
    if (packages[selectedService]) {
        packages[selectedService].forEach(pkg => {
            const option = document.createElement('option');
            option.value = pkg.price;
            option.textContent = pkg.name;
            packageSelect.appendChild(option);
        });
        packageDiv.style.display = 'block';
        packagePrice = 0;
    } else {
        packageDiv.style.display = 'none';
        packagePrice = 0;
    }
    updateSummary();
});

// --- Service Date ---
serviceDate.addEventListener('change', () => {
    const selected = serviceDate.value;
    if (selected) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(selected).toLocaleDateString(undefined, options);
        summaryDate.textContent = formattedDate;
    } else {
        summaryDate.textContent = '-';
    }
});

// --- Package Selection ---
packageSelect.addEventListener('change', () => {
    packagePrice = parseFloat(packageSelect.value) || 0;
    updateSummary();
});

// --- Frequency ---
frequencyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        summaryFrequency.textContent = radio.value.charAt(0).toUpperCase() + radio.value.slice(1).replace('-', ' ');
    });
});

// --- Payment Method ---
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(o => o.classList.remove('bg-blue-200', 'border-blue-500', 'font-semibold'));
        option.classList.add('bg-blue-200', 'border-blue-500', 'font-semibold');
        summaryPayment.textContent = `Payment Method: ${option.getAttribute('data-value')}`;
    });
});

// --- Tip ---
tipRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        selectedTip = parseInt(radio.value) || 0;
        summaryTip.textContent = `Tip: ${selectedTip}%`;
        updateSummary();
    });
});

// --- Update Bathroom Summary ---
function updateBathroomSummary() {
    document.getElementById('summary-full-bathroom-price').textContent = `$${fullBathroomPrice.toFixed(2)}`;
    document.getElementById('summary-half-bathroom-price').textContent = `$${halfBathroomPrice.toFixed(2)}`;

    if (fullBathroomPrice > 0) fullDiv.classList.remove('hidden'); else fullDiv.classList.add('hidden');
    if (halfBathroomPrice > 0) halfDiv.classList.remove('hidden'); else halfDiv.classList.add('hidden');

    updateSummary();
}

// --- Checkbox toggle for No Clean Rooms ---
if (noCleanCheckbox) {
    noCleanCheckbox.addEventListener('change', () => {
        noCleanRooms.classList.toggle('hidden', !noCleanCheckbox.checked);
        if (!noCleanCheckbox.checked) {
            // Remove any selection and summary
            additionalServices.forEach(div => div.classList.remove('selected'));
            removeNoCleanSummary();
        }
    });
}

// --- No Clean Rooms Selection ---
additionalServices.forEach(service => {
    service.addEventListener('click', () => {
        service.classList.toggle('selected');
        updateNoCleanSummary();
    });
});

// --- Update No Clean Summary (Single Row) ---
function updateNoCleanSummary() {
    let total = 0;
    let text = [];

    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined').textContent.toLowerCase();
            if (icon === 'bed') {
                total += 10;
                text.push('Bed: $10');
            }
            if (icon === 'shower') {
                total += 20;
                text.push('Bath: $20');
            }
        }
    });

    removeNoCleanSummary();

    if (total > 0) {
        const halfDiv = document.getElementById('halfBathroomSummaryDiv');
        const div = document.createElement('div');
        div.id = 'summary-no-clean';
        // Use flex to display all items in a row
        div.className = 'flex items-center gap-2 mt-1 flex-wrap';
        div.innerHTML = `
            <span class="font-medium text-gray-500">Extra (No Clean Rooms):</span>
            <span class="text-gray-500 font-semibold">${text.join(', ')} ($${total}.00)</span>
        `;
        halfDiv.after(div);
    }

    updateSummary();
}

// --- Remove No Clean Summary ---
function removeNoCleanSummary() {
    const existing = document.getElementById('summary-no-clean');
    if (existing) existing.remove();
}

// --- Update Total Summary ---
function updateSummary() {
    let noClean = 0;
    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined').textContent.toLowerCase();
            if (icon === 'bed') noClean += 10;
            if (icon === 'shower') noClean += 20;
        }
    });

    const subtotal = packagePrice + fullBathroomPrice + halfBathroomPrice + noClean;
    const tipAmount = subtotal * (selectedTip / 100);
    const total = subtotal + tipAmount;
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}
