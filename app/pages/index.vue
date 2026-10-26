<template>
  <!-- Обертка для картинки. max-w ограничивает ширину, mx-auto центрирует -->
  <div>

    <!-- Блок Интересный факт -->
    <section>
      <h1 class="text-lg md:text-xl p-2 px-5 bg-black/90 text-white font-bold">
        Интересный факт
      </h1>
      <!-- Блок с картинкой и текстом -->
      <div class="relative w-full overflow-hidden group">
        <img 
          src="/images/formula-e.jpg" 
          alt="Гоночная машина" 
          class="w-full h-[300px] md:h-[400px] object-cover select-none pointer-events-none" 
        />

        <!-- Текст в правом нижнем углу -->
        <div class="absolute bottom-4 left-4 right-4 md:bottom-4 md:left-4 md:right-4 ">
          <p class="text-white text-sm md:text-base font-bold tracking-wider bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm">
            Компания Michelin была официальным эксклюзивным поставщиком шин Michelin Pilot Sport EV для чемпионата мира по гонкам электромобилей Formula E        </p>
        </div>
      </div>
    </section>

    <!-- Почему мы -->
    <section class="mt-8 border border-gray-400">
      <div class="text-white bg-black/90 p-2 px-5">
          <h2 class="text-lg md:text-xl font-bold">
            Почему мы ?
          </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 p-5 gap-6">

        <!-- Блок 1 Доставка из других стран -->
        <div class="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <img 
              src="/images/globe.svg" 
              alt="Globe"
              class="w-12 h-12 flex-shrink-0 opacity-80"
          >
          </div>
          <p class="text-sm md:text-lg text-gray-800 leading-relaxed ml-5">
            Доставка премиум товаров для машин прямиком из Европы и других зарубежных стран. 
          </p>
        </div>

        <!-- Карточка 2 -->
        <div class="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="flex-shrink-0 flex items-center justify-center">
            <img 
              src="/images/delivery.svg" 
              alt="Delivery"
              class="w-12 h-12 object-contain"
            >
          </div>
          <p class="text-sm md:text-lg text-gray-800 leading-relaxed ml-5">
            Быстрая отправка в любую точку мира.
          </p>
        </div>
      </div>

    </section>

        <!-- Блок Наши партнеры -->
    <section class="mt-8 border border-gray-200 overflow-hidden bg-white shadow-sm">
      <!-- Заголовок -->
      <div class="text-white bg-[#1a1a1a] p-3 px-6">
        <h3 class="text-lg md:text-xl font-bold">
          Наши партнеры
        </h3>
      </div>
      
      <!-- Сетка логотипов -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center p-6 md:p-8">
        
        <!-- Карточка 1: Michelin -->
        <div class="h-16 md:h-20 w-full flex items-center justify-center px-2">
          <img 
            src="/images/michelin-logo.svg" 
            alt="Michelin" 
            class="max-h-full w-auto object-contain mx-auto select-none pointer-events-none" 
          />
        </div>
        
        <!-- Карточка 2: Bridgestone -->
        <div class="h-16 md:h-20 w-full flex items-center justify-center px-2">
          <img 
            src="/images/bridgestone-logo.svg" 
            alt="Bridgestone" 
            class="max-h-full w-auto object-contain mx-auto select-none pointer-events-none" 
          />
        </div>
        
        <!-- Карточка 3: Goodyear -->
        <div class="h-25 md:h-35 w-full flex items-center justify-center px-2">
          <img 
            src="/images/goodyear-logo.svg" 
            alt="Goodyear" 
            class="max-h-full w-auto object-contain mx-auto select-none pointer-events-none" 
          />
        </div>
        
        <!-- Карточка 4: Continental -->
        <div class="h-16 md:h-20 w-full flex items-center justify-center px-2">
          <img 
            src="/images/continental-logo.svg" 
            alt="Continental" 
            class="max-h-full w-auto object-contain mx-auto select-none pointer-events-none" 
          />
        </div>

      </div>
    </section>
  </div>
</template>