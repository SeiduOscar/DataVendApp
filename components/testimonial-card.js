class CustomTestimonialCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name') || 'Anonymous';
        const role = this.getAttribute('role') || 'Customer';
        const quote = this.getAttribute('quote') || 'Great service!';
        const avatar = this.getAttribute('avatar') || 'https://i.pravatar.cc/100';

        this.innerHTML = `
            <div class="group relative h-full rounded-2xl 
                        bg-white dark:bg-gray-800 
                        p-5 sm:p-6 
                        shadow-md hover:shadow-2xl 
                        transition-all duration-300 
                        hover:-translate-y-1 active:scale-95">

                <!-- Gradient Glow -->
                <div class="absolute inset-0 rounded-2xl 
                            bg-gradient-to-br from-blue-500/20 to-purple-600/20 
                            opacity-0 group-hover:opacity-100 
                            blur-2xl transition-opacity -z-10"></div>

                <!-- Quote -->
                <div class="relative mb-6">
                    <i data-feather="message-square" 
                       class="absolute -top-3 -left-3 w-14 h-14 
                              text-blue-500/20 
                              group-hover:text-blue-500/40 
                              transition-all"></i>

                    <p class="relative z-10 text-sm sm:text-base 
                              text-gray-700 dark:text-gray-300 
                              leading-relaxed">
                        “${quote}”
                    </p>
                </div>

                <!-- Footer -->
                <div class="flex items-center gap-4">
                    <img src="${avatar}" alt="${name}"
                         class="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30">

                    <div class="flex-1">
                        <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            ${name}
                        </h4>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            ${role}
                        </p>
                    </div>

                    <!-- Stars -->
                    <div class="flex text-yellow-400">
                        <i data-feather="star" class="w-4 h-4 fill-current"></i>
                        <i data-feather="star" class="w-4 h-4 fill-current"></i>
                        <i data-feather="star" class="w-4 h-4 fill-current"></i>
                        <i data-feather="star" class="w-4 h-4 fill-current"></i>
                        <i data-feather="star" class="w-4 h-4 fill-current"></i>
                    </div>
                </div>
            </div>
        `;

        feather.replace();
    }
}

customElements.define('custom-testimonial-card', CustomTestimonialCard);
