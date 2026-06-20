# wabaileys v1.1.0

> Fork optimizado de Baileys v7 — LID nativo, mensajes interactivos, álbumes, rich messages, newsletter utils y más.

## Novedades v1.1.0

- `Socket/interactive-handler.js` — clase `Dugong` para payment, product, interactive, álbum, event, poll result, group story, statusWhatsApp. Disponible automáticamente en `sock.dugong`.
- `Socket/community.js` — manejo de comunidades en archivo dedicado
- `Utils/rich-message-utils.js` — mensajes ricos: tablas, listas, código con syntax highlight, vía `sock.sendMessage(jid, { richResponse: [...] })`
- `Utils/messages-newsletter.js` — API limpia para newsletters: text, image, video, audio, sticker, document, buttons, list, ptv
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

`sock.dugong` ya viene instanciado con las dependencias correctas del socket, no es necesario crearlo a mano.

```js
// Enviar álbum
await sock.dugong.handleAlbum(content, jid, quoted)

// Enviar evento
await sock.dugong.handleEvent(content, jid, quoted)
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

## Rich Messages (tablas, listas, código)

```js
await sock.sendMessage(jid, {
    richResponse: [
        { text: 'Resultado de la consulta:' }
    ],
    table: {
        title: 'Usuarios',
        rows: [
            ['Nombre', 'Edad'],
            ['Juan', '25'],
            ['Ana', '30']
        ]
    }
})
```

## Auth MongoDB

```js
import { useMongoFileAuthState } from 'wabaileys'

const { state, saveCreds } = await useMongoFileAuthState(mongoCollection)
```

## Licencia

MIT
