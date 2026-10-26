import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Проверяем права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем ID заказа и новый статус из тела запроса
  const body = await readBody(event);
  const { id, status } = body;

  if (!id || !status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не указан ID заказа или новый статус'
    });
  }

  // Разрешенные статусы (валидация для безопасности)
  const allowedStatuses = ['new', 'in_progress', 'completed'];
  if (!allowedStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректный статус заявки'
    });
  }

  try {
    // 3. Обновляем статус в базе данных MySQL
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, Number(id)));

    return { success: true, message: 'Статус заявки успешно изменен!' };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка обновления статуса в базе данных'
    });
  }
});
