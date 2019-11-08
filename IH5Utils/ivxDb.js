const DB_NAME = 'ivx'

let db = null
let tables = ['config']

function getDb(version) {
  if (db) return Promise.resolve(db)
  else {
    return new Promise(function(res) {
      const req = indexedDB.open(DB_NAME, version)
      req.onsuccess = function(e) {
        const _db = e.target.result
        if (
          tables.some(function(name) {
            return !_db.objectStoreNames.contains(name)
          })
        )
          return getDb(_db.version + 1)
        db = _db
        res(_db)
      }

      req.onupgradeneeded = function(e) {
        const db = e.target.result
        tables.forEach(function(name) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name)
        })
      }
    })
  }
}

function get(storeName, key) {
  return this.getDb().then(function(db) {
    if (db.objectStoreNames.contains(storeName)) {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      return new Promise(function(res) {
        const req = store.get(key)
        req.onsuccess = function(e) {
          res(e.target.result)
        }
      })
    } else return Promise.resolve()
  })
}

function set(storeName, key, value) {
  return getDb().then(function(db) {
    if (db.objectStoreNames.contains(storeName)) {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      return new Promise(function(res) {
        const req = store.put(value, key)
        req.onsuccess = function(e) {
          res(e.target.result)
        }
      })
    } else return Promise.resolve()
  })
}

export default {
  set,
  get,
  getDb
}
