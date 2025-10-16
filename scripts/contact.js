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
const addServices = document.querySelectorAll('.addServices');


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

frequencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove highlight from others
        frequencyButtons.forEach(b => b.classList.remove('selected', 'bg-blue-100'));

        // Highlight clicked
        btn.classList.add('selected', 'bg-blue-100');

        // Reset discount
        selectedDiscount = 0;

        // Parse discount from data-value
        const value = btn.getAttribute('data-value');
        const discountMatch = value.match(/(\d+)%/); // extract number before %
        if (discountMatch) {
            selectedDiscount = parseInt(discountMatch[1], 10) / 100;
        }

        updateSummary();
    });
});



// --- Add Services Click Handler ---
addServices.forEach(service => {
    service.addEventListener('click', () => {
        service.classList.toggle('selected');       // Toggle selection
        updateSummary();                             // Update main total
        updateAddServicesSummary();                  // Update services summary
    });
});

// --- Update Add Services Summary & Total ---
function updateAddServicesSummary() {
    let total = 0;

    // Remove existing summary div first
    removeAddServicesSummary();

    const selectedServices = addServices.filter
        ? addServices.filter(service => service.classList.contains('selected'))
        : Array.from(addServices).filter(service => service.classList.contains('selected'));

    if (selectedServices.length > 0) {
        const div = document.createElement('div');
        div.id = 'summary-add-services';
        div.className = 'flex flex-col gap-1 mt-1 text-gray-600';

        // Title
        const title = document.createElement('span');
        title.className = 'font-medium';
        title.textContent = 'Additional Services:';
        div.appendChild(title);

        // Each selected service in its own line
        selectedServices.forEach(service => {
            const label = service.querySelector('span.font-bold')?.textContent.split(' - ')[0] || '';
            const price = parseFloat(service.dataset.price) || 0;
            total += price;

            const line = document.createElement('span');
            line.className = 'font-semibold';
            line.textContent = `${label}: $${price}`;
            div.appendChild(line);
        });

        // Append after bathrooms summary
        const halfDiv = document.getElementById('halfBathroomSummaryDiv');
        halfDiv.after(div);
    }

    // Update total including add services
    updateSummary();
}

// --- Helper to remove old summary ---
function removeAddServicesSummary() {
    const existing = document.getElementById('summary-add-services');
    if (existing) existing.remove();
}

