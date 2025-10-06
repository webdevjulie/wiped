// Elements
const serviceType = document.getElementById('serviceType');
const packageDiv = document.getElementById('packageDiv');
const packageSelect = document.getElementById('packageSelect');

const summaryService = document.querySelector('#summary-service');
const summaryPackage = document.querySelector('#summary-package');
const summaryBase = document.querySelector('#summary-base');
const summaryTotal = document.querySelector('#summary-total');
const summaryPayment = document.querySelector('#summary-payment'); // Optional: in your order summary

// Packages & prices
const packages = {
  "care-clean": { "Studio/1 Bedroom": 145, "2 Bedroom": 165, "3 Bedroom": 205, "4 Bedroom": 245, "5 Bedroom": 295, "6 Bedroom": 375 },
  "deep-clean": { "Studio/1 Bedroom": 145, "2 Bedroom": 165, "3 Bedroom": 205, "4 Bedroom": 245, "5 Bedroom": 295, "6 Bedroom": 375 },
  "recurring-clean": { "Studio/1 Bedroom": 145, "2 Bedroom": 165, "3 Bedroom": 205, "4 Bedroom": 245, "5 Bedroom": 295, "6 Bedroom": 375 },
  "move-in-out-clean": { "Studio/1 Bedroom": 145, "2 Bedroom": 165, "3 Bedroom": 205, "4 Bedroom": 245, "5 Bedroom": 295, "6 Bedroom": 375 },
  "post-construction": { "Studio/1 Bedroom": 145, "2 Bedroom": 165, "3 Bedroom": 205, "4 Bedroom": 245, "5 Bedroom": 295, "6 Bedroom": 375 }
};

// Track prices
let basePrice = 0;
let additionalTotal = 0;

// --- Service Type Change ---
serviceType.addEventListener('change', () => {
  const selectedService = serviceType.value;

  summaryService.textContent = serviceType.options[serviceType.selectedIndex].text;
  summaryPackage.textContent = '-';
  basePrice = 0;
  additionalTotal = 0;
  summaryBase.textContent = '$0.00';
  summaryTotal.textContent = '$0.00';

  if (selectedService && packages[selectedService]) {
    packageSelect.innerHTML = '<option value="" disabled selected>Select a Package</option>';
    Object.keys(packages[selectedService]).forEach(pkg => {
      const option = document.createElement('option');
      option.value = pkg;
      option.textContent = `${pkg} - $${packages[selectedService][pkg]}`;
      packageSelect.appendChild(option);
    });
    packageDiv.classList.remove('hidden');
  } else {
    packageDiv.classList.add('hidden');
  }
});

// --- Package Selection ---
packageSelect.addEventListener('change', () => {
  const selectedService = serviceType.value;
  const selectedPackage = packageSelect.value;

  basePrice = packages[selectedService][selectedPackage];

  summaryPackage.textContent = selectedPackage;
  summaryBase.textContent = `$${basePrice}`;
  summaryTotal.textContent = `$${basePrice + additionalTotal}`;
});

// --- Additional Services ---
const additionalServices = document.querySelectorAll('input[type="checkbox"][data-price]');
additionalServices.forEach(service => {
  service.addEventListener('change', () => {
    additionalTotal = 0;
    additionalServices.forEach(s => {
      if (s.checked) additionalTotal += Number(s.dataset.price);
    });
    summaryTotal.textContent = `$${basePrice + additionalTotal}`;
  });
});

// --- Payment Method Selection ---
const paymentOptions = document.querySelectorAll('#paymentOptions div');
paymentOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove highlight from all
    paymentOptions.forEach(o => o.classList.remove('bg-blue-100', 'border-blue-600'));

    // Highlight selected
    option.classList.add('bg-blue-100', 'border-blue-600');

    // Store value and update summary
    const selectedPayment = option.dataset.value;
    if (summaryPayment) summaryPayment.textContent = selectedPayment;
  });
});
