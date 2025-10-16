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

        // Update summary (only the name, not the icon)
        if (summaryHomeType) {
            summaryHomeType.textContent = type.querySelector('.font-semibold')?.textContent.trim() || '-';
        }
        if (homeTypeSummaryDiv) {
            homeTypeSummaryDiv.classList.remove('hidden');
        }

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
    if (summaryService) {
        summaryService.textContent = serviceType.options[serviceType.selectedIndex].text;
    }

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
    if (summaryPackage) {
        summaryPackage.textContent = selectedOption.text;
    }
    if (packageSummaryDiv) {
        packageSummaryDiv.classList.remove('hidden');
    }
    updateSummary();
});

// --- Service Date ---
serviceDate.addEventListener('change', () => {
    if (summaryDate) {
        summaryDate.textContent = serviceDate.value
            ? new Date(serviceDate.value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
            : '-';
    }
});

// --- Frequency ---
frequencyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (summaryFrequency) {
            summaryFrequency.textContent =
                radio.value.charAt(0).toUpperCase() + radio.value.slice(1).replace('-', ' ');
        }
    });
});

// --- Payment Method + E-Transfer Note ---
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(o => o.classList.remove('bg-blue-200', 'border-blue-500', 'font-semibold'));
        option.classList.add('bg-blue-200', 'border-blue-500', 'font-semibold');
        const selectedPayment = option.getAttribute('data-value') || '';
        
        if (summaryPayment) {
            summaryPayment.textContent = `Payment Method: ${selectedPayment}`;
        }

        const existingNote = document.getElementById('eTransferNote');
        if (existingNote) existingNote.remove();

        if (selectedPayment.toLowerCase() === 'e-transfer') {
            const noteDiv = document.createElement('div');
            noteDiv.id = 'eTransferNote';
            noteDiv.className = 'mt-1 text-sm text-gray-600 font-medium';
            noteDiv.textContent =
                'Please send your E-Transfer after the cleaning is completed to: admin@wipedcleaningsrvcs.com';
            if (summaryPayment) {
                summaryPayment.after(noteDiv);
            }
        }
    });
});

// --- Tip ---
tipRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        selectedTip = parseInt(radio.value) || 0;
        if (summaryTip) {
            summaryTip.textContent = `Tip: ${selectedTip}%`;
        }
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
    const fullPriceElem = document.getElementById('summary-full-bathroom-price');
    const halfPriceElem = document.getElementById('summary-half-bathroom-price');
    
    if (fullPriceElem) {
        fullPriceElem.textContent = `$${fullBathroomPrice.toFixed(2)}`;
    }
    if (halfPriceElem) {
        halfPriceElem.textContent = `$${halfBathroomPrice.toFixed(2)}`;
    }
    
    if (fullDiv) {
        fullBathroomPrice > 0 ? fullDiv.classList.remove('hidden') : fullDiv.classList.add('hidden');
    }
    if (halfDiv) {
        halfBathroomPrice > 0 ? halfDiv.classList.remove('hidden') : halfDiv.classList.add('hidden');
    }
    
    updateSummary();
}

