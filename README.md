# wabaileys v1.1.0

> Fork optimizado de Baileys v7 — LID nativo, mensajes interactivos, álbumes, rich messages, newsletter utils y más.

## Novedades v1.1.0

- `Socket/interactive-handler.js` — clase `Dugong` para payment, product, interactive, álbum, event, poll result, group story, statusWhatsApp
- `Socket/usync.js` — `executeUSyncQuery` como socket separado y limpio
- `Socket/community.js` — manejo de comunidades en archivo dedicado
- `Utils/message-composer.js` — mensajes ricos: tablas, listas, código con syntax highlight, LaTeX, imágenes inline
- `Utils/messages-newsletter.js` — API limpia para newsletters: text, image, video, audio, sticker, document, buttons, list, ptv
- `Utils/resolve-jid.js` — `resolveJid(conn, m, target)` con soporte LID/PN/mention/quoted
- `Utils/audioToBuffer.js` — convierte URL, path o stream a Buffer
- `Utils/streamToBuffer.js` — helper stream → Buffer
- `Utils/baileys-event-stream.js` — debug tool: graba y reproduce streams de eventos WA
- `Utils/use-mongo-file-auth-state.js` — auth state para MongoDB
- Fix LID en `groups.js`: `id` se resuelve a `phone_number` cuando el participante es LID

## Instalación

```bash
npm install ./wabaileys
# o
yarn add ./wabaileys
```

## Uso básico

```js
import makeWASocket, { useMultiFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMultiFileAuthState('./auth')
const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)
```

## Dugong — Interactive Handler

```js
import { Dugong } from 'wabaileys'

const dugong = new Dugong(sock.waUploadToServer, sock.relayMessage, config, sock)

// Enviar álbum
await dugong.handleAlbum(content, jid, quoted)

// Enviar evento
await dugong.handleEvent(content, jid, quoted)
```

## Newsletter Utils

```js
import { makeNewsletterUtils } from 'wabaileys'

const nl = makeNewsletterUtils(sock)
await nl.sendNewsletterText('123456@newsletter', 'Hola!')
await nl.sendNewsletterImage('123456@newsletter', buffer, { caption: 'Foto' })
await nl.sendNewsletterButtons('123456@newsletter', {
    body: 'Elige una opción',
    buttons: [{ text: 'Opción 1', id: 'op1' }, { text: 'Opción 2', id: 'op2' }]
})
```

## Message Composer — Rich Messages

```js
import { generateTableContent, generateCodeBlockContent, generateListContent } from 'wabaileys'

// Tabla
const table = generateTableContent('Usuarios', ['Nombre', 'Edad'], [['Juan', '25'], ['Ana', '30']], quoted)
await sock.relayMessage(jid, table.message, { messageId: table.messageId })

// Bloque de código con syntax highlight
const code = generateCodeBlockContent('console.log("hola")', quoted, { language: 'javascript', title: 'Ejemplo' })
await sock.relayMessage(jid, code.message, { messageId: code.messageId })
```

## resolve-jid

```js
import { resolveJid } from 'wabaileys'

const jid = await resolveJid(sock, m, m.mentionedJid?.[0])
```

## Auth MongoDB

```js
import { useMongoFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMongoFileAuthState(mongoCollection)
```

## Licencia

MIT
