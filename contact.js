// Elements
const serviceType = document.getElementById('serviceType');
const summaryService = document.getElementById('summary-service');
const summaryTotal = document.getElementById('summary-total');
const summaryHomeType = document.getElementById('summary-home-type');
const bedroomSelect = document.getElementById('bedroomSelect');
const bathroomSelect = document.getElementById('bathroomSelect');

const summaryBedroomPrice = document.getElementById('summary-bedroom-price');
const summaryBathroomPrice = document.getElementById('summary-bathroom-price');
const summaryFrequency = document.getElementById('summary-frequency');
const summaryPayment = document.getElementById('summary-payment-method');
const summaryTip = document.getElementById('summary-tip');

const homeTypes = document.querySelectorAll('.home-type');
const paymentOptions = document.querySelectorAll('#paymentOptions > div');
const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
const tipRadios = document.querySelectorAll('input[name="tip"]');

const packageDiv = document.getElementById('packageDiv');
const packageSelect = document.getElementById('packageSelect');

let selectedTip = 0;
let packagePrice = 0;
let bathroomPrice = 0;

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

// --- Home Type ---
homeTypes.forEach(type => {
    type.addEventListener('click', () => {
        const isSelected = type.classList.contains('selected');

        homeTypes.forEach(t => t.classList.remove('selected', 'border-4', 'border-blue-500', 'border-pink-500', 'border-green-500'));

        if (!isSelected) {
            type.classList.add('selected', 'border-4', 'border-blue-500');
            bedroomSelect.removeAttribute('disabled');
            bathroomSelect.removeAttribute('disabled');
            summaryHomeType.textContent = type.dataset.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
        } else {
            bedroomSelect.setAttribute('disabled', true);
            bathroomSelect.setAttribute('disabled', true);
            bedroomSelect.value = '';
            bathroomSelect.value = '';
            bathroomPrice = 0;
            summaryHomeType.textContent = '-';
            summaryBedroomPrice.textContent = '-';
            summaryBathroomPrice.textContent = '-';
        }
        updateSummary();
    });
});

// --- Bedroom (numbers only) ---
bedroomSelect.addEventListener('change', () => {
    const bedrooms = bedroomSelect.value || '-';
    summaryBedroomPrice.textContent = `${bedrooms} Bedroom(s)`;
    updateSummary();
});

// --- Bathroom (still with price) ---
bathroomSelect.addEventListener('change', () => {
    const bathrooms = parseFloat(bathroomSelect.value) || 0;
    const fullBathrooms = Math.floor(bathrooms);
    const halfBathroom = bathrooms % 1 === 0.5 ? 10 : 0;
    bathroomPrice = fullBathrooms * 20 + halfBathroom;
    summaryBathroomPrice.textContent = `$${bathroomPrice.toFixed(2)}`;
    updateSummary();
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
            option.value = pkg.price; // store price in value
            option.textContent = `${pkg.name} - $${pkg.price}`;
            packageSelect.appendChild(option);
        });
        packageDiv.style.display = 'block';
        packagePrice = 0; // reset price
    } else {
        packageDiv.style.display = 'none';
        packagePrice = 0;
    }
    updateSummary();
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

// --- Update Summary Total ---
function updateSummary() {
    let subtotal = packagePrice + bathroomPrice;
    let tipAmount = subtotal * (selectedTip / 100);
    let total = subtotal + tipAmount;

    summaryTotal.textContent = `$${total.toFixed(2)}`;
}
