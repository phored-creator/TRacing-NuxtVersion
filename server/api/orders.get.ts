import { db } from '../db';
import { orders, products } from '../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Строгая проверка прав администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  try {
    // 2. Делаем SQL-запрос выборки ВСЕХ заявок из MariaDB
    const allOrders = await db
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
      .leftJoin(products, eq(orders.productId, products.id)); // Связываем заказ с товаром

    return allOrders;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка загрузки общего списка заявок'
    });
  }
});
