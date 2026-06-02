# 🚀 Despliegue de Cyrafit en Hostinger

## 1. Exportar a GitHub
En Lovable: **GitHub → Connect → Create Repository**.
Clona el repo en tu PC:
```bash
git clone https://github.com/TU_USUARIO/cyrafit.git
cd cyrafit
```

## 2. Build local
```bash
npm install
npm run build
```
Esto genera la carpeta **`dist/`** con la app lista (HTML + JS + CSS + `.htaccess`).

## 3. Subir a Hostinger
**Opción A – File Manager (manual):**
1. Entra a hPanel → **Administrador de archivos**.
2. Ve a `public_html/` y borra lo que haya.
3. Sube TODO el contenido de `dist/` (no la carpeta, su contenido).
4. Verifica que `.htaccess` esté en la raíz (activa "mostrar archivos ocultos").

**Opción B – Git automático (recomendado):**
1. hPanel → **Avanzado → GitHub**.
2. Conecta el repo, branch `main`, carpeta `public_html`.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`

## 4. Variables de entorno
Crea `.env` en la raíz del proyecto (o configúralas en Hostinger):
```
VITE_SUPABASE_URL="https://bshqwcusbfnhgdkdywep.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_C7Jf0zj9PT1JVoqxqLR2ng_XWJTYXAR"
VITE_SUPABASE_PROJECT_ID="bshqwcusbfnhgdkdywep"
```
⚠️ Estas variables se inyectan **al hacer `npm run build`**, no en runtime.

## 5. Dominio y SSL
1. hPanel → **Dominios** → apunta `cyrafit.com` y `www.cyrafit.com` a tu hosting.
2. hPanel → **Seguridad → SSL** → instala certificado gratuito (Let's Encrypt).
3. Espera a que diga "Activo" (5-10 min).

## 6. Supabase – URLs finales
Authentication → **URL Configuration**:
- Site URL: `https://cyrafit.com`
- Redirect URLs:
  - `https://cyrafit.com/**`
  - `https://www.cyrafit.com/**`

## 7. Google OAuth – URLs finales
Google Cloud Console → Credentials → cliente **CYRA**:
- **Orígenes JS autorizados**: `https://cyrafit.com`, `https://www.cyrafit.com`
- **URIs de redireccionamiento**: `https://bshqwcusbfnhgdkdywep.supabase.co/auth/v1/callback`

## 8. Checklist final ✅
- [ ] `dist/` subido a `public_html/`
- [ ] `.htaccess` visible en la raíz
- [ ] SSL activo (candado verde)
- [ ] `cyrafit.com` carga la app
- [ ] Login email/password funciona
- [ ] Login con Google funciona
- [ ] Rutas (`/training`, `/community`) funcionan al refrescar (gracias al `.htaccess`)

## Problemas comunes
| Síntoma | Causa | Solución |
|---|---|---|
| 404 al refrescar `/training` | falta `.htaccess` | Subir `.htaccess` a `public_html/` |
| Pantalla blanca | `.env` mal en build | Reconstruir con variables correctas |
| Google login: `redirect_uri_mismatch` | URL no autorizada en Google Cloud | Agregar `https://cyrafit.com` en orígenes JS |
| CORS / 401 Supabase | Site URL incorrecta | Corregir URL Configuration en Supabase |
