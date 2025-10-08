// --- Elements ---
const serviceType = document.getElementById('serviceType');
const summaryService = document.getElementById('summary-service');
const summaryTotal = document.getElementById('summary-total');
const bedroomSelect = document.getElementById('bedroomSelect');
const fullBathroomSelect = document.getElementById('bathroomSelect');
const halfBathroomSelect = document.getElementById('halfBathroomSelect');

const summaryFrequency = document.getElementById('summary-frequency');
const summaryPayment = document.getElementById('summary-payment-method');
const summaryTip = document.getElementById('summary-tip');
const summaryHomeType = document.getElementById('summary-home-type');

const homeTypes = document.querySelectorAll('.home-type');
const paymentOptions = document.querySelectorAll('#paymentOptions > div');
const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
const tipRadios = document.querySelectorAll('input[name="tip"]');

const packageDiv = document.getElementById('packageDiv');
const packageSelect = document.getElementById('packageSelect');

const homeTypeSummaryDiv = document.getElementById('homeTypeSummaryDiv');
const fullDiv = document.getElementById('fullBathroomSummaryDiv');
const halfDiv = document.getElementById('halfBathroomSummaryDiv');

const serviceDate = document.getElementById('serviceDate');
const summaryDate = document.getElementById('summary-date');

const noCleanCheckbox = document.getElementById('noCleanCheckbox');
const noCleanRooms = document.getElementById('noCleanRooms');
const additionalServices = document.querySelectorAll('#noCleanRooms .additional-service');

const frequencyButtons = document.querySelectorAll('.frequency-btn');
const recurringTotalDiv = document.getElementById('recurringTotalDiv');
const recurringTotalSpan = document.getElementById('summary-recurring-total');

let selectedTip = 0;
let packagePrice = 0;
let fullBathroomPrice = 0;
let halfBathroomPrice = 0;
let selectedDiscount = 0; // e.g., 0.15 for 15%

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

homeTypes.forEach(type => {
    type.addEventListener('click', () => {
        // Remove all highlights
        homeTypes.forEach(t => t.classList.remove('selected', 'border-4', 'border-blue-500', 'border-pink-500', 'border-green-500'));

        // Select clicked
        type.classList.add('selected', 'border-4');
        if (type.dataset.type === 'single-family') type.classList.add('border-blue-500');
        else if (type.dataset.type === 'townhouse') type.classList.add('border-pink-500');
        else if (type.dataset.type === 'apartment') type.classList.add('border-green-500');

        // ✅ Update summary (only the name, not the icon)
        summaryHomeType.textContent = type.querySelector('.font-semibold')?.textContent.trim() || '-';
        homeTypeSummaryDiv.classList.remove('hidden');

        updateSummary();
    });
});


// --- Bathrooms ---
fullBathroomSelect.addEventListener('change', () => {
    fullBathroomPrice = (parseInt(fullBathroomSelect.value) || 0) * 20;
    updateBathroomSummary();
});
halfBathroomSelect.addEventListener('change', () => {
    halfBathroomPrice = (parseFloat(halfBathroomSelect.value) || 0) * 10;
    updateBathroomSummary();
});

// --- Service Type ---
serviceType.addEventListener('change', () => {
    const selectedService = serviceType.value;
    summaryService.textContent = serviceType.options[serviceType.selectedIndex].text;

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
    }
    updateSummary();
});

// --- Package ---
const packageSummaryDiv = document.getElementById('packageSummaryDiv');
const summaryPackage = document.getElementById('summary-package');

packageSelect.addEventListener('change', () => {
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    packagePrice = parseFloat(selectedOption.value) || 0;
    summaryPackage.textContent = selectedOption.text;
    packageSummaryDiv.classList.remove('hidden');
    updateSummary();
});

