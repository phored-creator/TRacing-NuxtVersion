<script setup>
import { ref, onMounted } from 'vue'

// Включаем защиту Middleware — сюда зайдет только admin1
definePageMeta({
  middleware: 'admin'
})

const { user } = useUserSession()

// Переменные для пользователей
const usersList = ref([])
const errorMsg = ref('')

// Переменные для управления товарами
const productsList = ref([])
const prodListError = ref('')

// Переменные для формы добавления товара
const prodName = ref('')
const prodCategory = ref('tires')
const prodPrice = ref('')
const prodImage = ref('/images/formula-e.jpg')

const prodError = ref('')
const prodSuccess = ref('')
const isProdLoading = ref(false)

// Функция для загрузки всех данных (пользователи + товары)
const loadAdminData = async () => {
  if (user.value && user.value.role === 'admin1') {
    // Загружаем юзеров
    try {
      usersList.value = await $fetch('/api/admin/users')
    } catch (error) {
      errorMsg.value = error.data?.statusMessage || 'Ошибка загрузки пользователей'
    }
    
    // Загружаем товары напрямую с нашего публичного эндпоинта
    try {
      productsList.value = await $fetch('/api/products')
    } catch (error) {
      prodListError.value = error.data?.statusMessage || 'Ошибка загрузки товаров'
    }
  }
}

onMounted(() => {
  loadAdminData()
})

// Функция добавления товара
const handleAddProduct = async () => {
  prodError.value = ''
  prodSuccess.value = ''
  isProdLoading.value = true

  try {
    const response = await $fetch('/api/admin/products', {
      method: 'POST',
      body: {
        name: prodName.value,
        category: prodCategory.value,
        price: prodPrice.value,
        image: prodImage.value
      }
    })

    if (response.success) {
      prodSuccess.value = response.message
      prodName.value = ''
      prodPrice.value = ''
      // Перезагружаем данные, чтобы новый товар сразу появился в списке ниже
      await loadAdminData()
    }
  } catch (error) {
    prodError.value = error.data?.statusMessage || 'Ошибка при добавлении товара'
  } finally {
    isProdLoading.value = false
  }
}

// 🗑 Функция удаления товара
const handleDeleteProduct = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

  try {
    const response = await $fetch('/api/admin/products', {
      method: 'DELETE', // отправляем строго DELETE запрос
      body: { id }
    })

    if (response.success) {
      // Обновляем список товаров на экране
      await loadAdminData()
    }
  } catch (error) {
    alert(error.data?.statusMessage || 'Не удалось удалить товар')
  }
}
</script>

<template>
  <div class="space-y-8 text-left">
    <div>
      <h2 class="text-xl font-bold uppercase tracking-wider">Панель администратора</h2>
      <p class="text-sm text-gray-600 mt-1">Добро пожаловать, {{ user?.name }}!</p>
    </div>

    <!-- Две колонки: Слева форма добавления, Справа список товаров для удаления -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      
      <!-- ➕ ФОРМА ДОБАВЛЕНИЯ ТОВАРА -->
      <section class="w-full border border-gray-400 p-6 bg-white rounded">
        <h3 class="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">Добавить товар</h3>

        <p v-if="prodError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 text-xs font-medium mb-3">{{ prodError }}</p>
        <p v-if="prodSuccess" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 text-xs font-medium mb-3">{{ prodSuccess }}</p>

        <form @submit.prevent="handleAddProduct" class="flex flex-col gap-3">
          <div class="flex flex-col">
            <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Название</label>
            <input v-model="prodName" type="text" required placeholder="Michelin Pilot Sport 5" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
          </div>

          <div class="flex flex-col">
            <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Категория</label>
            <select v-model="prodCategory" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm bg-white focus:outline-none focus:border-black rounded">
              <option value="tires">Шины</option>
              <option value="wheels">Диски</option>
              <option value="oils">Масла</option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Цена</label>
            <input v-model="prodPrice" type="text" required placeholder="14 500 ₽" :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
          </div>

          <div class="flex flex-col">
            <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Путь к картинке</label>
            <input v-model="prodImage" type="text" required :disabled="isProdLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
          </div>

          <button type="submit" :disabled="isProdLoading" class="w-full bg-black/90 text-white p-2.5 mt-2 font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer rounded">
            {{ isProdLoading ? 'Добавление...' : 'Добавить товар' }}
          </button>
        </form>
      </section>

      <!-- 🗑 УПРАВЛЕНИЕ ТОВАРАМИ (Список и удаление) -->
      <section class="w-full border border-gray-400 p-6 bg-white rounded">
        <h3 class="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">
          Список товаров (Удаление)
        </h3>
        
        <p v-if="prodListError" class="text-red-600 text-xs mb-2">{{ prodListError }}</p>

        <ul v-if="productsList.length" class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          <li v-for="p in productsList" :key="p.id" class="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
            <div class="truncate max-w-[70%]">
              <span class="font-bold text-gray-500 text-xs">[{{ p.category }}]</span> 
              <span class="ml-1 text-black font-medium">{{ p.name }}</span>
            </div>
            <!-- Кнопка удаления в строгом минималистичном стиле -->
            <button 
              @click="handleDeleteProduct(p.id)" 
              class="text-xs text-red-600 font-bold uppercase tracking-wider hover:text-red-800 transition-colors cursor-pointer border border-red-200 px-2 py-1 rounded hover:bg-red-50"
            >
              Удалить
            </button>
          </li>
        </ul>
        <p v-else-if="!prodListError" class="text-gray-500 text-xs">В каталоге пока нет товаров.</p>
      </section>
    </div>

    <!-- 👥 СПИСОК ПОЛЬЗОВАТЕЛЕЙ -->
    <section class="border-t border-gray-400 pt-6">
      <h3 class="font-bold text-sm uppercase tracking-wider mb-3">Список зарегистрированных пользователей</h3>
      <p v-if="errorMsg" style="color: red;" class="text-sm mb-2">{{ errorMsg }}</p>

      <ul v-if="usersList.length" class="space-y-1 text-sm bg-gray-50 border border-gray-300 p-4 rounded">
        <li v-for="u in usersList" :key="u.id" class="border-b border-gray-200 py-1 last:border-0 flex gap-4">
          <span><strong>ID:</strong> {{ u.id }}</span>
          <span><strong>Имя:</strong> {{ u.name }}</span>
          <span><strong>Email:</strong> {{ u.email }}</span>
          <span><strong>Роль:</strong> <span class="text-blue-600 font-bold">{{ u.role }}</span></span>
        </li>
      </ul>
      <p v-else-if="!errorMsg" class="text-gray-500 text-sm">Загрузка пользователей...</p>
    </section>
  </div>
</template>
