const cache: Record<string, string> = {};

export const getCachedAvatar = (fileId: string) => cache[fileId];

export const setCachedAvatar = (fileId: string, url: string) => {
    cache[fileId] = url;
};