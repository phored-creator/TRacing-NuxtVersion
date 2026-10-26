<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminCategories from '~/components/AdminCategories.vue'
import AdminProducts from '~/components/AdminProducts.vue'
import AdminOrders from '~/components/AdminOrders.vue'
import AdminStats from '~/components/AdminStats.vue'

definePageMeta({
  layout: 'notfooter',
  middleware: 'admin'
})

const { user } = useUserSession()

const { categoriesList, fetchCategories } = useCategories()


onMounted(async () => {
  await fetchCategories()
})

</script>

<template>
  <div class="space-y-8 text-left">
    <div>
      <h2 class="text-xl font-bold uppercase tracking-wider">Панель администратора</h2>
      <p class="text-sm text-gray-600 mt-1">Добро пожаловать, {{ user?.name }}!</p>
    </div>

    
    
    <!-- Заявки -->
    <AdminOrders />
    
    <!-- Трёхколоночная / Двухколоночная сетка для управления формами -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <AdminProducts />
      <AdminCategories />
      <AdminStats />
    </div>
    
  </div>
</template>
