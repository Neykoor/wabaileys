# WAbaileys

> Optimized Baileys v7 fork — LID nativo, mensajes interactivos, álbumes, newsletter media y más.

## Diferencias con el upstream

### ✅ LID / PN nativo resuelto
- `groupFetchAllParticipating` ahora extrae y almacena mappings LID↔PN automáticamente
- `extractGroupMetadata` resuelve correctamente `lid`, `phoneNumber` y `id` por participante
- Nuevo módulo `lib/Utils/jid-utils.js` con helpers: `normalizeJid`, `safeJidDecode`, `isValidJid`, `resolveJidForSend`, `extractJidParts`

### ✅ Mensajes interactivos
- Botones, listas, carrusel, template, collection, shop storefront
- `interactiveAsTemplate` para wrappear interactive como template

### ✅ Álbum de medias
- Múltiples imágenes/videos en un solo envío nativo

### ✅ Newsletter media
- Fix de rutas `/newsletter/newsletter-*` para upload correcto
- Soporte para quiz en newsletters

### ✅ Sin archivos .map en producción
- Los 212 archivos `.js.map` y `.d.ts.map` del upstream fueron eliminados (~3MB menos)

### ✅ Mejoras generales
- `maxMsgRetryCount` subido de 3 → 5
- `LIBRARY_NAME` = `'WAbaileys'`
- Logger con class `'WAbaileys'`
- `DONATE_URL` y branding del fork original removidos

## Instalación

```bash
# desde el directorio del paquete
npm install ./wabaileys

# o con yarn
yarn add ./wabaileys
```

## Uso básico

```js
import makeWASocket, { useMultiFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMultiFileAuthState('./auth')

const sock = makeWASocket({ auth: state })

sock.ev.on('creds.update', saveCreds)

sock.ev.on('messages.upsert', ({ messages }) => {
    for (const msg of messages) {
        console.log(msg)
    }
})
```

## JID Utils

```js
import { normalizeJid, resolveJidForSend, extractJidParts } from 'wabaileys/lib/Utils/jid-utils.js'

const parts = extractJidParts('5491122334455@s.whatsapp.net')
// { user, server, isLid, isPn, isGroup, isBroadcast, isStatus }
```

## Licencia

MIT
