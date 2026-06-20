import { isLidUser, isPnUser, jidDecode, jidNormalizedUser } from '../WABinary/index.js';

export function normalizeJid(jid) {
    if (!jid || typeof jid !== 'string') return jid;
    const decoded = jidDecode(jid);
    if (!decoded) return jid;
    return jidNormalizedUser(jid);
}

export function safeJidDecode(jid) {
    if (!jid || typeof jid !== 'string') return null;
    try {
        return jidDecode(jid);
    } catch {
        return null;
    }
}

export function isValidJid(jid) {
    if (!jid || typeof jid !== 'string') return false;
    return safeJidDecode(jid) !== null;
}

export function resolveJidForSend(jid, lidMapping) {
    if (!jid) return jid;
    if (isLidUser(jid) && lidMapping) {
        return lidMapping.maybeLookupPhoneNumberFromLID(jid) ?? jid;
    }
    if (isPnUser(jid) && lidMapping) {
        return lidMapping.maybeLookupLIDFromPhoneNumber(jid) ?? jid;
    }
    return jid;
}

export function extractJidParts(jid) {
    const decoded = safeJidDecode(jid);
    if (!decoded) return null;
    return {
        user: decoded.user,
        server: decoded.server,
        isLid: isLidUser(jid),
        isPn: isPnUser(jid),
        isGroup: decoded.server === 'g.us',
        isBroadcast: decoded.server === 'broadcast',
        isStatus: jid === 'status@broadcast'
    };
}
