var sqlite = require('sqlite3');
var winston = require('winston');

var SqliteDocumentStore = function (options) {
  this.expireJS = options.expire;

  this.database = new sqlite.Database(process.env.DATABASE_URL || options.databasePath, (err) => {
    if (err) {
      winston.error('error open sqlite database');
    }
  });
};

SqliteDocumentStore.prototype = {
  get: function(key, callback, skipExpire) {
    let now = Math.floor(new Date().getTime() / 1000);

    this.database.serialize(() => {
      this.database.get(
        'SELECT id, value, expiration FROM entries WHERE key = $1 AND (expiration IS NULL OR expiration > $2)',
        [key, now],
        (err, row) => {
          if (err) {
            winston.error('error retrieving value from sqlite', { error: err });
            return callback(false);
          }
          
          callback(row !== undefined ? row.value : false);

          if (row !== undefined && this.expireJS && !skipExpire) {
            client.run(
              'UPDATE entries SET expiration $1 WHERE id = $2',
              [this.expireJS + now, row.id]
            );
          }
        }
      )
    });
  },

  set: function (key, data, callback, skipExpire) {
    let now = Math.floor(new Date().getTime() / 1000);

    this.database.serialize(() => {
      let statement = this.database.prepare("INSERT INTO entries (key, value, expiration) VALUES ($1, $2, $3)");

      statement.run(
        key, data,
        this.expireJS && !skipExpire ? this.expireJS + now : null
      );

      statement.finalize((err) => {
        if (err) {
          winston.error("error finalization of statement")
          return callback(false);
        }

        callback(true);
      });
    });
  }
};

module.exports = SqliteDocumentStore;