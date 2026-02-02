<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


include 'components/dbcon.php';
include 'components/paystack.php';


?>

<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AFICANBOY DEALS - Digital Marketplace</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="components/navbar.js"></script>
    <script src="components/footer.js"></script>
    <script src="components/service-card.js"></script>
    <script src="components/testimonial-card.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <meta name="paystack-public-key" content="<?php echo htmlspecialchars($PAYSTACK_PUBLIC_KEY); ?>">

</head>
<body class="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <custom-navbar></custom-navbar>

    <!-- Hero Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-10 md:mb-0">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6">Your Digital Lifestyle, Simplified</h1>
                    <p class="text-xl mb-8">Buy mobile data bundles and subscribe to digital services in Ghana with just a few taps.</p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="#" onclick="openNetworkModal(event)" class="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-center transition-all duration-300 transform hover:scale-105">Buy Data Now</a>
                        <a href="subscriptions.html" class="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium text-center transition-all duration-300 transform hover:scale-105">Explore Subscriptions</a>
                    </div>

    <!-- Network & Offers Modal -->
    <div id="networkModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl">
            <div class="flex items-start justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Buy Data Bundles</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-300">Select network, choose offer, then proceed to payment.</p>
                </div>
                <button type="button" onclick="closeNetworkModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    ✕
                </button>
            </div>

            <div class="mb-6">
                <div class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300">
                    <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700" id="step1Pill">1. Network</span>
                    <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" id="step2Pill">2. Offer</span>
                    <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" id="step3Pill">3. Payment</span>
                </div>
            </div>

            <!-- Step 1: Network -->
            <div id="networkStep" class="space-y-3">
                <button type="button" class="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl transition" data-network="MTN">MTN Ghana</button>
                <button type="button" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition" data-network="Telecel">Telecel Ghana</button>
                <button type="button" class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition" data-network="AirtelTigo">AirtelTigo Ghana</button>
            </div>

            <!-- Step 2: Offers -->
            <div id="offersStep" class="hidden">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Available Offers</h3>
                    <button type="button" onclick="backToNetworks()" class="text-sm text-blue-600 hover:underline">Change network</button>
                </div>
                <div id="offersContainer" class="space-y-3 max-h-64 overflow-y-auto pr-1"></div>
                <button type="button" id="continueToPayment" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50" disabled>Continue to Payment</button>
            </div>

            <!-- Step 3: Payment -->
            <div id="paymentStep" class="hidden">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Summary</p>
                    <p class="text-gray-800 dark:text-white font-semibold" id="summaryNetwork">Network: -</p>
                    <p class="text-gray-800 dark:text-white font-semibold" id="summaryOffer">Offer: -</p>
                    <p class="text-gray-800 dark:text-white font-semibold" id="summaryPrice">Price: -</p>
                </div>
                <div class="mb-4">
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input type="tel" id="phoneNumber" minlength="10" maxlength="10" placeholder="Enter your phone number" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">The offer will be sent to this number</p>
                </div>
                <div class="mb-4">
                    <label for="emailReference" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Reference</label>
                    <input type="email" id="emailReference" placeholder="Enter your email" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">This email will be used for payment reference</p>
                </div>
                <button type="button" id="proceedPayment" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50" disabled>Proceed to Payment</button>
                <button type="button" onclick="backToOffers()" class="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-xl transition">Back</button>
            </div>
        </div>
    </div>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <img src="http://static.photos/technology/640x360/1" alt="Digital services illustration" class="rounded-xl shadow-2xl w-full max-w-md">
                </div>
            </div>
        </div>
    </section> 

    <!-- Networks Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Supported Networks</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col items-center">
                    <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                        <i  class="text-white w-12 h-12"><img src="./components/New-mtn-logo.jpg" alt="MTN-Logo"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">MTN Ghana</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-center">Fastest and most reliable network in Ghana</p>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col items-center">
                    <div class="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-4">
                        <i  class="text-white w-12 h-12"> <img src="./components/yh.png" alt="Telecel-Logo"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Telecel Ghana</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-center">Affordable data plans for everyone</p>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col items-center">
                    <div class="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-4">
                        <i  class="text-white w-12 h-12"><img src="./components/OIP.png" alt="Tigo-Logo"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Tigo Ghana</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-center">Great coverage across the country</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Popular Services -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Popular Digital Services</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <custom-service-card 
                    title="Netflix" 
                    description="Unlimited movies, TV shows, and more."
                    icon="Netflix-Logo.png"
                    color="bg-red-500"
                    link="subscriptions.html#netflix"
                ></custom-service-card>
                
                <custom-service-card 
                    title="Showmax" 
                    description="African and international entertainment."
                    icon="ShowMax.webp"
                    color="bg-purple-500"
                    link="subscriptions.html#showmax"
                ></custom-service-card>
                
                <custom-service-card 
                    title="Prime Video" 
                    description="Unlimited movies, TV shows, and more."
                    icon="th.webp"
                    color="bg-blue-500"
                    link="subscriptions.html#prime-video"
                ></custom-service-card>
                <custom-service-card 
                    title="Apple Music" 
                    description="70 million songs. Zero ads."
                    icon="Apple.png"
                    color="bg-pink-500"
                    link="subscriptions.html#apple-music"
                ></custom-service-card>
                <custom-service-card 
                    title="Spotify" 
                    description="Music for every mood and moment."
                    icon="Spotify.png"
                    color="bg-green-500"
                    link="subscriptions.html#spotify"
                ></custom-service-card>
                <custom-service-card 
                    title="Snapchat+" 
                    description="Enjoy Snapchat Plus features."
                    icon="Snap-plus.png"
                    color="bg-pink-500"
                    link="subscriptions.html#snapchat-plus"
                ></custom-service-card>
                <custom-service-card 
                    title="Icloud Storage Upgrade" 
                    description="More space for your photos and files."
                    icon="at5_icloud.png"
                    color="bg-pink-500"
                    link="subscriptions.html#icloud-storage-upgrade"
                ></custom-service-card>
                <custom-service-card 
                    title="E-Sim" 
                    description="Get connected with an e-SIM for verifications and more."
                    icon="esim.png"
                    color="bg-pink-500"
                    link="subscriptions.html#e-sim"
                ></custom-service-card>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">What Our Customers Say</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <custom-testimonial-card 
                    name="Kwame Mensah" 
                    role="Student"
                    quote="The fastest way to buy data bundles in Ghana. I use it every week!"
                    avatar="http://static.photos/people/200x200/1"
                ></custom-testimonial-card>
                
                <custom-testimonial-card 
                    name="Ama Serwaa" 
                    role="Entrepreneur"
                    quote="Subscribing to Netflix has never been easier. Great service!"
                    avatar="http://static.photos/people/200x200/2"
                ></custom-testimonial-card>
                
                <custom-testimonial-card 
                    name="Yaw Boateng" 
                    role="Developer"
                    quote="Reliable and instant delivery of data bundles. Highly recommended."
                    avatar="http://static.photos/people/200x200/3"
                ></custom-testimonial-card>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
  <!--  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div class="max-w-7xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p class="text-xl mb-8 max-w-3xl mx-auto">Join thousands of Ghanaians enjoying seamless digital services.</p>
            <a href="register.html" class="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105">Create Account Now</a>
        </div>
    </section>-->

    <custom-footer></custom-footer>

    <script>
        feather.replace();
    </script>
    <script src="script.js"></script>
</body>
</html>