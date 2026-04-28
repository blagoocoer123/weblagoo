# Быстрая инструкция по безопасности

## ✅ Что уже сделано в коде (v6.0)

1. **CSP заголовки** - защита от XSS
2. **rel="noopener noreferrer"** на всех внешних ссылках
3. **Rate limiting** для API запросов (5 сек cooldown)
4. **Удалены debug логи** (console.log)
5. **Валидация данных** от API
6. **Timeout для fetch** запросов (5 сек)
7. **Защита от копирования** контента

## 🔧 Что нужно настроить на сервере

### Для Nginx (добавить в конфиг):
\`\`\`nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000" always;
server_tokens off;
\`\`\`

### Для Apache (добавить в .htaccess):
\`\`\`apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000"
Options -Indexes
\`\`\`

## 🔍 Проверка безопасности

После деплоя проверьте сайт на:
- https://securityheaders.com/ (должно быть A или A+)
- https://observatory.mozilla.org/ (должно быть 80+)

## ⚠️ Важно

- Обязательно используйте **HTTPS**
- Настройте **rate limiting** для /api/views на сервере
- Регулярно обновляйте зависимости
- Делайте бэкапы

## 📋 Полная документация

См. файл **SECURITY.md** для детальных инструкций.
