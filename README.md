# FOREO RP — статический сайт для GitHub Pages

Готовый сайт на чистом HTML5 + CSS3 + Vanilla JS. Nothing to build: `npm` не нужен, файлы можно загружать напрямую в корень репозитория GitHub Pages.

## Что лежит в папке

- `index.html` — разметка, секции, встроенный видео-плеер, inline SVG-иконки.
- `style.css` — тёмный дизайн, glassmorphism, неон, адаптив, сетка, градиент и рамка для видео.
- `script.js` — конфиг, встраивание видео, живой статус сервера, копирование IP, тост, мобильное меню.
- `favicon.svg` — SVG-иконка FOREO RP для вкладки браузера.
- `favicon.png` — PNG-версия иконки 512×512 с прозрачным фоном.
- `foreorp-icon.svg` — отдельная SVG-иконка FOREO RP для Discord/документов.
- `foreorp-icon.png` — PNG-иконка 512×512 для Discord, аватаров и документов.
- `CNAME` — основной домен GitHub Pages: `foreorp.ru`.
- `README.md` — эта инструкция.

Необязательно: положите `bg.jpg` рядом с `index.html`, чтобы заменить/дополнить градиентный фон своим скриншотом. Если файла нет — сайт просто показывает градиент и сетку.

---

## 1. Ссылки в конфигурации

Откройте `script.js`. В самом верху:

```js
const SERVER_IP = "mc.foreorp.ru";
const DONATE_URL = "https://www.donationalerts.com/r/pa1sey";
const LAUNCHER_EXE_URL = "https://github.com/palsey/foreorp-launcher/releases/download/v1.0.0/ForeoRP-Launcher-1.0.0-x64.exe";
const GITHUB_URL = "https://github.com/palsey/foreorp-launcher/releases";
const VIDEO_GUIDE_URL = "https://youtu.be/_DD9a7ppbnY";
```

Замените при необходимости:

1. `SERVER_IP` — уже заполнен: `mc.foreorp.ru`. Он же уйдёт в API статуса `api.mcsrvstat.us/3/<IP>`.
2. `DONATE_URL` — уже заполнен ссылкой на Donation Alerts сервера: `https://www.donationalerts.com/r/pa1sey`.
3. `LAUNCHER_EXE_URL` — прямая ссылка на `.exe` из GitHub Releases (кнопка «Скачать лаунчер»).
4. `GITHUB_URL` — страница релизов GitHub (кнопка «Скачать с GitHub»).
5. `VIDEO_GUIDE_URL` — видео-гайд. Из него автоматически получается адрес встроенного плеера (`youtube-nocookie.com/embed/...`), а кнопки «Видео-гайд» ведут к секции с плеером на странице.

Discord-ссылка уже выставлена на `https://discord.gg/xC5wDgZSpj` в строке `const DISCORD_URL` и менять её не нужно.

> Все значения уже финальные: IP, донат, оба варианта скачивания и встроенный видео-плеер работают без заглушек. Если заменить Video ID, плеер подхватит новое видео автоматически.

---

## 2. Загрузка на GitHub Pages

1. Создайте публичный репозиторий с точным именем `palsey.github.io` (если его ещё нет).
2. Загрузите **содержимое папки `site/` в корень репозитория**, а не саму папку `site/`.
3. В репозитории откройте **Settings → Pages**.
4. В разделе **Build and deployment** выберите:
   - **Source:** `Deploy from a branch`;
   - **Branch:** `main`, папка `/ (root)`.
5. Сохраните. Сайт будет доступен на `https://palsey.github.io`.
6. Если репозиторий уже создан, просто обновите файлы — GitHub Pages пересоберёт сайт автоматически.

Никаких `npm install`, `npm run build` и сборщиков нет.

---

## 3. Привязка `foreorp.ru`

### 3.1 GitHub

Сначала добавьте домен на GitHub, затем настраивайте DNS у регистратора:

1. **Settings → Pages → Custom domain**.
2. Введите `foreorp.ru` и нажмите **Save**.
3. В repositории появится/обновится файл `CNAME` с содержимым `foreorp.ru` — он уже лежит в этой папке.
4. После распространения DNS включите **Enforce HTTPS**.

### 3.2 REG.ru — DNS-записи

Откройте `https://www.reg.ru/user/account/card/124728455/nss/` → нужный домен `foreorp.ru` → **DNS-записи** (или «Управление DNS»).

Удалите стандартные записи `@ A`, если они есть, затем добавьте:

| Тип | Имя | Значение |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `palsey.github.io` |

Логин GitHub — `palsey` (с буквой `l`).

Важно:

- `CNAME` для `www` указывает на `palsey.github.io`, **без имени репозитория и без `/foreorp-site`**.
- Не указывайте `USERNAME.github.io/foreorp-site` и не используйте `*.pages.github.io` из настроек Pages.
- Не создавайте wildcard `*.foreorp.ru`.
- GitHub автоматически сделает редирект `www.foreorp.ru → foreorp.ru`, если настроены и apex, и www записи.
- Распространение DNS может занять до 24 часов.

Проверить можно в PowerShell:

```powershell
Resolve-DnsName foreorp.ru -Type A
Resolve-DnsName foreorp.ru -Type AAAA
Resolve-DnsName www.foreorp.ru -Type CNAME
```

---

## 4. Привязка `foreorp.online`

Один GitHub Pages-сайт нормально обслуживает один основной apex-домен. Поэтому для `foreorp.online` есть два варианта.

### Вариант A — второй сайт GitHub Pages (рекомендуется для HTTPS)

1. Создайте второй репозиторий, например `foreorp-online`.
2. Загрузите туда те же файлы из `site/`.
3. В `CNAME` второго репозитория напишите `foreorp.online`.
4. **Settings → Pages → Custom domain** → `foreorp.online` → **Save**.
5. В REG.ru для `foreorp.online` добавьте те же A/AAAA-записи на `@` и `CNAME www → USERNAME.github.io`.
6. Включите **Enforce HTTPS** и для второго сайта.

### Вариант B — редирект через REG.ru

Если второй сайт не нужен, в REG.ru можно настроить переадресацию:

- `foreorp.online` → `https://foreorp.ru`
- `www.foreorp.online` → `https://foreorp.ru`

Раздел обычно называется «Переадресация», «URL-редирект» или находится рядом с DNS-записями домена. Этот вариант проще, но корректный HTTPS-редирект зависит от настроек сертификата на стороне REG.ru.

---

## 5. Важное про доступы

Файлы сайта готовы, но **фактическую привязку доменов нельзя выполнить отсюда**: нет входа в GitHub-аккаунт и нет доступа к личному кабинету REG.ru по ссылке из запроса. После внесения DNS-записей и сохранения домена в настройках GitHub Pages всё заработает автоматически.