// --- Click Bed/Bath cards ---
additionalServices.forEach(service => {
    const minusBtn = service.querySelector('.minus-btn');
    const plusBtn = service.querySelector('.plus-btn');
    const quantityDisplay = service.querySelector('.quantity');

    service.addEventListener('click', (e) => {
        // Ignore clicks on +/− buttons
        if (e.target.classList.contains('plus-btn') || 
            e.target.classList.contains('minus-btn') ||
            e.target.closest('.minus-btn') || 
            e.target.closest('.plus-btn')) {
            return;
        }

        // Toggle selection
        const isSelected = service.classList.toggle('selected');

        if (isSelected) {
            service.classList.add('ring-4', 'ring-blue-400', 'bg-blue-50');
            if (quantityDisplay && quantityDisplay.textContent === '0') {
                quantityDisplay.textContent = '1';
            }
        } else {
            service.classList.remove('ring-4', 'ring-blue-400', 'bg-blue-50');
            if (quantityDisplay) {
                quantityDisplay.textContent = '0';
            }
        }

        updateNoCleanSummary();
    });

   // Plus button
    if (plusBtn) {
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentQty = parseInt(quantityDisplay.textContent) || 0;
            quantityDisplay.textContent = currentQty + 1;
            
            // Auto-select if not selected
            if (!service.classList.contains('selected')) {
                service.classList.add('selected', 'ring-4', 'ring-blue-400', 'bg-blue-50');
            }
            
            updateNoCleanSummary();
        });
    }

    // Minus button
    if (minusBtn) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentQty = parseInt(quantityDisplay.textContent) || 0;
            
            if (currentQty > 1) {
                quantityDisplay.textContent = currentQty - 1;
            } else if (currentQty === 1) {
                quantityDisplay.textContent = '0';
                service.classList.remove('selected', 'ring-4', 'ring-blue-400', 'bg-blue-50');
            }
            updateNoCleanSummary();
        });
    }
});

// --- Update "No Clean" Summary ---
function updateNoCleanSummary() {
    let totalNoClean = 0;
    let text = [];

    additionalServices.forEach(service => {
        if (service.classList.contains('selected')) {
            const icon = service.querySelector('span.material-symbols-outlined').textContent.toLowerCase();
            const quantity = parseInt(service.querySelector('.quantity')?.textContent || '0');
            let price = 0;
            let label = '';

            if (icon === 'bed') {
                price = 10;
                label = 'Bed (Office, or Dry Room)';
            } else if (icon === 'shower') {
                price = 20;
                label = 'Bath (or other Wet Room)';
            }

            // Multiply price by quantity
            const subtotal = price * quantity;
            totalNoClean += subtotal;

            text.push(`${label}: -$${subtotal}`);
        }
    });

    // Store total for use in updateSummary()
    window.noCleanTotal = totalNoClean;

    // Remove previous summary line
    removeNoCleanSummary();

    // Add new one if there are excluded rooms
    if (totalNoClean > 0 && halfDiv) {
        const div = document.createElement('div');
        div.id = 'summary-no-clean';
        div.className = 'flex items-center gap-2 mt-1 flex-wrap text-red-600';
        div.innerHTML = `
            <span class="font-medium">Excludes:</span>
            <span class="font-semibold">${text.join(', ')}</span>
        `;
        halfDiv.after(div);
    }

    // Update total calculation
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

addServices.forEach(service => {
    const minusBtn = service.querySelector('.minus-btn');
    const plusBtn = service.querySelector('.plus-btn');
    const quantityDisplay = service.querySelector('.quantity');
    const quantityControls = service.querySelector('.flex.items-center.gap-4'); // +/- container

    let quantity = 0;
    const price = parseFloat(service.dataset.price) || 0;

    // Hide quantity buttons initially if they exist
    if (quantityControls) quantityControls.style.display = 'none';

    // --- Click on the card ---
    service.addEventListener('click', (e) => {
        // Ignore clicks on +/- buttons
        if (e.target.classList.contains('plus-btn') || e.target.classList.contains('minus-btn')) return;

        service.classList.toggle('selected');
        const isSelected = service.classList.contains('selected');

        if (isSelected) {
            // Show quantity controls if exist
            if (quantityControls) quantityControls.style.display = 'flex';

            // If no quantity yet, start with 1
            quantity = quantity === 0 ? 1 : quantity;

            if (quantityDisplay) quantityDisplay.textContent = quantity;
        } else {
            // Hide and reset
            if (quantityControls) quantityControls.style.display = 'none';
            quantity = 0;
            if (quantityDisplay) quantityDisplay.textContent = quantity;
        }

        // Save to dataset
        service.dataset.quantity = quantity;

        updateAddServicesSummary();
    });

    // --- Plus button ---
    if (plusBtn) {
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            quantity++;
            if (quantityDisplay) quantityDisplay.textContent = quantity;
            service.dataset.quantity = quantity;
            if (!service.classList.contains('selected')) {
                service.classList.add('selected');
                if (quantityControls) quantityControls.style.display = 'flex';
            }
            updateAddServicesSummary();
        });
    }
    // --- Minus button ---
    if (minusBtn) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (quantity > 1) {
                quantity--;
            } else {
                quantity = 0;
                service.classList.remove('selected');
                if (quantityControls) quantityControls.style.display = 'none';
            }
            if (quantityDisplay) quantityDisplay.textContent = quantity;
            service.dataset.quantity = quantity;
            updateAddServicesSummary();
        });
    }

    // Initialize dataset quantity
    service.dataset.quantity = quantity;
});

