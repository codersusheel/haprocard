const cache = new Map();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes


function setCache(key, data) {
    cache.set(key, {
        data,
        expires: Date.now() + CACHE_TIME
    });
}


function getCache(key) {

    const item = cache.get(key);

    if (!item) {
        return null;
    }

    if (Date.now() > item.expires) {
        cache.delete(key);
        return null;
    }

    return item.data;
}


function clearCache(key) {

    if (key) {
        cache.delete(key);
        return;
    }

    cache.clear();
}


module.exports = {
    setCache,
    getCache,
    clearCache
};