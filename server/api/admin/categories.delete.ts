import { db } from '../../db';
import { categories, products } from '../../db/schema';
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

  // 2. Читаем ID удаляемой категории
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не указан ID категории для удаления.'
    });
  }

  try {
    // 3. ПРОВЕРКА: Есть ли товары в этой категории?
    const connectedProducts = await db
      .select()
      .from(products)
      .where(eq(products.category, Number(id)))
      .limit(1);

    if (connectedProducts.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Нельзя удалить категорию, пока в ней есть товары! Сначала удалите или перенесите товары.'
      });
    }

    // 4. Если товаров нет, безопасно удаляем категорию
    await db.delete(categories).where(eq(categories.id, Number(id)));

    return { success: true, message: 'Категория успешно удалена!' };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Ошибка при удалении категории из базы данных.'
    });
  }
});
