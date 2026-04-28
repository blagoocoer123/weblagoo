# Рекомендации по безопасности

## Реализованные меры безопасности (v6.0)

### 1. Content Security Policy (CSP)
✅ Добавлены заголовки CSP в HTML для защиты от XSS атак
- `default-src 'self'` - разрешены только ресурсы с того же домена
- `script-src 'self' 'unsafe-inline'` - скрипты только с домена (unsafe-inline для совместимости)
- `frame-ancestors 'none'` - защита от clickjacking

### 2. Защита от Tabnabbing
✅ Все внешние ссылки имеют `rel="noopener noreferrer"`
- Предотвращает доступ к window.opener
- Защищает от фишинговых атак через открытые вкладки

### 3. Безопасность заголовков
✅ Добавлены защитные HTTP заголовки:
- `X-Content-Type-Options: nosniff` - защита от MIME-sniffing
- `X-Frame-Options: DENY` - защита от clickjacking
- `X-XSS-Protection: 1; mode=block` - дополнительная защита от XSS
- `Referrer-Policy: strict-origin-when-cross-origin` - контроль referrer

### 4. Защита от утечки информации
✅ Удалены все console.log с debug информацией
✅ Убраны inline скрипты (перенесены в отдельные файлы)

### 5. Rate Limiting
✅ Добавлен rate limiting для API запросов:
- Cooldown 5 секунд между запросами счетчика просмотров
- Timeout 5 секунд для fetch запросов
- Валидация ответов от API

### 6. Защита от копирования
✅ Реализована защита контента:
- Отключено контекстное меню
- Отключено копирование/вырезание
- Отключено выделение текста
- Заблокированы горячие клавиши DevTools

### 7. Accessibility & Security
✅ Добавлены aria-label для всех ссылок
✅ Правильные MIME types для всех ресурсов

## Рекомендации для серверной части

### Настройка веб-сервера (Nginx/Apache)

#### Nginx конфигурация:
\`\`\`nginx
# Добавить в server block

# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# CSP (если не используется meta tag)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;

# HSTS (для HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Disable server tokens
server_tokens off;

# Rate limiting для API
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_status 429;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
}

# Защита от hotlinking
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|mp3|mp4)$ {
    valid_referers none blocked weblagoo.com *.weblagoo.com;
    if ($invalid_referer) {
        return 403;
    }
}
\`\`\`

#### Apache конфигурация (.htaccess):
\`\`\`apache
# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# HSTS
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# Disable directory listing
Options -Indexes

# Защита от hotlinking
RewriteEngine on
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^http(s)?://(www\.)?weblagoo.com [NC]
RewriteRule \.(jpg|jpeg|png|gif|svg|mp3|mp4)$ - [F,NC]
\`\`\`

### API безопасность (/api/views)

Рекомендации для серверного API:

\`\`\`javascript
// Пример безопасного API endpoint
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://weblagoo.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Rate limiting (implement with Redis or similar)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // ... rate limit logic ...
  
  // Return sanitized data
  const views = await getViewCount(); // Your DB logic
  
  return res.status(200).json({
    views: Math.floor(views), // Ensure integer
    timestamp: Date.now()
  });
}
\`\`\`

## Дополнительные рекомендации

### 1. HTTPS
- ✅ Обязательно используйте HTTPS
- ✅ Настройте HSTS
- ✅ Используйте современные TLS версии (1.2+)

### 2. Регулярные обновления
- Обновляйте зависимости
- Мониторьте уязвимости
- Проверяйте логи на подозрительную активность

### 3. Backup
- Регулярные бэкапы сайта
- Бэкапы базы данных (если используется)
- Храните бэкапы в безопасном месте

### 4. Мониторинг
- Настройте мониторинг доступности
- Отслеживайте необычный трафик
- Логируйте ошибки

## Что НЕ защищено

⚠️ **Важно понимать:**
- Защита от копирования контента не является 100% надежной
- Опытные пользователи могут обойти JavaScript защиту
- Исходный код HTML/CSS/JS всегда доступен через DevTools
- Медиа файлы можно скачать через Network tab

Эти меры усложняют копирование, но не делают его невозможным.

## Проверка безопасности

Рекомендуемые инструменты:
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## Контакты

При обнаружении уязвимостей, пожалуйста, сообщите об этом ответственно.
