export function makeLidUtility(lidMapping: any): {
    resolve: (jid: string) => Promise<string | null>;
    resolveBatch: (jids: string[]) => Promise<Map<string, string>>;
    isLid: (jid: string) => boolean;
    isPn: (jid: string) => boolean;
};
