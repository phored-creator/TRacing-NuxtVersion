<script setup>
import { ref, onMounted, computed } from 'vue'

const { productsList, fetchProducts, deleteProduct } = useProducts()
const { categoriesList } = useCategories()

// Переменные для формы ТОВАРА (Добавление / Редактирование)
const prodName = ref('')
const prodCategoryId = ref('')
const prodPrice = ref('')
const prodBrand = ref('')
const prodSeason = ref('')
const prodDiameter = ref('')
const prodCountry = ref('')
const selectedFile = ref(null)
const editingProductId = ref(null) // null — добавление, ID — редактирование товара

const prodError = ref('')
const prodSuccess = ref('')
const isProdLoading = ref(false)

// 🚀 ПЕРЕМЕННЫЕ ДЛЯ ПОИСКА И ФИЛЬТРАЦИИ ТОВАРОВ
const searchQuery = ref('')
const selectedCategoryFilter = ref('')


// Включение режима редактирования товара
const startEditProduct = (product) => {
  prodError.value = ''
  prodSuccess.value = ''
  editingProductId.value = product.id 
  
  prodName.value = product.name
  prodCategoryId.value = product.category
  prodPrice.value = product.price
  prodBrand.value = product.brand || ''
  prodSeason.value = product.season || ''
  prodDiameter.value = product.diameter || ''
  prodCountry.value = product.country || ''
}

// Отмена редактирования товара
const cancelEditProduct = () => {
  editingProductId.value = null
  prodName.value = ''
  prodPrice.value = ''
  prodBrand.value = ''
  prodSeason.value = ''
  prodDiameter.value = ''
  prodCountry.value = ''
  selectedFile.value = null
  const fileInput = document.getElementById('prodFileInput')
  if (fileInput) fileInput.value = ''
}

// Универсальное сохранение товара (Добавление ИЛИ Изменение)
const handleSaveProduct = async () => {
  prodError.value = ''
  prodSuccess.value = ''
  isProdLoading.value = true

  try {
    let finalImageUrl = '/images/no-photo.svg'

    if (editingProductId.value) {
      const currentProd = productsList.value.find(p => p.id === editingProductId.value)
      if (currentProd) finalImageUrl = currentProd.image
    }

    if (selectedFile.value && selectedFile.value.length > 0) {
      const formData = new FormData()
      formData.append('file', selectedFile.value[0])
      const uploadResponse = await $fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (uploadResponse.success) finalImageUrl = uploadResponse.url
    }

    const isEdit = editingProductId.value !== null
    const endpoint = '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await $fetch(endpoint, {
      method: method,
      body: {
        id: editingProductId.value,
        name: prodName.value,
        category: prodCategoryId.value,
        price: prodPrice.value,
        image: finalImageUrl,
        brand: prodBrand.value,
        season: prodSeason.value,
        diameter: prodDiameter.value,
        country: prodCountry.value
      }
    })

    if (response.success) {
      prodSuccess.value = response.message
      cancelEditProduct() 
      await fetchProducts() 
    }
  } catch (error) {
    prodError.value = error.data?.statusMessage || 'Ошибка при сохранении товара'
  } finally {
    isProdLoading.value = false
  }
}

// 🚀 УМНЫЙ ВЫЧИСЛЯЕМЫЙ МАССИВ (Фильтрует товары прямо на лету в памяти браузера)
const filteredProducts = computed(() => {
  return productsList.value.filter(product => {
    // 1. Фильтр по поисковому слову (ищет по названию и бренду без учета регистра)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 2. Фильтр по выбранной категории
    const matchesCategory = 
      !selectedCategoryFilter.value || 
      product.category === Number(selectedCategoryFilter.value)
    
    return matchesSearch && matchesCategory
  })
})

onMounted(async () => {
  await fetchProducts() // загружаем товары
  
  // Устанавливаем первую категорию по умолчанию
  if (categoriesList.value.length > 0 && !prodCategoryId.value) {
    prodCategoryId.value = categoriesList.value[0].id
  }
})

</script>