function updateSummary() {
    let addServicesTotal = 0;
    addServices.forEach(service => {
        if (service.classList.contains('selected')) {
            addServicesTotal += parseFloat(service.dataset.price) || 0;
        }
    });

    const subtotal = packagePrice + fullBathroomPrice + halfBathroomPrice + addServicesTotal;
    const tipAmount = subtotal * (selectedTip / 100);
    let total = subtotal + tipAmount;

    // Show discounted amount in recurring total
    if (selectedDiscount > 0) {
        const discountAmount = total * selectedDiscount; // only the discounted part
        recurringTotalSpan.textContent = `$${discountAmount.toFixed(2)}`;
        recurringTotalDiv.classList.remove('hidden');
    } else {
        recurringTotalDiv.classList.add('hidden');
    }

    // Original total always visible
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// --- Form Submit ---
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show a "Sending..." state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();

        // --- Contact Info ---
        formData.append('firstName', document.getElementById('firstName')?.value.trim() || '');
        formData.append('lastName', bookingForm.querySelector('input[placeholder="Last Name *"]')?.value.trim() || '');
        formData.append('email', bookingForm.querySelector('input[type="email"]')?.value.trim() || '');
        formData.append('phone', bookingForm.querySelector('input[type="tel"]')?.value.trim() || '');
        formData.append('emergencyContactName', bookingForm.querySelector('input[placeholder="Emergency Contact Name"]')?.value.trim() || '');
        formData.append('emergencyContactPhone', bookingForm.querySelector('input[placeholder="Emergency Contact Phone"]')?.value.trim() || '');

        // --- Home Details ---
        formData.append('homeType', summaryHomeType?.textContent !== '-' ? summaryHomeType.textContent : '');
        formData.append('serviceType', serviceType?.value || '');
        formData.append('packagePrice', parseFloat(packageSelect?.value) || 0);
        formData.append('packageName', packageSelect?.selectedOptions[0]?.text || '');
        formData.append('fullBathrooms', parseInt(fullBathroomSelect?.value) || 0);
        formData.append('halfBathrooms', parseInt(halfBathroomSelect?.value) || 0);

        // --- Rooms to Skip Cleaning ---
        const noCleanRooms = [...additionalServices]
            .filter(s => s.classList.contains('selected'))
            .map(s => s.querySelector('span.material-symbols-outlined')?.textContent.toLowerCase())
            .filter(Boolean)
            .join(', ');
        formData.append('noCleanRooms', noCleanRooms);

        // --- Frequency ---
        const selectedFreq = document.querySelector('input[name="frequency"]:checked')?.value
            || document.querySelector('.frequency-btn.selected')?.getAttribute('data-value') 
            || '';
        formData.append('frequency', selectedFreq);

        // --- Address Details ---
        const addressFields = [
            { label: 'Address', key: 'address' },
            { label: 'Unit', key: 'unit' },
            { label: 'City', key: 'city' },
            { label: 'Province', key: 'province' },
            { label: 'Zipcode', key: 'zipcode' },
            { label: 'Address Note', key: 'addressNote' }
        ];
        addressFields.forEach(field => {
            const input = bookingForm.querySelector(`input[placeholder*="${field.label}"]`);
            formData.append(field.key, input?.value.trim() || '');
        });

        // --- Key Information & Notes ---
        const keyInfoContainer = document.getElementById('keyInfoGroup');
        const keyInfo = keyInfoContainer 
            ? [...keyInfoContainer.querySelectorAll('input[type="checkbox"]')]
                .filter(c => c.checked)
                .map(c => c.nextSibling?.textContent.trim() || '')
                .join(', ')
            : '';
        formData.append('keyInfo', keyInfo);

        const notesTextarea = document.getElementById('jobNotes');
        formData.append('notes', notesTextarea?.value.trim() || '');

        // --- Additional Questions ---
        const preferredContactSelect = document.getElementById('preferredContact');
        formData.append('preferredContact', preferredContactSelect?.value || '');

        const feedbackTextarea = bookingForm.querySelector('textarea[placeholder*="best cleaning service"]');
        formData.append('feedback', feedbackTextarea?.value.trim() || '');

        // --- Service Date ---
        formData.append('serviceDate', serviceDate?.value || '');

        // --- Tip ---
        const tipValue = parseInt(document.querySelector('input[name="tip"]:checked')?.value) || 0;
        formData.append('tip', tipValue);

        // --- Payment ---
        const paymentValue = document.querySelector('#paymentOptions > div.bg-blue-200')?.dataset.value || '';
        formData.append('paymentMethod', paymentValue);

        // --- Total ---
        formData.append('total', parseFloat(summaryTotal?.textContent.replace('$', '')) || 0);

        // --- Recurring Total ---
        if (!recurringTotalDiv.classList.contains('hidden')) {
            formData.append('recurringTotal', parseFloat(recurringTotalSpan.textContent.replace('$', '')) || 0);
        }
        
        // --- Send to PHP ---
        const response = await fetch('sendBooking.php', { method: 'POST', body: formData });
        const text = await response.text();

        let data;
        try { data = JSON.parse(text); } 
        catch { throw new Error('Unexpected server response.'); }

        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Booking Sent!',
                text: 'Your booking has been submitted successfully.',
                confirmButtonColor: '#1E40AF'
            });

            bookingForm.reset();

            // Reset summary
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
            recurringTotalDiv.classList.add('hidden');

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error Sending Booking',
                text: data.message,
                confirmButtonColor: '#B91C1C'
            });
        }

    } catch (err) {
        console.error('Booking error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: err.message || 'Please try again later.',
            confirmButtonColor: '#B91C1C'
        });

    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});
