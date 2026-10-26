<script setup>
import { ref, computed, watch } from 'vue'

// 🚀 Получаем из БД одновременно и список товаров, и список категорий
const { data: products, error: prodError } = await useFetch('/api/products')
const { data: categories, error: catError } = await useFetch('/api/categories')

// Переменная фильтра: по умолчанию 'all' (Все), либо ID выбранной категории (число)
const currentCategory = ref('all')

// 🟢 Переменная для поиска
const searchQuery = ref('')

// 🟢 Фильтры по характеристикам
const selectedSeason = ref('all')
const selectedDiameter = ref('all')

// 🟢 Переменные для пагинации
const currentPage = ref(1)
const itemsPerPage = 6 // Сколько товаров на одной странице

// 🟢 Вычисляем, какие товары показывать на текущей странице
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// 🟢 Общее количество страниц
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

// 🟢 Сброс страницы при изменении фильтров (чтобы не было пустой страницы)
watch([searchQuery, selectedSeason, selectedDiameter, currentCategory], () => {
  currentPage.value = 1
})

// 🟢 Определяем, показывать ли фильтры по характеристикам
const showTireFilters = computed(() => {
  // Если выбрано "Все товары" — показываем фильтры (чтобы можно было фильтровать всё)
  if (currentCategory.value === 'all') return true
  
  // Ищем категорию по ID
  const cat = categories.value?.find(c => c.id === Number(currentCategory.value))
  
  // Показываем фильтры только если slug категории — 'tires' (шины)
  // Замени 'tires' на свой slug, который у тебя в базе
  return cat?.slug === 'tires'
})

// 🟢 Вычисляем уникальные значения для селектов (чтобы не хардкодить)
const availableSeasons = computed(() => {
  if (!products.value) return []
  // Собираем все сезоны, убираем пустые и дубликаты
  return [...new Set(products.value.map(p => p.season).filter(Boolean))]
})

const availableDiameters = computed(() => {
  if (!products.value) return []
  return [...new Set(products.value.map(p => p.diameter).filter(Boolean))]
})

// Фильтруем товары по числовому ID категории
const filteredProducts = computed(() => {
  if (!products.value) return []
  
  let result = products.value
  
  // 1. Фильтр по категории
  if (currentCategory.value !== 'all') {
    result = result.filter(p => p.category === Number(currentCategory.value))
  }
  
  // 2. Фильтр по поиску
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query))
    )
  }

  // 3. Фильтр по сезону
  if (selectedSeason.value !== 'all') {
    result = result.filter(p => p.season === selectedSeason.value)
  }
  
  // 4. Фильтр по диаметру
  if (selectedDiameter.value !== 'all') {
    result = result.filter(p => p.diameter === selectedDiameter.value)
  }
  
  return result
})
</script>

