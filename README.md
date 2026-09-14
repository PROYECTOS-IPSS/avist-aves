# AvistAves

Aplicación móvil desarrollada para el examen final de Desarrollo de Aplicaciones Móviles.

## Stack

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- expo-dev-client
- Expo SQLite

## Estado

P2.1 — Local Android Development/Preview Build Infrastructure

## Desarrollo Android

1. Generar manualmente development build:

   ```bash
   yarn build:dev
   ```

2. Instalar APK generado desde `build-outputs/development/` en emulador o teléfono Android.

3. Iniciar Metro dirigido al development client:

   ```bash
   yarn start
   ```

4. Abrir la development build instalada.

## Preview

Generar manualmente APK standalone:

```bash
yarn build:preview
```

Resultado esperado: `build-outputs/preview/`.

## Quality checks

```bash
yarn typecheck
yarn lint
yarn test
npx expo-doctor
```

P2.1 configura builds locales, pero no genera APK/AAB automáticamente. Las funcionalidades de cámara, GPS, clima y UI funcional pertenecen a fases posteriores.
