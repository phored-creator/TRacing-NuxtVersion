
import { db } from '../db'
import { orders, products } from '../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // 1. Проверяем, что пользователь авторизован
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Вы не авторизованы. Пожалуйста, войдите в аккаунт.'
    })
  }

  try {
    // 2. Делаем SQL-запрос: только заявки текущего пользователя
    const myOrders = await db
      .select({
        id: orders.id,
        clientName: orders.clientName,
        clientPhone: orders.clientPhone,
        clientComment: orders.clientComment,
        status: orders.status,
        createdAt: orders.createdAt,
        productName: products.name,
        productPrice: products.price
      })
      .from(orders)
      .leftJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.userId, session.user.id)) // 🟢 фильтр по пользователю

    return myOrders
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка загрузки ваших заявок'
    })
  }
})