// --- Helper: Remove old summary ---
function removeAddServicesSummary() {
    const existing = document.getElementById('summary-add-services');
    if (existing) existing.remove();
}

// --- Update Add Services Summary & Total ---
function updateAddServicesSummary() {
    removeAddServicesSummary();

    let total = 0;
    const selectedServices = Array.from(addServices).filter(s => s.classList.contains('selected'));

    if (selectedServices.length > 0 && halfDiv) {
        const div = document.createElement('div');
        div.id = 'summary-add-services';
        div.className = 'flex flex-col gap-1 mt-1 text-gray-600';

        const title = document.createElement('span');
        title.className = 'font-medium';
        title.textContent = 'Additional Services:';
        div.appendChild(title);

        selectedServices.forEach(service => {
            const label = service.querySelector('span.font-bold')?.textContent || '';
            const price = parseFloat(service.dataset.price) || 0;
            const quantity = parseInt(service.dataset.quantity || '1');
            const subtotal = price * quantity;
            total += subtotal;

            const line = document.createElement('span');
            line.className = 'font-semibold';

            if (service.querySelector('.quantity')) {
                line.textContent = `${label} × ${quantity} = $${subtotal}`;
            } else {
                line.textContent = `${label} = $${subtotal}`;
            }

            div.appendChild(line);
        });

        halfDiv.after(div);
    }

    // Pass to updateSummary for overall total computation
    window.addServicesTotal = total;
    updateSummary();
}


