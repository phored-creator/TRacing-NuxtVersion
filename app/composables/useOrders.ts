import { ref } from 'vue'

// 🟢 Общая "доска" для заявок
const ordersList = ref([])

export const useOrders = () => {
  // 1. Загрузка заявок
  const fetchOrders = async () => {
    try {
      ordersList.value = await $fetch('/api/orders')
    } catch (e) {
      console.error('Ошибка загрузки заявок', e)
    }
  }

  // 2. Смена статуса заявки
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await $fetch('/api/admin/orders', {
        method: 'PATCH',
        body: { id: orderId, status: newStatus }
      })
      if (response.success) {
        await fetchOrders() // Обновляем список после смены статуса
      }
    } catch (error) {
      alert(error.data?.statusMessage || 'Не удалось обновить статус заявки')
    }
  }

  // Возвращаем всё наружу
  return { ordersList, fetchOrders, updateStatus }
}