<template>
  <div class="w-full">
    <!-- Заголовок страницы -->
    <h1 class="text-lg font-bold bg-black/90 text-white p-2 px-5 tracking-wide uppercase text-sm">
      Каталог товаров
    </h1>

    <!-- Вывод ошибок, если база недоступна -->
    <div v-if="prodError || catError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 my-4 text-xs">
      Ошибка подключения к базе данных.
    </div>

        <!-- 🎛 ПАНЕЛЬ ПОИСКА И ФИЛЬТРОВ -->
    <div class="my-6 flex flex-col md:flex-row md:items-center gap-4">
      
      <!-- Поиск  -->
      <div class="w-full md:w-64">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск по названию или бренду..." 
          class="border border-gray-400 p-2 text-xs rounded w-full focus:outline-none focus:border-black"
        />
      </div>
      
      <!-- Фильтр по сезону -->
      <div v-if="showTireFilters" class="flex items-center gap-2">
        <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider whitespace-nowrap">Сезон:</label>
        <select 
          v-model="selectedSeason" 
          class="border border-gray-400 p-2 text-xs rounded focus:outline-none focus:border-black bg-white min-w-[100px]"
        >
          <option value="all">Все</option>
          <option v-for="season in availableSeasons" :key="season" :value="season">
            {{ season }}
          </option>
        </select>
      </div>
      
      <!-- Фильтр по диаметру -->
      <div v-if="showTireFilters" class="flex items-center gap-2">
        <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider whitespace-nowrap">Диаметр:</label>
        <select 
          v-model="selectedDiameter" 
          class="border border-gray-400 p-2 text-xs rounded focus:outline-none focus:border-black bg-white min-w-[100px]"
        >
          <option value="all">Все</option>
          <option v-for="diam in availableDiameters" :key="diam" :value="diam">
            {{ diam }}
          </option>
        </select>
      </div>

      <!-- Кнопка сброса -->
      <button 
        v-if="searchQuery || selectedSeason !== 'all' || selectedDiameter !== 'all' || currentCategory !== 'all'"
        @click="searchQuery = ''; selectedSeason = 'all'; selectedDiameter = 'all'; currentCategory = 'all'"
        class="text-[10px] font-black text-gray-500 uppercase tracking-wider hover:text-black underline cursor-pointer whitespace-nowrap"
      >
        Сбросить
      </button>
      
    </div>

    <!-- 🎛 ОБНОВЛЕННАЯ ПАНЕЛЬ ФИЛЬТРОВ: генерируется динамически из таблицы categories -->
    <div v-if="categories" class="flex gap-4 my-6 border-b border-gray-400 pb-3 text-xs font-bold uppercase tracking-wider">
      <!-- Кнопка "Все товары" остается всегда -->
      <button 
        @click="currentCategory = 'all'; selectedSeason = 'all'; selectedDiameter = 'all'; searchQuery = ''; currentPage = 1"
        :class="currentCategory === 'all' ? 'border-b-2 border-black pb-3 -mb-[14px]' : 'text-gray-500 hover:text-black transition-colors'"
        class="cursor-pointer"
      >
        Все товары
      </button>

      <!-- Остальные кнопки рендерятся из базы через v-for -->
      <button 
        v-for="cat in categories"
        :key="cat.id"
        @click="currentCategory = cat.id; selectedSeason = 'all'; selectedDiameter = 'all'; searchQuery = ''; currentPage = 1"
        :class="currentCategory === cat.id ? 'border-b-2 border-black pb-3 -mb-[14px]' : 'text-gray-500 hover:text-black transition-colors'"
        class="cursor-pointer"
      >
        {{ cat.name }}
      </button>

    </div>

    <!-- 🛒 Grid-сетка товаров (весь ваш старый тег <div class="grid..."> остается абсолютно без изменений) -->
    <div v-if="paginatedProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <div 
        v-for="product in paginatedProducts" 
        :key="product.id"
        class="border border-gray-400 bg-white flex flex-col justify-between hover:shadow-md transition-shadow group text-black block"
      >
        <NuxtLink :to="`/catalog/${product.id}`" class="block">
          <div class="relative w-full h-[160px] md:h-[225px] overflow-hidden border-b border-gray-400">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-full object-contain p-2 select-none pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-300" 
            />
          </div>
          <div class="p-3 text-left">
            <h3 class="font-bold text-xs md:text-sm text-black tracking-wide line-clamp-2 uppercase min-h-[40px] group-hover:text-gray-600 transition-colors">
              {{ product.name }}
            </h3>
          </div>
        </NuxtLink>

          <!-- Цена и кнопка заказа (вне ссылки на карточку) -->
          <div class="p-3 pt-0 flex flex-col gap-2 text-left">
            <span class="text-sm md:text-base font-black text-black">${{ product.price }}</span>
              <NuxtLink 
                :to="`/order?product=${product.id}`"
                class="w-full text-center bg-black/90 text-white py-2 font-bold uppercase tracking-wider text-[10px] hover:bg-black transition-colors cursor-pointer rounded-xs block"
              >
                Заказать
              </NuxtLink>
          </div>
      </div>
    </div>
    <!-- 🟢 ПАГИНАЦИЯ -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
      
      <!-- Кнопка "Назад" -->
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-400 rounded hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
      >
        ← Назад
      </button>

      <!-- Номера страниц -->
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="currentPage = page"
        :class="currentPage === page ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'"
        class="w-8 h-8 text-xs font-bold border border-gray-400 rounded transition-colors cursor-pointer"
      >
        {{ page }}
      </button>

      <!-- Кнопка "Вперед" -->
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-400 rounded hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
      >
        Вперед →
      </button>

    </div>
    <p v-if="!paginatedProducts.length" class="text-gray-500 text-sm mt-8">
      В данной категории пока нет доступных товаров.
    </p>
  </div>
</template>