// --- Service Date ---
serviceDate.addEventListener('change', () => {
    summaryDate.textContent = serviceDate.value
        ? new Date(serviceDate.value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : '-';
});

// --- Frequency ---
frequencyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        summaryFrequency.textContent =
            radio.value.charAt(0).toUpperCase() + radio.value.slice(1).replace('-', ' ');
    });
});

// --- Payment Method + E-Transfer Note ---
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(o => o.classList.remove('bg-blue-200', 'border-blue-500', 'font-semibold'));
        option.classList.add('bg-blue-200', 'border-blue-500', 'font-semibold');
        const selectedPayment = option.getAttribute('data-value') || '';
        summaryPayment.textContent = `Payment Method: ${selectedPayment}`;

        const existingNote = document.getElementById('eTransferNote');
        if (existingNote) existingNote.remove();

        if (selectedPayment.toLowerCase() === 'e-transfer') {
            const noteDiv = document.createElement('div');
            noteDiv.id = 'eTransferNote';
            noteDiv.className = 'mt-1 text-sm text-gray-600 font-medium';
            noteDiv.textContent =
                'Please send your E-Transfer after the cleaning is completed to: admin@wipedcleaningsrvcs.com';
            summaryPayment.after(noteDiv);
        }
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

// --- No Clean Rooms ---
if (noCleanCheckbox) {
    noCleanCheckbox.addEventListener('change', () => {
        noCleanRooms.classList.toggle('hidden', !noCleanCheckbox.checked);
        if (!noCleanCheckbox.checked) {
            additionalServices.forEach(div => div.classList.remove('selected'));
            removeNoCleanSummary();
        }
    });
}

additionalServices.forEach(service => {
    service.addEventListener('click', () => {
        service.classList.toggle('selected');
        updateNoCleanSummary();
    });
});

// --- Bathroom Summary ---
function updateBathroomSummary() {
    document.getElementById('summary-full-bathroom-price').textContent = `$${fullBathroomPrice.toFixed(2)}`;
    document.getElementById('summary-half-bathroom-price').textContent = `$${halfBathroomPrice.toFixed(2)}`;
    fullBathroomPrice > 0 ? fullDiv.classList.remove('hidden') : fullDiv.classList.add('hidden');
    halfBathroomPrice > 0 ? halfDiv.classList.remove('hidden') : halfDiv.classList.add('hidden');
    updateSummary();
}

// --- Checkbox toggle ---
noCleanCheckbox.addEventListener('change', () => {
    const checked = noCleanCheckbox.checked;
    noCleanRooms.classList.toggle('hidden', !checked);

    if (!checked) {
        // Clear previous selections
        additionalServices.forEach(service => service.classList.remove('selected'));
        removeNoCleanSummary();
        updateSummary();
    }
});

// --- Click Bed/Bath ---
additionalServices.forEach(service => {
    service.addEventListener('click', () => {
        // Only allow selection if the section is visible
        if (!noCleanRooms.classList.contains('hidden')) {
            service.classList.toggle('selected');
            updateNoCleanSummary();
        }
    });
});

// --- Click on Bed/Bath ---
additionalServices.forEach(service => {
    service.addEventListener('click', () => {
        // Only allow selection if the section is visible
        if (!noCleanRooms.classList.contains('hidden')) {
            service.classList.toggle('selected');
            updateNoCleanSummary();
        }
    });
});


// --- Update "No Clean" Summary ---
function updateNoCleanSummary() {
    let total = 0, text = [];

    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined').textContent.toLowerCase();
            let price = 0;
            let label = '';

            if (icon === 'bed') {
                price = 10;
                label = 'Bed (Office, or Dry Room)';
            } else if (icon === 'shower') {
                price = 20;
                label = 'Bath (or other Wet Room)';
            }

            total += price;
            text.push(`${label}: $${price}`);
        }
    });

    removeNoCleanSummary();

    if (total > 0) {
        const div = document.createElement('div');
        div.id = 'summary-no-clean';
        div.className = 'flex items-center gap-2 mt-1 flex-wrap text-red-600';
        div.innerHTML = `<span class="font-medium">Excludes:</span>
                         <span class="font-semibold">${text.join(', ')}</span>`;
        halfDiv.after(div);
    }

    updateSummary();
}

