# Сервис поиска и просмотра сериалов

Для запуска используйте:
```
cd путь/до/проекта
yarn install
yarn dev
yarn dev:server
```

Пример переменных окружения
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=LibSerialDB
DB_PORT=5432
JWT_SECRET=SecretKey

X_API_KEY=api_key (from https://api.kinopoisk.dev/documentation)
```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
