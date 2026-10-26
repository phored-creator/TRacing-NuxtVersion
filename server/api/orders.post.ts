import { db } from '../db';
import { orders } from '../db/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { productId, clientName, clientPhone, clientComment } = body;

  if (!productId || !clientName || !clientPhone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пожалуйста, заполните обязательные поля формы'
    });
  }

  const session = await getUserSession(event);
  const userId = session.user?.id || null;

  try {
    // Вставляем новую заявку в MariaDB
    await db.insert(orders).values({
      // Преобразуем через parseInt для железобетонной точности целого числа (int)
      userId: userId ? parseInt(String(userId), 10) : null,
      productId: parseInt(String(productId), 10),
      clientName: String(clientName),
      clientPhone: String(clientPhone),
      clientComment: clientComment ? String(clientComment) : '',
      status: 'new'
    });

    return { success: true, message: 'Заявка успешно отправлена!' };
  } catch (error: any) {
    console.error('Критическая ошибка MySQL при сохранении заявки:', error);

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Ошибка при сохранении заявки на сервере'
    });
  }
});
