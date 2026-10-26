<script setup>
import { computed, onMounted } from 'vue'

// 🟢 Подключаем данные из composables
const { productsList, fetchProducts } = useProducts()
const { categoriesList, fetchCategories } = useCategories()

// 🟢 Загружаем данные при появлении компонента
onMounted(() => {
  fetchProducts()
  fetchCategories()
})

// 🟢 Считаем количество товаров в каждой категории
const categoryStats = computed(() => {
  if (!categoriesList.value || !productsList.value) return []
  
  return categoriesList.value.map(cat => {
    const count = productsList.value.filter(p => p.category === cat.id).length
    return { name: cat.name, count }
  })
})

// 🟢 Максимальное количество (для расчета ширины полоски)
const maxCount = computed(() => {
  if (!categoryStats.value.length) return 1
  return Math.max(...categoryStats.value.map(s => s.count))
})

// 🟢 Общее количество товаров (для заголовка)
const totalProducts = computed(() => {
  return productsList.value?.length || 0
})
</script>

<template>
  <section class="border border-gray-400 p-6 bg-white rounded">
    <div class="flex items-center justify-between border-b border-gray-200 pb-2 mb-6">
      <h3 class="font-bold text-sm uppercase tracking-wider">
        Статистика по категориям
      </h3>
      <span class="bg-black text-white text-[10px] font-black uppercase px-2 py-1 rounded-sm">
        Всего товаров: {{ totalProducts }}
      </span>
    </div>
    
    <div v-if="categoryStats.length" class="space-y-4">
      <div v-for="stat in categoryStats" :key="stat.name" class="flex items-center gap-4">
        
        <!-- Название категории -->
        <span class="w-32 text-xs font-bold uppercase tracking-wider text-gray-600 truncate">
          {{ stat.name }}
        </span>
        
        <!-- Полоска -->
        <div class="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
          <div 
            class="bg-black/90 h-full transition-all duration-500 flex items-center justify-end pr-2"
            :style="{ width: `${(stat.count / maxCount) * 100}%` }"
          >
            <span v-if="stat.count > 0" class="text-[10px] font-black text-white">
              {{ stat.count }}
            </span>
          </div>
        </div>
        
        <!-- Количество (если полоска нулевая) -->
        <span v-if="stat.count === 0" class="text-[10px] font-black text-gray-400 w-6 text-right">0</span>
        <span v-else class="w-6"></span>
        
      </div>
    </div>
    
    <p v-else class="text-gray-500 text-xs italic">Нет данных для отображения.</p>
  </section>
</template>