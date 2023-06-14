export class CertainMap<K extends string | number, V> {
  private _data: Record<K, V> = {} as Record<K, V>

  public constructor(values?: Record<K, V>) {
    if (values) {
      this._data = values
    }
  }

  public get(key: K): V {
    return this._data[key]
  }

  public set(key: K, value: V): V {
    this._data[key] = value
    return value
  }

  public has(key: K): boolean {
    return this._data.hasOwnProperty(key)
  }

  public delete(key: K): void {
    delete this._data[key]
  }

  public clear(): void {
    this._data = {} as Record<K, V>
  }

  public forEach(
    callback: (value: V, key: K, map: CertainMap<K, V>) => void,
  ): void {
    for (const key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        callback(this._data[key], key, this)
      }
    }
  }

  public map<T>(callback: (value: V, key: K, map: CertainMap<K, V>) => T): T[] {
    const result: T[] = []
    for (const key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        result.push(callback(this._data[key], key, this))
      }
    }
    return result
  }

  public get size(): number {
    return Object.keys(this._data).length
  }

  public get entries(): [K, V][] {
    return Object.entries(this._data) as [K, V][]
  }

  public get keys(): K[] {
    return Object.keys(this._data) as K[]
  }

  public get values(): V[] {
    return Object.values(this._data) as V[]
  }

  public get data(): Record<K, V> {
    return this._data
  }

  public get [Symbol.toStringTag](): string {
    return 'CertainMap'
  }

  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries[Symbol.iterator]()
  }

  public toJSON(): Record<K, V> {
    return this._data
  }

  public toString(): string {
    return JSON.stringify(this._data)
  }

  public static from<K extends string | number, V>(
    values: Record<K, V>,
  ): CertainMap<K, V> {
    return new CertainMap(values)
  }

  public static of<K extends string | number, V>(
    ...values: [K, V][]
  ): CertainMap<K, V> {
    const map = new CertainMap({} as Record<K, V>)
    for (const [key, value] of values) {
      map.set(key, value)
    }
    return map
  }

  public static isCertainMap<K extends string | number, V>(
    value: unknown,
  ): value is CertainMap<K, V> {
    return value instanceof CertainMap
  }

  public static isCertainMapData<K extends string | number, V>(
    value: unknown,
  ): value is Record<K, V> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }
}
