<script setup>
import { ref, computed } from 'vue'

// 🚀 ДИНАМИЧЕСКИЙ ЗАПРОС: вытягиваем данные с нашего нового эндпоинта
// По умолчанию продукты придут в переменной data. Мы переименуем её в products для удобства.
const { data: products, error } = await useFetch('/api/products')

// Текущая выбранная категория для фильтрации ('all', 'tires', 'wheels')
const currentCategory = ref('all')

// Фильтруем товары на лету в зависимости от выбранной категории
const filteredProducts = computed(() => {
  if (currentCategory.value === 'all') return products.value
  return products.value.filter(p => p.category === currentCategory.value)
})
</script>

<template>
  <div class="w-full">
    <!-- Заголовок страницы -->
    <h1 class="text-lg font-bold bg-black/90 text-white p-2 px-5 tracking-wide uppercase text-sm">
      Каталог товаров
    </h1>

    <!-- 🎛 Панель фильтров (кнопки переключения) -->
    <div class="flex gap-4 my-6 border-b border-gray-400 pb-3 text-xs font-bold uppercase tracking-wider">
      <button 
        @click="currentCategory = 'all'"
        :class="currentCategory === 'all' ? 'border-b-2 border-black pb-3 -mb-[14px]' : 'text-gray-500 hover:text-black transition-colors'"
        class="cursor-pointer"
      >
        Все товары
      </button>
      <button 
        @click="currentCategory = 'tires'"
        :class="currentCategory === 'tires' ? 'border-b-2 border-black pb-3 -mb-[14px]' : 'text-gray-500 hover:text-black transition-colors'"
        class="cursor-pointer"
      >
        Шины
      </button>
      <button 
        @click="currentCategory = 'wheels'"
        :class="currentCategory === 'wheels' ? 'border-b-2 border-black pb-3 -mb-[14px]' : 'text-gray-500 hover:text-black transition-colors'"
        class="cursor-pointer"
      >
        Диски
      </button>
    </div>

    <!-- 🛒 Grid-сетка товаров: 2 колонки на мобильных, 4 на больших экранах -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <NuxtLink 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :to="`/catalog/${product.id}`" 
        class="border border-gray-400 bg-white flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <!-- Блок изображения товара -->
        <div class="relative w-full h-[160px] md:h-[240px] overflow-hidden bg-gray-100 border-b border-gray-400">
          <!-- Защита от выделения и переноса картинок -->
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-full object-cover select-none pointer-events-none grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>

        <!-- Информация о товаре -->
        <div class="p-3 flex flex-col flex-grow justify-between gap-3 text-left">
          <div>
            <h3 class="font-bold text-sm text-black tracking-wide line-clamp-2 uppercase min-h-[40px]">
              {{ product.name }}
            </h3>
          </div>
          
          <div class="flex flex-col gap-2">
            <span class="text-base font-black text-black">
              {{ product.price }}
            </span>
            
            <!-- Строгая черная кнопка в стиле сайта -->
            <button class="w-full bg-black/90 text-white py-2 font-bold uppercase tracking-wider text-[10px] hover:bg-black transition-colors cursor-pointer rounded-xs">
              В корзину
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
