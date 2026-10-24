import { db } from '../../db';
import { products } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // 1. Проверяем сессию и права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем ID товара из тела запроса
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не указан ID товара для удаления'
    });
  }

  try {
    // 3. Удаляем товар из MySQL таблицы по его ID
    await db.delete(products).where(eq(products.id, id));

    return { success: true, message: 'Товар успешно удален из каталога!' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при удалении товара из базы данных'
    });
  }
});
