import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Пожалуйста, введите email и пароль' 
    });
  }

  try {
    // 1. Ищем пользователя в MySQL по email
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    const user = foundUsers[0];

    // 2. Если пользователь не найден
    if (!user) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Неверный Email или пароль' 
      });
    }

    // 3. Сверяем введенный пароль с зашифрованным хэшем из базы
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Неверный Email или пароль' 
      });
    }

    // 4. Если всё совпало, возвращаем данные пользователя (без пароля!)
    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    // Возвращаем ответ на фронтенд
    return { 
      success: true, 
      message: 'Вы успешно вошли!'
    };

  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Внутренняя ошибка сервера',
    });
  }
});
