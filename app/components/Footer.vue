<template>
    <footer class="w-full mt-12">
        <!-- Верхняя часть подвала (Черная, как плашки заголовков) -->
        <div class="bg-[#1a1a1a] text-white">
            <div class="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
 
            <!-- Колонка 1: О магазине -->
            <div>
                <img 
                    src="/logo.svg" 
                    alt="TRacing" 
                    class="h-6 md:h-7 w-auto select-none pointer-events-none invert" 
                />
                <p class="text-gray-400 mt-3 text-sm leading-relaxed">
                Премиальные товары для вашего автомобиля. Прямые поставки из Европы и других стран. Официальный партнер мировых брендов.
                </p>
            </div>

            <!-- Колонка 2: Навигация -->
            <div>
                <h3 class="text-base md:text-lg font-bold mb-4 uppercase tracking-wider">Навигация</h3>
                <ul class="space-y-2 text-gray-400 text-sm">
                <li><NuxtLink to="/" class="hover:text-white transition-colors duration-200 cursor-pointer">Главная</NuxtLink></li>
                <li><NuxtLink to="/catalog" class="hover:text-white transition-colors duration-200 cursor-pointer">Каталог</NuxtLink></li>
                <li><NuxtLink to="/order" class="hover:text-white transition-colors duration-200 cursor-pointer">Оставить заявку</NuxtLink></li>
                </ul>
            </div>

            <!-- Колонка 3: Контакты -->
            <div>
                <h3 class="text-base md:text-lg font-bold mb-4 uppercase tracking-wider">Контакты</h3>
                <ul class="space-y-3 text-gray-400 text-sm">
                <li class="flex items-center">
                    <!-- Иконка телефона (SVG) -->
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <p>+7 (800) 555-35-35</p>
                </li>
                <li class="flex items-center">
                    <!-- Иконка почты (SVG) -->
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <p>info@tracing.ru</p>
                </li>
                </ul>
            </div>

            </div>
        </div>

        <!-- Нижняя часть подвала (Белая, как карточки) -->
        <div class="bg-white border-t border-gray-200">
            <div class="max-w-7xl mx-auto px-5 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 TRacing. Все права защищены.</p>
            <div class="mt-4 md:mt-0 flex space-x-6">
                <a href="#" class="hover:text-gray-900 transition-colors">Политика конфиденциальности</a>
                <a href="#" class="hover:text-gray-900 transition-colors">Публичная оферта</a>
            </div>
            </div>
        </div>
    </footer>   
</template>