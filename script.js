// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
    
    // Toast notification function
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };
    
    // Simulate loading for demo purposes
    const loadingElements = document.querySelectorAll('[data-loading]');
    loadingElements.forEach(el => {
        el.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const spinner = document.createElement('div');
                spinner.className = 'spinner mx-auto my-4';
                this.parentNode.appendChild(spinner);
                this.disabled = true;
                
                setTimeout(() => {
                    spinner.remove();
                    this.disabled = false;
                    showToast('Action completed successfully!');
                }, 1500);
            }
        });
    });
});

// Data bundle modal logic
let selectedNetwork = null;
let selectedOffer = null;
let phoneNumber = null;

function openNetworkModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('networkModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    showStep('network');
}

function closeNetworkModal() {
    const modal = document.getElementById('networkModal');
    if (!modal) return;
    modal.classList.add('hidden');
    resetModalState();
}

function resetModalState() {
    selectedNetwork = null;
    selectedOffer = null;
    phoneNumber = null;
    const offersContainer = document.getElementById('offersContainer');
    if (offersContainer) offersContainer.innerHTML = '';
    const continueBtn = document.getElementById('continueToPayment');
    if (continueBtn) continueBtn.disabled = true;
    updateSummary();
}

function showStep(step) {
    const networkStep = document.getElementById('networkStep');
    const offersStep = document.getElementById('offersStep');
    const paymentStep = document.getElementById('paymentStep');
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) phoneInput.value = '';
    phoneNumber = '';
    

    if (networkStep && offersStep && paymentStep) {
        networkStep.classList.toggle('hidden', step !== 'network');
        offersStep.classList.toggle('hidden', step !== 'offers');
        paymentStep.classList.toggle('hidden', step !== 'payment');
    }

    const step1 = document.getElementById('step1Pill');
    const step2 = document.getElementById('step2Pill');
    const step3 = document.getElementById('step3Pill');
    if (step1 && step2 && step3) {
        step1.className = `px-2 py-1 rounded-full ${step === 'network' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`;
        step2.className = `px-2 py-1 rounded-full ${step === 'offers' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`;
        step3.className = `px-2 py-1 rounded-full ${step === 'payment' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`;
    }
}

async function loadOffers(network) {
    const offersContainer = document.getElementById('offersContainer');
    if (!offersContainer) return;
    offersContainer.innerHTML = '<div class="text-sm text-gray-500 dark:text-gray-300">Loading offers...</div>';

    try {
        const response = await fetch(`api/get-offers.php?network=${encodeURIComponent(network)}`);
        const data = await response.json();

        if (!data.offers || data.offers.length === 0) {
            offersContainer.innerHTML = '<div class="text-sm text-gray-500 dark:text-gray-300">No offers available for this network.</div>';
            return;
        }

        offersContainer.innerHTML = '';
        data.offers.forEach((offer, index) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'w-full text-left p-4 border rounded-xl bg-gray-100 dark:bg-gray-700 hover:border-blue-400 transition';
            card.dataset.offer = offer.offer;
            card.dataset.price = offer.price;
            card.innerHTML = `
                <p class="text-lg font-semibold text-gray-800 dark:text-white">${offer.offer}</p>
                <p class="text-gray-600 dark:text-gray-300">Price: ${offer.price}</p>
            `;
            card.addEventListener('click', () => selectOffer(card));
            offersContainer.appendChild(card);
        });

        if (data.offers.length > 0) {
            const first = offersContainer.querySelector('button');
            if (first) selectOffer(first, true);
        }
    } catch (e) {
        offersContainer.innerHTML = '<div class="text-sm text-red-500">Failed to load offers. Please try again.</div>';
    }
}

function selectOffer(button, silent = false) {
    const offersContainer = document.getElementById('offersContainer');
    if (!offersContainer) return;
    offersContainer.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('border-blue-500', 'ring-2', 'ring-blue-300');
    });
    button.classList.add('border-blue-500', 'ring-2', 'ring-blue-300');

    selectedOffer = {
        offer: button.dataset.offer,
        price: button.dataset.price
    };
    const continueBtn = document.getElementById('continueToPayment');
    if (continueBtn) continueBtn.disabled = false;
    updateSummary();

    if (!silent && typeof showToast === 'function') {
        showToast('Offer selected');
    }
}

function updateSummary() {
    const summaryNetwork = document.getElementById('summaryNetwork');
    const summaryOffer = document.getElementById('summaryOffer');
    const summaryPrice = document.getElementById('summaryPrice');
    if (summaryNetwork) summaryNetwork.textContent = `Network: ${selectedNetwork || '-'}`;
    if (summaryOffer) summaryOffer.textContent = `Offer: ${selectedOffer?.offer || '-'}`;
    if (summaryPrice) summaryPrice.textContent = `Price: ${selectedOffer?.price || '-'}`;
}

function backToNetworks() {
    showStep('network');
}

function backToOffers() {
    showStep('offers');
}

