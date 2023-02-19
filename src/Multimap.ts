type NonEmptyArray<T> = [T, ...T[]];

interface Entry<K, V> {
    key: K;
    vals: NonEmptyArray<V>;
}

/**
 * An array-based implementation of a multimap.
 */
export default class Multimap<K, V> {
    private entries: Entry<K, V>[] = [];

    /**
     * The number of values across all keys
     */
    public size = 0;

    /**
     * The number of keys
     */
    public count = 0;

    /**
     * Finds the Entry for the given key
     */
    private entryForKey(key: K): Entry<K, V> | undefined {
        return this.entries.find((entry) => entry.key === key);
    }

    /**
     * Removes all elements
     */
    public clear(): void {
        this.entries = [];
        this.size = 0;
        this.count = 0;
    }

    /**
     * Deletes a value belonging to a key, if such key/value pair exists
     * @returns True if a key and value corresponding to that key existed and was deleted, false
     *     if it did not exist
     */
    public delete(key: K, val?: V): boolean {
        const entry = this.entryForKey(key);
        if (entry) {
            // if value was provided, remove val from entry/remove entry
            if (val !== undefined) {
                const index = entry.vals.indexOf(val);
                if (index !== -1) {
                // remove entry if this is the last one
                    if (entry.vals.length === 1) {
                        const indexOfEntry = this.entries.indexOf(entry);
                        this.entries.splice(indexOfEntry, 1);
                        this.count -= 1;
                        this.size -= 1;
                        return true;
                    }
                    entry.vals.splice(index, 1);
                    this.size -= 1;
                    return true;
                }
                return false;
            }
            // val not provided, del entry
            const indexOfEntry = this.entries.indexOf(entry);
            this.entries.splice(indexOfEntry, 1);
            this.count -= 1;
            this.size -= 1;
            return true;
        }
        return false;
    }

    /**
     * Iterates over each array of values provided by each key.
     */
    public forEach(
        callbackfn: (vals: NonEmptyArray<V>, key: K, multimap: Multimap<K, V>) => void,
        thisArg?: unknown,
    ): void {
        this.entries.forEach((entry: Entry<K, V>) => {
            callbackfn(entry.vals, entry.key, this);
        }, thisArg);
    }

    /**
    * Gets the values for a given key in the order of insertion.
    * @returns An array containing the values that the key maps to
    */
    public get(key: K): V[] {
        return this.entryForKey(key)?.vals ?? [];
    }

    /**
     * If passed a key, determines if that key exists in the multimap. If passed a key/value,
     * determines whether that key/value pair exists in the multimap.
     */
    public has(key: K, val?: V): boolean {
        const entry = this.entryForKey(key);
        if (entry) {
            if (val !== undefined) {
                return entry.vals.includes(val);
            }
            return true;
        }
        return false;
    }

    // public keys(): K[] {

    // }

    /**
     * Maps over each array of values provided by each key.
     */
    public map<U>(
        callbackfn: (vals: NonEmptyArray<V>, key: K, multimap: Multimap<K, V>) => U,
        thisArg?: unknown,
    ): U[] {
        return this.entries.map(
            (entry: Entry<K, V>) => callbackfn(entry.vals, entry.key, this),
            thisArg,
        );
    }

    /**
     * Sets an a value for a key. Allows repeats.
     * */
    public set(key: K, ...vals: V[]): void {
        const isNonEmpty = (arr: V[]): arr is NonEmptyArray<V> => arr.length !== 0;

        if (!isNonEmpty(vals)) {
            return;
        }

        // find existing entry
        const existingEntry: Entry<K, V> | undefined = this.entryForKey(key);
        if (existingEntry) {
            existingEntry.vals = [...existingEntry.vals, ...vals];
            this.size += vals.length;
            return;
        }
        this.entries.push({ key, vals: [...vals] });
        this.count += 1;
        this.size += vals.length;
    }

    // public values(): V[] {

    // }
}
