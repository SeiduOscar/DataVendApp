class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="relative bg-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                
                <!-- Gradient Glow -->
                <div class="absolute inset-x-0 top-0 h-32 
                            bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                            blur-3xl"></div>

                <div class="relative max-w-7xl mx-auto">
                    
                    <!-- Top Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                        <!-- Brand -->
                        <div class="md:col-span-2">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-11 h-11 rounded-full 
                                            bg-gradient-to-br from-blue-500 to-purple-600 
                                            flex items-center justify-center shadow-lg">
                                    <i data-feather="zap" class="w-5 h-5"></i>
                                </div>
                                <span class="text-2xl font-bold tracking-tight">
                                    DataVend Ghana
                                </span>
                            </div>

                            <p class="text-gray-400 max-w-md mb-6">
                                Your one-stop platform for mobile data bundles and digital subscriptions across Ghana.
                            </p>

                            <!-- Socials -->
                            <div class="flex gap-4">
                                <a href="#" class="group w-10 h-10 rounded-full 
                                                  bg-gray-800 flex items-center justify-center 
                                                  hover:bg-blue-600 transition-all 
                                                  hover:-translate-y-1">
                                    <i data-feather="facebook" class="w-4 h-4"></i>
                                </a>

                                <a href="#" class="group w-10 h-10 rounded-full 
                                                  bg-gray-800 flex items-center justify-center 
                                                  hover:bg-pink-600 transition-all 
                                                  hover:-translate-y-1">
                                    <i data-feather="instagram" class="w-4 h-4"></i>
                                </a>

                                <a href="#" class="group w-10 h-10 rounded-full 
                                                  bg-gray-800 flex items-center justify-center 
                                                  hover:bg-sky-500 transition-all 
                                                  hover:-translate-y-1">
                                    <i data-feather="twitter" class="w-4 h-4"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul class="space-y-3">
                                ${this.link('Home', 'index.html')}
                                ${this.link('Buy Data', 'buy-data.html')}
                                ${this.link('Subscriptions', 'subscriptions.html')}
                                ${this.link('Dashboard', 'dashboard.html')}
                                ${this.link('About Us', 'about.html')}
                            </ul>
                        </div>

                        <!-- Support -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Support</h3>
                            <ul class="space-y-3">
                                ${this.link('Contact Us', 'contact.html')}
                                ${this.link('FAQs', 'faq.html')}
                                ${this.link('Terms of Service', 'terms.html')}
                                ${this.link('Privacy Policy', 'privacy.html')}
                            </ul>
                        </div>
                    </div>

                    <!-- Bottom -->
                    <div class="border-t border-gray-800 pt-6 
                                flex flex-col md:flex-row 
                                justify-between items-center gap-4">

                        <p class="text-gray-500 text-sm">
                            © 2025 DataVend Ghana. All rights reserved.
                        </p>

                        <div class="flex gap-6">
                            ${this.partner('MTN')}
                            ${this.partner('Telecel')}
                            ${this.partner('Tigo')}
                        </div>
                    </div>
                </div>
            </footer>
        `;

        feather.replace();
    }

    link(label, href) {
        return `
            <li>
                <a href="${href}" 
                   class="group inline-flex items-center gap-1 
                          text-gray-400 hover:text-white 
                          transition-all">
                    <span class="group-hover:translate-x-1 transition-transform">
                        ${label}
                    </span>
                </a>
            </li>
        `;
    }

    partner(name) {
        return `
            <img src="https://via.placeholder.com/80x50?text=${name}" 
                 alt="${name}" 
                 class="h-8 opacity-70 hover:opacity-100 
                        transition-opacity">
        `;
    }
}

customElements.define('custom-footer', CustomFooter);
