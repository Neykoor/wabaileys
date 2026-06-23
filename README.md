<!-- Banner — reemplaza con tu imagen -->
<p align="center">
  <img src="./assets/banner.png" alt="wabaileys banner" width="100%" />
</p>

<h1 align="center">wabaileys</h1>

<p align="center">
  Fork optimizado de Baileys v7 · LID nativo · Mensajes interactivos · Rich messages · Newsletter API
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-blue" alt="version" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-green" alt="node" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="license" />
  <img src="https://img.shields.io/badge/type-ESM-orange" alt="esm" />
</p>

---

## ¿Qué es wabaileys?

`wabaileys` es un fork de [Baileys](https://github.com/WhiskeySockets/Baileys) enfocado en estabilidad, soporte nativo de LID y funciones extendidas para bots de WhatsApp multi-dispositivo. Incluye fixes críticos del upstream, nuevas utilidades y soporte para tipos de mensaje que Baileys oficial no expone.

## Novedades v1.1.0

- **`Socket/interactive-handler.js`** — clase `Dugong` para álbumes, eventos, polls, pagos, products y más. Disponible como `sock.dugong`.
- **`Utils/lid.js`** — utilidad `makeLidUtility` con `resolve` y `resolveBatch` para resolución LID ↔ PN sin dependencias externas.
- **`Utils/use-sqlite-auth-state.js`** — auth state persistente en SQLite con WAL mode y prepared statements.
- **`Utils/offline-node-processor.js`** — cola de nodos offline con batch yield al event loop.
- **`Utils/rich-message-utils.js`** — tablas, listas y código con syntax highlight vía `richResponse`.
- **`Utils/messages-newsletter.js`** — API completa para newsletters: texto, imagen, video, audio, sticker, botones, listas.
- **Fix MongoDB auth** — corregido `data` → `value` en `use-mongo-file-auth-state.js`.
- **Fix LID grupos** — `id` se resuelve a `phone_number` cuando el participante es `@lid`.
- **`lid-mapping.js`** — añadido método `close()` para liberar recursos del cache.

## Instalación

```bash
npm install ./wabaileys
# o
yarn add ./wabaileys
```

> Requiere Node.js >= 20.

### Peer dependencies opcionales

| Paquete | Para qué |
|---|---|
| `better-sqlite3` | `useSqliteAuthState` |
| `mongoose` | `useMongoFileAuthState` |
| `sharp` / `@napi-rs/image` | Procesamiento de imágenes |
| `audio-decode` | Conversión de audio |
| `link-preview-js` | Previsualización de enlaces |

---

## Uso básico

```js
import makeWASocket, { useMultiFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMultiFileAuthState('./auth')
const sock = makeWASocket({ auth: state })

sock.ev.on('creds.update', saveCreds)
sock.ev.on('messages.upsert', ({ messages }) => {
  console.log(messages)
})
```

## Auth con SQLite

```js
import makeWASocket, { useSqliteAuthState } from 'wabaileys'

const { state, saveCreds } = await useSqliteAuthState({ dbPath: './auth.db' })
const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)
```

## Auth con MongoDB

```js
import { useMongoFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMongoFileAuthState(mongoCollection)
```

## Dugong — Interactive Handler

`sock.dugong` viene instanciado automáticamente con las dependencias del socket.

```js
// Enviar álbum de imágenes
await sock.dugong.handleAlbum(content, jid, quoted)

// Enviar evento
await sock.dugong.handleEvent(content, jid, quoted)

// Poll result
await sock.dugong.handlePollResult(content, jid, quoted)
```

## LID Utility

```js
const lid = makeLidUtility(sock.signalRepository.lidMapping)

// Resolver un JID individual (lid → pn o pn → lid)
const pn = await lid.resolve('123@lid')

// Resolver múltiples en batch
const map = await lid.resolveBatch(['123@lid', '456@lid'])
// Map { '123@lid' => '123@s.whatsapp.net', ... }
```

## Rich Messages

```js
await sock.sendMessage(jid, {
  richResponse: [
    { text: 'Resultado:' }
  ],
  table: {
    title: 'Usuarios',
    rows: [
      ['Nombre', 'Saldo'],
      ['Alice', '5000¥'],
      ['Bob',   '3200¥']
    ]
  }
})
```

## Newsletter Utils

```js
import { makeNewsletterUtils } from 'wabaileys'

const nl = makeNewsletterUtils(sock)

await nl.sendNewsletterText('123456@newsletter', 'Hola!')
await nl.sendNewsletterImage('123456@newsletter', buffer, { caption: 'Foto' })
await nl.sendNewsletterButtons('123456@newsletter', {
  body: 'Elige una opción',
  buttons: [
    { text: 'Opción 1', id: 'op1' },
    { text: 'Opción 2', id: 'op2' }
  ]
})
```

---

## Sobre la imagen del banner

Para agregar tu propia imagen de banner:

1. Crea una carpeta `assets/` en la raíz del proyecto.
2. Coloca tu imagen como `assets/banner.png` (recomendado: 1200×300 px).
3. El `<img>` del inicio del README la tomará automáticamente.

Si prefieres usar una URL externa, edita la primera línea del README:

```html
<img src="https://tudominio.com/banner.png" alt="wabaileys banner" width="100%" />
```

---

## Licencia

MIT — [Neykoor](https://github.com/Neykoor)