function updateSummary() {
    // Use global addServicesTotal if set (from updateAddServicesSummary)
    let addServicesTotal = window.addServicesTotal || 0;

    // Safety net: if not yet calculated, compute manually
    if (addServicesTotal === 0) {
        addServices.forEach(service => {
            if (service.classList.contains('selected')) {
                const price = parseFloat(service.dataset.price) || 0;
                const quantity =
                    parseInt(service.dataset.quantity || service.querySelector('.quantity')?.textContent || '0');
                addServicesTotal += price * quantity;
            }
        });
    }

    // Compute subtotal (main package + bathrooms + add-ons)
    const subtotal = packagePrice + fullBathroomPrice + halfBathroomPrice + addServicesTotal;

    // Subtract "No Clean" total (if any)
    const totalAfterNoClean = subtotal - (window.noCleanTotal || 0);

    // Add tip
    const tipAmount = totalAfterNoClean * (selectedTip / 100);
    let total = totalAfterNoClean + tipAmount;

    // Always show main total
    if (summaryTotal) {
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // ✅ Show the discount value (percentage of total)
    if (selectedDiscount > 0) {
        const recurringTotal = total * selectedDiscount; // ✅ 15% of 200 = 30

        if (recurringTotalSpan) {
            recurringTotalSpan.textContent = `$${recurringTotal.toFixed(2)}`;
        }
        if (recurringTotalDiv) {
            recurringTotalDiv.classList.remove('hidden');
        }
    } else {
        if (recurringTotalDiv) {
            recurringTotalDiv.classList.add('hidden');
        }
    }
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
        const noCleanRoomsData = [...additionalServices]
            .filter(s => s.classList.contains('selected'))
            .map(s => {
                const icon = s.querySelector('span.material-symbols-outlined')?.textContent.toLowerCase();
                const qty = parseInt(s.querySelector('.quantity')?.textContent || '0');
                return `${icon} (${qty})`;
            })
            .filter(Boolean)
            .join(', ');
        formData.append('noCleanRooms', noCleanRoomsData);

        // --- Frequency ---
        const selectedFreq = document.querySelector('input[name="frequency"]:checked')?.value
            || document.querySelector('.frequency-btn.selected')?.getAttribute('data-value') 
            || '';
        formData.append('frequency', selectedFreq);

        // --- Address Details ---
        const addressFields = [
            { label: 'Street', key: 'address' },
            { label: 'Unit', key: 'unit' },
            { label: 'City', key: 'city' },
            { label: 'Province', key: 'province' },
            { label: 'Zipcode', key: 'zipcode' }
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
        if (recurringTotalDiv && !recurringTotalDiv.classList.contains('hidden')) {
            formData.append('recurringTotal', parseFloat(recurringTotalSpan.textContent.replace('$', '')) || 0);
        }

        // --- Additional Services ---
        const selectedAddServices = Array.from(addServices)
            .filter(s => s.classList.contains('selected'))
            .map(s => {
                const label = s.querySelector('span.font-bold')?.textContent || '';
                const qty = parseInt(s.dataset.quantity || '1');
                const price = parseFloat(s.dataset.price) || 0;
                return `${label} × ${qty} ($${price * qty})`;
            })
            .join(', ');
        formData.append('additionalServices', selectedAddServices);
        
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

            // Reset form
            bookingForm.reset();

            // Reset all selections
            homeTypes.forEach(t => t.classList.remove('selected', 'border-4', 'border-blue-500', 'border-pink-500', 'border-green-500'));
            paymentOptions.forEach(o => o.classList.remove('bg-blue-200', 'border-blue-500', 'font-semibold'));
            frequencyButtons.forEach(b => b.classList.remove('selected', 'bg-blue-100'));
            
            // Reset additional services
            addServices.forEach(service => {
                service.classList.remove('selected');
                service.dataset.quantity = 0;
                const qty = service.querySelector('.quantity');
                if (qty) qty.textContent = '0';
                const controls = service.querySelector('.flex.items-center.gap-4');
                if (controls) controls.style.display = 'none';
            });
            
            // Reset no clean rooms
            additionalServices.forEach(service => {
                service.classList.remove('selected', 'ring-4', 'ring-blue-400', 'bg-blue-50');
                const qty = service.querySelector('.quantity');
                if (qty) qty.textContent = '0';
            });
            if (noCleanCheckbox) noCleanCheckbox.checked = false;
            noCleanRooms.classList.add('hidden');

            // Reset summary display
            if (summaryService) summaryService.textContent = '-';
            if (summaryHomeType) summaryHomeType.textContent = '-';
            if (summaryTotal) summaryTotal.textContent = '$0.00';
            if (summaryPayment) summaryPayment.textContent = 'Payment Method: -';
            if (summaryTip) summaryTip.textContent = 'Tip: -';
            if (summaryDate) summaryDate.textContent = '-';
            
            // Hide summary sections
            if (homeTypeSummaryDiv) homeTypeSummaryDiv.classList.add('hidden');
            if (packageSummaryDiv) packageSummaryDiv.classList.add('hidden');
            if (fullDiv) fullDiv.classList.add('hidden');
            if (halfDiv) halfDiv.classList.add('hidden');
            if (recurringTotalDiv) recurringTotalDiv.classList.add('hidden');
            
            // Reset package dropdown
            packageDiv.style.display = 'none';
            
            // Reset prices
            fullBathroomPrice = 0;
            halfBathroomPrice = 0;
            packagePrice = 0;
            selectedTip = 0;
            selectedDiscount = 0;
            window.noCleanTotal = 0;
            window.addServicesTotal = 0;
            
            // Remove dynamic summaries
            removeNoCleanSummary();
            removeAddServicesSummary();
            
            // Remove e-transfer note if exists
            const eTransferNote = document.getElementById('eTransferNote');
            if (eTransferNote) eTransferNote.remove();

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