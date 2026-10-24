<template>
  <!-- Обертка для картинки. max-w ограничивает ширину, mx-auto центрирует -->
  <div>

    <!-- Блок Интересный факт -->
    <section>
      <h1 class="text-xl p-2 px-5 bg-black/90 text-white font-bold">
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
          <p class="text-white text-xs md:text-base font-bold tracking-wider bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm">
            Компания Michelin была официальным эксклюзивным поставщиком шин Michelin Pilot Sport EV для чемпионата мира по гонкам электромобилей Formula E        </p>
        </div>
      </div>
    </section>

    <!-- Блок Бестселлеры -->
    <section class="mt-5 ">
      <div class="text-white bg-black/90 p-2 px-5">
          <h2 class="text-xl font-bold">
            Бестселлеры
          </h2>
      </div>
    </section>

    <!--Блок Наши партнеры -->
    <section class="mt-5 border border-gray-400">
      <div class="text-white bg-black/90 p-2 px-5">
        <h3 class="text-xl font-bold">
          Наши партнеры
        </h3>
      </div>
      <div class="flex justify-center items-center md:gap-8 lg:gap-18">
        <img 
          src="/images/michelin-logo.svg" 
          alt="Michelin" 
          class="md:h-20 lg:h-24 w-auto select-none pointer-events-none" 
        />
        <img 
          src="/images/bridgestone-logo.svg" 
          alt="Bridgestone" 
          class="md:h-5 lg:h-7 w-auto select-none pointer-events-none" 
        />
        <img 
          src="/images/goodyear-logo.svg" 
          alt="Goodyear" 
          class="md:h-36 lg:h-40 w-auto select-none pointer-events-none" 
        />
        <img 
          src="/images/continental-logo.svg" 
          alt="Continental" 
          class="md:h-8 lg:h-9 w-auto select-none pointer-events-none" 
        />
      </div>
    </section>
  </div>
</template>