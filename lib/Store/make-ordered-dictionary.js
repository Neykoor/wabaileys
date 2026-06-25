export function makeOrderedDictionary(idGetter) {
    const array = [];
    const dict = {};
    const indexMap = {};
    const get = (id) => dict[id];
    const _rebuildIndex = () => {
        for (let i = 0; i < array.length; i++) {
            indexMap[idGetter(array[i])] = i;
        }
    };
    const update = (item) => {
        const id = idGetter(item);
        const idx = indexMap[id];
        if (idx !== undefined) {
            array[idx] = item;
            dict[id] = item;
            return true;
        }
        return false;
    };
    const upsert = (item, mode) => {
        const id = idGetter(item);
        if (get(id)) {
            update(item);
        }
        else {
            if (mode === 'append') {
                indexMap[id] = array.length;
                array.push(item);
            }
            else {
                array.splice(0, 0, item);
                _rebuildIndex();
            }
            dict[id] = item;
        }
    };
    const remove = (item) => {
        const id = idGetter(item);
        const idx = indexMap[id];
        if (idx !== undefined) {
            array.splice(idx, 1);
            delete dict[id];
            delete indexMap[id];
            for (let i = idx; i < array.length; i++) {
                indexMap[idGetter(array[i])] = i;
            }
            return true;
        }
        return false;
    };
    return {
        array,
        get,
        upsert,
        update,
        remove,
        updateAssign: (id, update) => {
            const item = get(id);
            if (item) {
                Object.assign(item, update);
                const newId = idGetter(item);
                if (newId !== id) {
                    delete dict[id];
                    delete indexMap[id];
                    dict[newId] = item;
                    const idx = array.indexOf(item);
                    if (idx >= 0) indexMap[newId] = idx;
                }
                return true;
            }
            return false;
        },
        clear: () => {
            array.splice(0, array.length);
            for (const key of Object.keys(dict)) { delete dict[key]; }
            for (const key of Object.keys(indexMap)) { delete indexMap[key]; }
        },
        filter: (contain) => {
            let i = 0;
            while (i < array.length) {
                if (!contain(array[i])) {
                    const id = idGetter(array[i]);
                    delete dict[id];
                    delete indexMap[id];
                    array.splice(i, 1);
                    for (let j = i; j < array.length; j++) {
                        indexMap[idGetter(array[j])] = j;
                    }
                }
                else {
                    i += 1;
                }
            }
        },
        toJSON: () => array,
        fromJSON: (newItems) => {
            array.splice(0, array.length, ...newItems);
            _rebuildIndex();
        }
    };
}
