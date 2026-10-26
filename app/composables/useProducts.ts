import { ref } from 'vue'

// 🟢 Общая "доска" для товаров
const productsList = ref([])

export const useProducts = () => {
  // 1. Загрузка товаров
  const fetchProducts = async () => {
    try {
      productsList.value = await $fetch('/api/products')
    } catch (e) {
      console.error('Ошибка загрузки товаров', e)
    }
  }

  // 2. Удаление товара
  const deleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return
    try {
      const response = await $fetch('/api/admin/products', { 
        method: 'DELETE', 
        body: { id } 
      })
      if (response.success) {
        await fetchProducts() // Обновляем общую доску после удаления
      }
    } catch (error: any) {
      alert(error.data?.statusMessage || 'Не удалось удалить товар')
    }
  }

  // Возвращаем наружу
  return { productsList, fetchProducts, deleteProduct }
}