// --- Remove summary helper ---
function removeNoCleanSummary() {
    const existing = document.getElementById('summary-no-clean');
    if (existing) existing.remove();
}

// --- Frequency selection ---
frequencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selection from others
        frequencyButtons.forEach(b => b.classList.remove('selected', 'bg-blue-100'));
        // Highlight current
        btn.classList.add('selected', 'bg-blue-100');

        // Parse discount from text (if any)
        const value = btn.getAttribute('data-value');
        if (value.includes('%')) {
            const percent = value.match(/(\d+)%/)[1];
            selectedDiscount = parseInt(percent) / 100;
        } else {
            selectedDiscount = 0;
        }

        updateSummary(); // recalc totals
    });
});

// --- Update total ---
function updateSummary() {
    let noClean = 0;

    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined').textContent.toLowerCase();
            if (icon === 'bed') noClean += 10;
            if (icon === 'shower') noClean += 20;
        }
    });

    const subtotal = packagePrice + fullBathroomPrice + halfBathroomPrice - noClean;
    const tipAmount = subtotal * (selectedTip / 100);
    const total = subtotal + tipAmount;

    summaryTotal.textContent = `$${total.toFixed(2)}`;

    // --- Recurring Total ---
    if (selectedDiscount > 0) {
        const discountedTotal = total * (1 - selectedDiscount);
        recurringTotalSpan.textContent = `$${discountedTotal.toFixed(2)}`;
        recurringTotalDiv.classList.remove('hidden');
    } else {
        recurringTotalDiv.classList.add('hidden');
    }
}

// --- Form Submit ---
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('service', serviceType?.value || '');
    formData.append('homeType', summaryHomeType?.textContent !== '-' ? summaryHomeType.textContent : '');
    formData.append('packagePrice', parseFloat(packageSelect?.value) || 0);
    formData.append('bedrooms', parseInt(bedroomSelect?.value) || 0);
    formData.append('fullBathrooms', parseInt(fullBathroomSelect?.value) || 0);
    formData.append('halfBathrooms', parseInt(halfBathroomSelect?.value) || 0);
    formData.append('frequency', document.querySelector('input[name="frequency"]:checked')?.value || '');
    formData.append('payment', document.querySelector('#paymentOptions > div.bg-blue-200')?.getAttribute('data-value') || '');
    formData.append('tip', parseInt(document.querySelector('input[name="tip"]:checked')?.value) || 0);
    formData.append('total', parseFloat(summaryTotal?.textContent.replace('$', '')) || 0);
    formData.append('serviceDate', serviceDate?.value || '');

    const noClean = [];
    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined')?.textContent.toLowerCase();
            if (icon) noClean.push(icon);
        }
    });
    formData.append('noCleanRooms', noClean.join(','));

    const paymentValue = document.querySelector('#paymentOptions > div.bg-blue-200')?.getAttribute('data-value') || '';
    if (paymentValue.toLowerCase() === 'e-transfer') {
        formData.append('eTransferNote', 'Please send your E-Transfer after the cleaning is completed to: admin@wipedcleaningsrvcs.com');
    }

    fetch('sendBooking.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert('Booking sent successfully!');
                    bookingForm.reset();
                    summaryService.textContent = '-';
                    summaryHomeType.textContent = '-';
                    summaryTotal.textContent = '$0.00';
                    summaryFrequency.textContent = '-';
                    summaryPayment.textContent = '-';
                    summaryTip.textContent = '-';
                    fullBathroomPrice = 0;
                    halfBathroomPrice = 0;
                    packagePrice = 0;
                    removeNoCleanSummary();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                console.error('Non-JSON response:', text);
                alert('Error sending booking. Check console.');
            }
        })
        .catch(err => console.error('Fetch error:', err));
});
