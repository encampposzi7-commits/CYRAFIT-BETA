# 📱 Cyrafit – Android APK con Google Login nativo

Login con Google usando el **selector nativo de cuentas** (no WebView) vía
[`@capgo/capacitor-social-login`](https://github.com/Cap-go/capacitor-social-login).
Funciona en la APK compilada con Android Studio.

---

## 1. Preparar el proyecto

```bash
git clone https://github.com/TU_USUARIO/cyrafit.git
cd cyrafit
npm install
npm run build
npx capacitor-assets generate --android
npx cap sync android
```

Verifica `capacitor.config.ts`:
```ts
appId: 'app.lovable.cyrafit.beta'
appName: 'Cyrafit'
```
👉 El `appId` será el **package name** en Google Cloud. Si lo cambias, cámbialo también allá.

---

## 2. Obtener tu SHA-1

### Debug (para probar)
```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android -keypass android
```

### Release (para publicar en Play Store)
```bash
keytool -list -v -keystore tu-release.keystore -alias tu-alias
```

Copia la línea `SHA1: XX:XX:XX:...` — la necesitas en el siguiente paso.

---

## 3. Google Cloud Console — crear cliente Android

Tu cliente OAuth actual es **tipo Web** (CYRA). Para Android necesitas un **segundo cliente**:

1. https://console.cloud.google.com/apis/credentials
2. **Crear credenciales → ID de cliente de OAuth**
3. Tipo de aplicación: **Android**
4. Nombre: `Cyrafit Android`
5. **Nombre del paquete**: `app.lovable.cyrafit.beta`
6. **Huella digital del certificado SHA-1**: pega el SHA-1 del paso 2 (debug y/o release)
7. **Crear** (no genera secreto, es normal)

⚠️ **IMPORTANTE**: El plugin usa el **Web Client ID** (no el Android) para generar el `idToken`.
El cliente Android solo sirve para que Google reconozca tu app.

---

## 4. Configurar el Web Client ID en la app

El archivo `src/lib/googleAuth.ts` ya tiene tu Web Client ID hardcodeado:
```
847788812238-05lnkc4neas386ckhv9j6qdqc64sgij4.apps.googleusercontent.com
```

Si quieres cambiarlo, agrega en `.env`:
```
VITE_GOOGLE_WEB_CLIENT_ID="tu-web-client-id.apps.googleusercontent.com"
```

Y reconstruye: `npm run build && npx cap sync android`.

---

## 5. Supabase — habilitar idToken de Google

1. Dashboard → **Authentication → Providers → Google** → activado ✅
2. Pegar el **Web Client ID** y **Web Client Secret** (los del cliente "CYRA").
3. Activar **"Skip nonce check"** ❌ → déjalo **desactivado** (el plugin maneja nonce).
4. En **Authorized Client IDs** (campo opcional), agregar también el **Web Client ID** → permite que Supabase acepte idTokens generados desde el plugin nativo.

---

## 6. Compilar la APK

```bash
npm run build
npx capacitor-assets generate --android
npx cap sync android
npx cap open android
```

⚠️ Si abres Android Studio sin ejecutar primero `npm run build` y `npx cap sync android`, la APK puede abrir en blanco porque no tendrá los archivos web dentro de `android/app/src/main/assets/public`.

En Android Studio:
- **Build → Build Bundle(s)/APK(s) → Build APK(s)**
- O para release firmada: **Build → Generate Signed Bundle/APK**

---

## 7. Probar

Instala la APK en tu teléfono. Al tocar **"Continuar con Google"** debe aparecer el **selector nativo de cuentas Google** (no un navegador). Selecciona tu cuenta → vuelves a la app logueada.

---

## ⚠️ Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `DEVELOPER_ERROR` / código 10 | SHA-1 no registrado o package name incorrecto | Verifica SHA-1 + package en Google Cloud cliente Android |
| `idToken is null` | Falta Web Client ID o está mal | Verifica `GOOGLE_WEB_CLIENT_ID` en `googleAuth.ts` |
| Supabase: `Unverified ID token` | El Web Client ID no está en Supabase | Pégalo en Authentication → Providers → Google → Authorized Client IDs |
| `Sign in cancelled` | Usuario cerró el diálogo | Normal, no es un bug |
| El botón no hace nada | Falta `npx cap sync` después del build | Re-ejecutar `npm run build && npx cap sync android` |

---

## Resumen de IDs necesarios

| Dónde | Qué |
|---|---|
| Google Cloud cliente Web (CYRA) | Client ID + Secret → Supabase |
| Google Cloud cliente Android | package `app.lovable.cyrafit.beta` + SHA-1 |
| Supabase → Providers → Google | Web Client ID + Secret + Authorized Client IDs (Web ID otra vez) |
| `src/lib/googleAuth.ts` | Web Client ID |
| `capacitor.config.ts` | `appId` = package name |