<template>
  <!-- 🗑 3. УПРАВЛЕНИЕ ТОВАРАМИ (Интерактивная CRM-Таблица с поиском) -->
  <section class="w-full lg:col-span-3 border border-gray-400 p-6 bg-white rounded-sm">
    <div class="border-b border-gray-200 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 class="font-bold text-sm uppercase tracking-wide text-black">Список товаров и управление каталогом</h3>
        <span class="bg-black text-white text-[10px] font-black uppercase px-2 py-1 rounded-sm">Всего: {{ filteredProducts.length }}</span>
    </div>
    

    <!-- 🏎 ПАНЕЛЬ СВЕРХБЫСТРЫХ ФИЛЬТРОВ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div class="flex flex-col">
        <label class="text-[9px] font-black text-gray-500 mb-1 uppercase tracking-wider">Быстрый поиск</label>
        <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Введите название или бренд... (например: Michelin)" 
            class="border border-gray-400 p-2 text-xs focus:outline-none focus:border-black rounded-sm bg-gray-50"
        />
        </div>
        
        <div class="flex flex-col">
        <label class="text-[9px] font-black text-gray-500 mb-1 uppercase tracking-wider">Фильтр по категории</label>
        <select 
            v-model="selectedCategoryFilter" 
            class="border border-gray-400 p-2 text-xs focus:outline-none focus:border-black rounded-sm bg-gray-50"
        >
            <option value="">Все категории каталога</option>
            <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">
            {{ cat.name }}
            </option>
        </select>
        </div>
    </div>

    <!-- 📊 КОМПАКТНАЯ ТАБЛИЦА С ТОВАРАМИ -->
    <div v-if="filteredProducts.length" class="overflow-x-auto border border-gray-200 rounded-sm">
        <table class="w-full text-left border-collapse text-xs">
        <thead>
            <tr class="bg-black text-white uppercase font-bold tracking-wider text-[10px] border-b border-gray-400">
            <th class="p-3 w-12 text-center">ID</th>
            <th class="p-3">Изображение</th>
            <th class="p-3">Название / Бренд</th>
            <th class="p-3">Характеристики</th>
            <th class="p-3">Цена</th>
            <th class="p-3 text-center">Действия</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-gray-50 transition-colors">
            <!-- ID товара -->
            <td class="p-3 text-center font-mono text-gray-500 font-bold border-r border-gray-100">{{ p.id }}</td>
            
            <!-- Миниатюра картинки -->
            <td class="p-2 w-20 text-center">
                <div class="h-10 w-10 mx-auto flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
                <img :src="p.image" :alt="p.name" class="max-h-full max-w-full object-contain select-none pointer-events-none" />
                </div>
            </td>
            
            <!-- Название и Бренд -->
            <td class="p-3">
                <div class="flex flex-col">
                <span class="font-bold text-black text-sm">{{ p.name }}</span>
                <span class="text-[9px] uppercase font-black tracking-widest text-gray-400 pt-0.5">{{ p.brand || 'Без бренда' }}</span>
                </div>
            </td>
            
            <!-- Характеристики в одну аккуратную строчку -->
            <td class="p-3 text-gray-600 font-medium">
                <div class="flex flex-wrap gap-x-3 gap-y-0.5">
                <span><strong class="text-gray-400">Сезон:</strong> {{ p.season || '—' }}</span>
                <span><strong class="text-gray-400">Размер:</strong> {{ p.diameter || '—' }}</span>
                <span><strong class="text-gray-400">Страна:</strong> {{ p.country || '—' }}</span>
                </div>
            </td>
            
            <!-- Цена -->
            <td class="p-3 font-black text-black text-sm">{{ p.price }}</td>
            
            <!-- Кнопки управления (Изменить / Удалить) -->
            <td class="p-3 text-center border-l border-gray-100">
                <div class="flex justify-center gap-2">
                <button 
                    @click="startEditProduct(p)" 
                    class="text-[10px] text-blue-600 font-black uppercase tracking-wider hover:text-blue-800 border border-blue-200 px-2.5 py-1 rounded-sm hover:bg-blue-50 transition-colors cursor-pointer"
                >
                    Изменить
                </button>
                <button 
                    @click="deleteProduct(p.id)" 
                    class="text-[10px] text-red-600 font-black uppercase tracking-wider hover:text-red-800 border border-red-200 px-2.5 py-1 rounded-sm hover:bg-red-50 transition-colors cursor-pointer"
                >
                    Удалить
                </button>
                </div>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    
    <!-- Сообщение, если ничего не найдено -->
    <div v-else class="text-center py-8 border border-dashed border-gray-300 rounded-sm bg-gray-50 text-gray-500 text-xs">
        {{ productsList.length ? 'По вашему запросу ничего не найдено. Попробуйте изменить фильтры.' : 'В каталоге пока нет товаров.' }}
    </div>
  </section>

  <!-- ➕ 2. УНИВЕРСАЛЬНАЯ ФОРМА: ДОБАВЛЕНИЕ / РЕДАКТИРОВАНИЕ -->
  <section class="w-full border border-gray-400 p-6 bg-white rounded">
  <!-- 🔄 ИСПРАВЛЕНО: Меняем заголовок и цвет на оранжевый, если мы в режиме изменения товара -->
  <h3 
      :class="editingProductId ? 'text-orange-600 font-bold' : 'text-black font-bold'" 
      class="text-sm uppercase tracking-wide mb-4 border-b border-gray-200 pb-2"
  >
      {{ editingProductId ? `Редактировать товар ID: ${editingProductId}` : 'Добавить товар' }}
  </h3>

  <p v-if="prodError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 text-xs font-medium mb-3">{{ prodError }}</p>
  <p v-if="prodSuccess" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 text-xs font-medium mb-3">{{ prodSuccess }}</p>

  <form @submit.prevent="handleSaveProduct" class="flex flex-col gap-3">
      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Название *</label>
      <input v-model="prodName" type="text" required placeholder="Michelin Pilot Sport 5" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Категория *</label>
      <select v-model="prodCategoryId" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm bg-white focus:outline-none focus:border-black rounded">
          <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">
          {{ cat.name }}
          </option>
      </select>
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Бренд</label>
      <input v-model="prodBrand" type="text" required placeholder="Michelin" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded">
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Сезон</label>
      <input v-model="prodSeason" type="text" required placeholder="Лето" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded">
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Диаметр</label>
      <input v-model="prodDiameter" type="text" required placeholder="205/55" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded">
      </div>
      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Страна</label>
      <input v-model="prodCountry" type="text" required placeholder="Франция" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded">
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Цена *</label>
      <input v-model="prodPrice" type="text" required placeholder="$250" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
      </div>

      <div class="flex flex-col">
      <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
          {{ editingProductId ? 'Заменить изображение (необязательно)' : 'Изображение товара *' }}
      </label>
      <input 
          id="prodFileInput"
          type="file" 
          accept="image/*"
          @change="selectedFile = $event.target.files"
          :disabled="isProdLoading" 
          class="border border-gray-400 p-1 text-sm bg-white rounded file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-black/90 file:text-white file:cursor-pointer" 
      />
      </div>

      <!-- 🔄 ИСПРАВЛЕНО: Кнопка динамически меняет текст и цвет в режиме изменения -->
      <button 
      type="submit" 
      :disabled="isProdLoading" 
      :class="editingProductId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-black/90 hover:bg-black'"
      class="w-full text-white p-2.5 mt-2 font-bold uppercase tracking-wider text-xs transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer rounded"
      >
      {{ isProdLoading ? 'Сохранение...' : (editingProductId ? 'Сохранить изменения' : 'Добавить товар') }}
      </button>

      <!-- 🔄 ИСПРАВЛЕНО: Кнопка отмены редактирования, возвращает форму в обычный режим -->
      <button 
      v-if="editingProductId" 
      type="button" 
      @click="cancelEditProduct" 
      class="w-full bg-gray-200 text-black p-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors rounded cursor-pointer mt-1"
      >
      Отмена
      </button>
  </form>
  </section>

  
  
</template>