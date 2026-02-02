class CustomServiceCard extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Service';
        const description = this.getAttribute('description') || 'Description not available';
        const icon = this.getAttribute('icon') || 'box';
        const gradient = this.getAttribute('gradient') || 'from-blue-500 to-indigo-600';
        const link = this.getAttribute('link') || '#';

        this.innerHTML = `
            <a href="${link}" 
               class="group block rounded-2xl bg-white dark:bg-gray-800 shadow-md 
                      transition-all duration-300 active:scale-95 
                      hover:-translate-y-1 hover:shadow-2xl">

                <div class="p-5 sm:p-6">
                    
                    <!-- ICON -->
                    <div class="mb-4">
                        <div class="w-40 h-40 rounded-xl 
                                                                      
                                    transition-transform duration-300 
                                    group-hover:rotate-6 group-hover:scale-110">
                            <i class="w-6 h-6"><img src="./components/${icon}" alt="${title} Icon" width="fit-content" height="100%"></i>
                        </div>
                    </div>

                    <!-- CONTENT -->
                    <h3 class="text-lg sm:text-xl font-semibold 
                               text-gray-900 dark:text-white mb-1">
                        ${title}
                    </h3>

                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        ${description}
                    </p>

                    <!-- CTA -->
                    <div class="mt-5 flex items-center justify-between">
                        <span class="text-sm font-medium 
                                     text-blue-600 dark:text-blue-400 
                                     group-hover:underline">
                            Subscribe now
                        </span>

                        <span class="w-8 h-8 rounded-full 
                                     bg-gray-100 dark:bg-gray-700 
                                     flex items-center justify-center 
                                     transition-all duration-300 
                                     group-hover:bg-blue-600 group-hover:text-white">
                            <i data-feather="arrow-right" class="w-4 h-4"></i>
                        </span>
                    </div>
                </div>

                <!-- GRADIENT GLOW -->
                <div class="absolute inset-0 rounded-2xl opacity-0 
                            group-hover:opacity-100 transition-opacity 
                            bg-gradient-to-br ${gradient} blur-2xl -z-10"></div>
            </a>
        `;

        feather.replace();
    }
}

customElements.define('custom-service-card', CustomServiceCard);