document.addEventListener('click', (event) => {
    const networkButton = event.target.closest('[data-network]');
    if (networkButton) {
        selectedNetwork = networkButton.dataset.network;
        updateSummary();
        showStep('offers');
        loadOffers(selectedNetwork);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const continueBtn = document.getElementById('continueToPayment');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (!selectedOffer) return;
            showStep('payment');
            updatePaymentButton();
        });
    }

    const proceedBtn = document.getElementById('proceedPayment');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', async () => {
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const emailReference = document.getElementById('emailReference').value.trim();
            
            if (!phoneNumber || !emailReference) {
                if (typeof showToast === 'function') {
                    showToast('Please enter all required fields', 'error');
                }
                return;
            }

            if (typeof showToast === 'function') {
                showToast('Processing payment...');
            }

            // Prepare data for storage
            const paymentData = {
                network: selectedNetwork,
                price: selectedOffer.price,
                data: selectedOffer.offer,
                contact: phoneNumber,
                email: emailReference,
                status: 0
            };

            try {
                // Store in catalog table
                const response = await fetch('api/store-catalog.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                });

                const result = await response.json();
                
                console.log('Server response:', result); // Debug log
                
                if (result.success) {
                    // Initialize Paystack payment
                    initiatePaystackPayment(emailReference, selectedOffer.price, result.cidId, paymentData);
                } else {
                    console.error('Error from server:', result.message); // Debug log
                    if (typeof showToast === 'function') {
                        showToast(result.message || 'Failed to process request', 'error');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (typeof showToast === 'function') {
                    showToast('An error occurred: ' + error.message, 'error');
                }
            }
        });
    }

    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', updatePaymentButton);
    }

    const emailInput = document.getElementById('emailReference');
    if (emailInput) {
        emailInput.addEventListener('input', updatePaymentButton);
    }
});

function updatePaymentButton() {
    const proceedBtn = document.getElementById('proceedPayment');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailReference');
    if (proceedBtn && phoneInput && emailInput) {
        proceedBtn.disabled = !phoneInput.value.trim() || !emailInput.value.trim();
    }
}

function initiatePaystackPayment(email, amount, cidId, paymentData) {
    if (typeof PaystackPop === 'undefined' || !PaystackPop.setup) {
        if (typeof showToast === 'function') {
            showToast('Paystack script not loaded', 'error');
        }
        return;
    }
    // Extract numeric value from price string (e.g., "GHS 10.00" -> 1000 in pesewas)
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    const amountInPesewas = Math.round(numericAmount * 100);

    const publicKeyMeta = document.querySelector('meta[name="paystack-public-key"]');
    const publicKey = publicKeyMeta ? publicKeyMeta.getAttribute('content') : '';
    if (!publicKey || publicKey.includes('YOUR_PAYSTACK_PUBLIC_KEY')) {
        if (typeof showToast === 'function') {
            showToast('Paystack public key is missing', 'error');
        }
        return;
    }

    const paystackRef = 'CID_' + cidId + '_' + Math.floor((Math.random() * 1000000000) + 1);

    const handler = PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amountInPesewas,
        currency: 'GHS',
        ref: paystackRef,
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer ID",
                    variable_name: "cid_id",
                    value: cidId
                },
                {
                    display_name: "Network",
                    variable_name: "network",
                    value: paymentData.network
                },
                {
                    display_name: "Data Bundle",
                    variable_name: "data",
                    value: paymentData.data
                },
                {
                    display_name: "Phone Number",
                    variable_name: "contact",
                    value: paymentData.contact
                }
            ]
        },
        callback: function(response) {
            console.log('Paystack callback response:', response);
            console.log('cidId:', cidId, 'fallbackRef:', paystackRef);
            handlePaystackCallback(response, cidId, paystackRef);
        },
        onClose: function() {
            if (typeof showToast === 'function') {
                showToast('Payment window closed', 'error');
            }
        }
    });
    handler.openIframe();
}

async function handlePaystackCallback(response, cidId, fallbackRef = '') {
    try {
        const reference = response && (response.reference || response.trxref) ? (response.reference || response.trxref) : fallbackRef;
        const cidValue = Number(cidId);
        if (!reference || !Number.isFinite(cidValue) || cidValue <= 0) {
            if (typeof showToast === 'function') {
                showToast('Missing payment reference or order ID', 'error');
            }
            return;
        }
        const verifyResponse = await fetch('api/verify-payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reference: reference,
                cidId: cidValue
            })
        });
        const verifyResult = await verifyResponse.json();

        if (verifyResult.success) {
            if (typeof showToast === 'function') {
                showToast('Payment verified successfully');
            }
            closeNetworkModal();
        } else {
            if (typeof showToast === 'function') {
                showToast(verifyResult.message || 'Payment verification failed', 'error');
            }
        }
    } catch (error) {
        if (typeof showToast === 'function') {
            showToast('Verification error: ' + error.message, 'error');
        }
    }
}

// Form validation example
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields', 'error');
    }
    
    return isValid;
}