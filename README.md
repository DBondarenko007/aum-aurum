# Aum Aurum — сайт семейной пасеки

Сайт-визитка на трёх языках (ქართული / русский / English) с админкой для правки текстов,
товаров, новостей, отзывов и фото.

- Бриф и все решения — [BRIEF.md](BRIEF.md)
- Контекст для Claude — [CLAUDE.md](CLAUDE.md)
- Дизайн-система — [DESIGN.md](DESIGN.md)
- Утверждённый стиль (демо, открывается двойным кликом) — [demos/d-combined.html](demos/d-combined.html)

**Сайт в интернете:** https://dbondarenko007.github.io/aum-aurum/
**Админка:** https://dbondarenko007.github.io/aum-aurum/admin/
**Код:** https://github.com/DBondarenko007/aum-aurum
**Заказы, отзывы, вопросы — как настроить:** [docs/ORDERS.md](docs/ORDERS.md)

## Как править сайт через админку (с любого компьютера)

1. **Один раз — создать ключ доступа** (токен) на GitHub: Settings → Developer settings →
   Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Repository access: **Only select repositories** → `aum-aurum`
   - Permissions → Repository permissions → **Contents: Read and write**
   - Expiration — например, 1 год. Скопировать ключ (он показывается один раз).
2. Открыть админку → **Sign In Using Access Token** → вставить ключ.
3. Править тексты, товары, новости, фото → **Сохранить**. Через ~1 минуту изменения на сайте.

**Доступ для сестры:** в репозитории Settings → Collaborators → Add people → её логин GitHub.
После того как она примет приглашение, она создаёт свой ключ (шаг 1) и входит так же.

## Посмотреть сайт у себя

Нужен Node.js 24 LTS (https://nodejs.org). В папке проекта:

```bash
npm install
```

```bash
npm run dev
```

Затем откройте в браузере http://localhost:4321/aum-aurum/ — сайт сам выберет язык.
Перед правками на компьютере выполните `git pull`: правки из админки сохраняются сразу на GitHub.
Правки в файлах видны сразу, без перезапуска.

> Почему нельзя просто дважды кликнуть по HTML-файлу: все ссылки сайта начинаются от корня
> (`/ru/`, `/favicon.svg`), а при открытии файла с диска «корнем» становится весь диск C:.
> Поэтому нужен маленький локальный сервер — его и запускает `npm run dev`
> (или `npm run build`, затем `npm run preview` — для собранной версии).

## Админка

http://localhost:4321/aum-aurum/admin/ — кнопка «Work with Local Repository» (только Chrome / Edge),
затем выберите папку проекта `aum-aurum`. Изменения сохраняются прямо в файлы проекта;
после правок закоммитьте их в git (или попросите Claude).

## Перенос на другой компьютер

1. Скопируйте папку `aum-aurum` **без** `node_modules`, `dist` и `.astro`
   (они восстанавливаются сами). Удобнее всего — заархивировать в zip.
2. На новом компьютере: установите Node.js 24 LTS, распакуйте папку, выполните `npm install`.
3. Откройте Claude Code **в этой папке** — он прочитает `CLAUDE.md` и `BRIEF.md`,
   где записано всё, о чём договорились.

Когда появится GitHub-репозиторий, переносить вручную больше не придётся: `git clone`.
