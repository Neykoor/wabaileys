import { isLidUser, isPnUser, jidNormalizedUser } from '../WABinary/index.js';
/**
 * Thin convenience layer over signalRepository.lidMapping, exposed on the
 * socket as `sock.lid`. Lets consumers resolve a participant's @lid jid to
 * its real @s.whatsapp.net jid (and back) without an external LID-sync
 * dependency — the mapping data is already fetched/cached internally by
 * libsignal during normal operation.
 */
export function makeLidUtility(lidMapping) {
    /**
     * Resolves a single jid to its counterpart (lid -> pn, pn -> lid).
     * Returns null if no mapping is known yet or the jid isn't a user jid.
     */
    const resolve = async (jid) => {
        if (!jid)
            return null;
        const normalized = jidNormalizedUser(jid);
        if (!normalized)
            return null;
        if (isLidUser(normalized)) {
            const pn = await lidMapping.getPNForLID(normalized).catch(() => null);
            return pn ? jidNormalizedUser(pn) : null;
        }
        if (isPnUser(normalized)) {
            const lid = await lidMapping.getLIDForPN(normalized).catch(() => null);
            return lid ? jidNormalizedUser(lid) : null;
        }
        return null;
    };
    /**
     * Batch-resolves a list of jids in as few underlying lookups as possible.
     * Returns a Map<originalJid, resolvedJid> containing only the entries
     * that were successfully resolved.
     */
    const resolveBatch = async (jids) => {
        const result = new Map();
        if (!jids?.length)
            return result;
        const lids = [];
        const pns = [];
        for (const jid of jids) {
            const normalized = jidNormalizedUser(jid);
            if (!normalized)
                continue;
            if (isLidUser(normalized))
                lids.push(normalized);
            else if (isPnUser(normalized))
                pns.push(normalized);
        }
        const [pnPairs, lidPairs] = await Promise.all([
            lids.length ? lidMapping.getPNsForLIDs(lids).catch(() => null) : null,
            pns.length ? lidMapping.getLIDsForPNs(pns).catch(() => null) : null
        ]);
        for (const pair of pnPairs || []) {
            if (pair?.lid && pair?.pn)
                result.set(jidNormalizedUser(pair.lid), jidNormalizedUser(pair.pn));
        }
        for (const pair of lidPairs || []) {
            if (pair?.pn && pair?.lid)
                result.set(jidNormalizedUser(pair.pn), jidNormalizedUser(pair.lid));
        }
        return result;
    };
    return {
        resolve,
        resolveBatch,
        isLid: isLidUser,
        isPn: isPnUser
    };
}
