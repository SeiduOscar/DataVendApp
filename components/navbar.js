class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="bg-white dark:bg-gray-800 shadow-sm py-4 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <a href="index.html" class="flex items-center space-x-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <i data-feather="zap" class="text-white"></i>
                    </div>
                    <span class="text-xl font-bold text-gray-800 dark:text-white">AFRICANBOY DEALS</span>
                </a>

                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.html" class="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all hover:after:w-full">Home</a>

                    <a href="buy-data.html" class="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all hover:after:w-full">Buy Data</a>

                    <!--<a href="subscriptions.html" class="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all hover:after:w-full">Subscriptions</a>

                    <a href="dashboard.html" class="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-current after:transition-all hover:after:w-full">Dashboard</a>-->

                    <button id="themeToggle" class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform hover:rotate-12">
                        <i data-feather="moon" class="hidden dark:block"></i>
                        <i data-feather="sun" class="dark:hidden"></i>
                    </button>

                   <!-- <div class="flex space-x-4">
                        <a href="login.html" class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Login</a>
                        <a href="register.html" class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">Register</a>
                    </div>-->
                </div>

                <button id="mobileMenuButton" class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <i data-feather="menu"></i>
                </button>
            </div>

            <div id="mobileMenu" class="hidden md:hidden mt-4 pb-4 space-y-4">
                <a href="index.html" class="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Home</a>
                <a href="buy-data.html" class="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Buy Data</a>
            <!--    <a href="subscriptions.html" class="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Subscriptions</a>
                <a href="dashboard.html" class="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>-->
            </div>
        </nav>
        `;

        const mobileMenuButton = this.querySelector('#mobileMenuButton');
        const mobileMenu = this.querySelector('#mobileMenu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden')
                ? feather.icons.menu.toSvg()
                : feather.icons.x.toSvg();
        });

        const toggleTheme = () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem(
                'theme',
                document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            );
            feather.replace();
        };

        this.querySelector('#themeToggle')?.addEventListener('click', toggleTheme);

        feather.replace();
    }
}

customElements.define('custom-navbar', CustomNavbar);
