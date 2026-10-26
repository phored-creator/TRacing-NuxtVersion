<script setup>
import { ref, onMounted } from 'vue'

// 🟢 Подключаем наш глобальный composable
const { categoriesList, fetchCategories } = useCategories()

// Загружаем категории при монтировании компонента
onMounted(() => {
  fetchCategories()
})
// Переменные для формы КАТЕГОРИЙ (Создание / Изменение)
const catName = ref('')
const catSlug = ref('')
const catError = ref('')
const catSuccess = ref('')
const isCatLoading = ref(false)
const editingCategoryId = ref(null) // null — создание, ID — редактирование категории

// Включение режима редактирования категории
const startEditCategory = (cat) => {
  catError.value = ''
  catSuccess.value = ''
  editingCategoryId.value = cat.id
  catName.value = cat.name
  catSlug.value = cat.slug
}

// Отмена редактирования категории
const cancelEditCategory = () => {
  editingCategoryId.value = null
  catName.value = ''
  catSlug.value = ''
}

// Универсальное сохранение категории (Создание ИЛИ Обновление)
const handleSaveCategory = async () => {
  catError.value = ''
  catSuccess.value = ''
  isCatLoading.value = true

  const isEdit = editingCategoryId.value !== null
  const endpoint = '/api/admin/categories'
  const method = isEdit ? 'PUT' : 'POST'

  try {
    const response = await $fetch(endpoint, {
      method: method,
      body: {
        id: editingCategoryId.value, // передается только при PUT
        name: catName.value,
        slug: catSlug.value
      }
    })
    if (response.success) {
      catSuccess.value = response.message
      cancelEditCategory() // сбрасываем форму в дефолт
      await fetchCategories() // обновляем глобальный список
    }
  } catch (error) {
    catError.value = error.data?.statusMessage || 'Ошибка при сохранении категории'
  } finally {
    isCatLoading.value = false
  }
}

// Удаление категории
const handleDeleteCategory = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return
  catError.value = ''
  catSuccess.value = ''
  try {
    const response = await $fetch('/api/admin/categories', {
      method: 'DELETE',
      body: { id }
    })
    if (response.success) {
      catSuccess.value = response.message
      await fetchCategories() //Обновляем глобальный список
    }
  } catch (error) {
    catError.value = error.data?.statusMessage || 'Не удалось удалить категорию'
  }
}
</script>
<template>
    <!-- 🚀 1. УНИВЕРСАЛЬНАЯ ФОРМА: СОЗДАНИЕ / ИЗМЕНЕНИЕ КАТЕГОРИИ -->
    <section class="w-full border border-gray-400 p-6 bg-white rounded">
    <h3 
        :class="editingCategoryId ? 'text-orange-600 font-bold' : 'text-black font-bold'"
        class="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-200 pb-2"
    >
        {{ editingCategoryId ? `Изменить категорию ID: ${editingCategoryId}` : 'Создать категорию' }}
    </h3>
    
    <p v-if="catError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 text-xs font-medium mb-3">{{ catError }}</p>
    <p v-if="catSuccess" class="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 text-xs font-medium mb-3">{{ catSuccess }}</p>

    <!-- Меняем событие сабмита на новую функцию handleSaveCategory -->
    <form @submit.prevent="handleSaveCategory" class="flex flex-col gap-3">
        <div class="flex flex-col">
        <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Название</label>
        <input v-model="catName" type="text" required placeholder="Например: Масла" :disabled="isCatLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
        </div>

        <div class="flex flex-col">
        <label class="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Системное имя (slug)</label>
        <input v-model="catSlug" type="text" required placeholder="Например: oils" :disabled="isCatLoading" class="border border-gray-400 p-2 text-sm focus:outline-none focus:border-black rounded" />
        </div>

        <button 
        type="submit" 
        :disabled="isCatLoading" 
        :class="editingCategoryId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-black/90 hover:bg-black'"
        class="w-full text-white p-2.5 mt-2 font-bold uppercase tracking-wider text-xs transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer rounded"
        >
        {{ isCatLoading ? 'Сохранение...' : (editingCategoryId ? 'Сохранить изменения' : 'Создать категорию') }}
        </button>

        <button 
        v-if="editingCategoryId" 
        type="button" 
        @click="cancelEditCategory" 
        class="w-full bg-gray-200 text-black p-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors rounded cursor-pointer mt-1"
        >
        Отмена
        </button>
    </form>

    <!-- Список существующих категорий с кнопками Изменить и Удалить -->
    <div class="mt-6 border-t border-gray-200 pt-4">
        <h4 class="text-[10px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Существующие категории</h4>
        
        <ul v-if="categoriesList && categoriesList.length" class="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        <li v-for="cat in categoriesList" :key="cat.id" class="flex items-center justify-between text-xs bg-gray-50 border border-gray-300 p-2 rounded">
            <div class="truncate max-w-[50%] flex flex-col">
            <span class="font-bold text-black truncate">{{ cat.name }}</span>
            <span class="text-[9px] text-gray-500 font-mono">slug: {{ cat.slug }}</span>
            </div>
            
            <!-- Кнопки управления в ряд -->
            <div class="flex gap-1.5 flex-shrink-0">
            <button 
                type="button"
                @click="startEditCategory(cat)" 
                class="text-[9px] text-blue-600 font-black uppercase tracking-wider hover:text-blue-800 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 cursor-pointer transition-colors"
            >
                Изменить
            </button>
            <button 
                type="button"
                @click="handleDeleteCategory(cat.id)" 
                class="text-[9px] text-red-600 font-black uppercase tracking-wider hover:text-red-800 border border-red-200 px-2 py-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
            >
                Удалить
            </button>
            </div>
        </li>
        </ul>
        <p v-else class="text-gray-500 text-xs italic">Категорий пока нет.</p>
    </div>
    </section>
</template>