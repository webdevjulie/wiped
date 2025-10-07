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

  let bedroomPrice = 0;
  let bathroomPrice = 0;
  let selectedTip = 0;

  // --- Home Type ---
  homeTypes.forEach(type => {
    type.addEventListener('click', () => {
      const isSelected = type.classList.contains('selected');

      // Remove selection from all
      homeTypes.forEach(t => t.classList.remove('selected', 'border-4', 'border-blue-500', 'border-pink-500', 'border-green-500'));

      if (!isSelected) {
        type.classList.add('selected', 'border-4', 'border-blue-500'); // Example color
        bedroomSelect.removeAttribute('disabled');
        bathroomSelect.removeAttribute('disabled');
        summaryHomeType.textContent = type.dataset.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
      } else {
        bedroomSelect.setAttribute('disabled', true);
        bathroomSelect.setAttribute('disabled', true);
        bedroomSelect.value = '';
        bathroomSelect.value = '';
        bedroomPrice = 0;
        bathroomPrice = 0;
        summaryHomeType.textContent = '-';
      }
      updateSummary();
    });
  });

  // --- Bedroom & Bathroom ---
  bedroomSelect.addEventListener('change', () => {
    const bedrooms = parseInt(bedroomSelect.value) || 0;
    bedroomPrice = bedrooms * 20; // 20 per bedroom
    updateSummary();
  });

  bathroomSelect.addEventListener('change', () => {
    const bathrooms = parseFloat(bathroomSelect.value) || 0;
    const fullBathrooms = Math.floor(bathrooms);
    const halfBathroom = bathrooms % 1 === 0.5 ? 10 : 0;
    bathroomPrice = fullBathrooms * 20 + halfBathroom;
    updateSummary();
  });

  // --- Service Type ---
  serviceType.addEventListener('change', () => {
    summaryService.textContent = serviceType.options[serviceType.selectedIndex].text;
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
      // Remove highlight
      paymentOptions.forEach(o => o.classList.remove('bg-blue-200', 'border-blue-500', 'font-semibold'));
      option.classList.add('bg-blue-200', 'border-blue-500', 'font-semibold');

      // Update summary only
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
    summaryBedroomPrice.textContent = `$${bedroomPrice.toFixed(2)}`;
    summaryBathroomPrice.textContent = `$${bathroomPrice.toFixed(2)}`;

    let subtotal = bedroomPrice + bathroomPrice;
    let tipAmount = subtotal * (selectedTip / 100);
    let total = subtotal + tipAmount;

    summaryTotal.textContent = `$${total.toFixed(2)}`;
  }