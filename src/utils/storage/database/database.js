import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system'
import * as SQLite from "expo-sqlite";
import bodypace_db from '../../../../assets/bodypace.db'
import logger from '../../logging';


export class Database {
  constructor({ db }) {
    this.db = db
  }

  transaction(msg, txf, ok, err) {
    if (this.db === null) {
      logger.error(`database: transaction: ${msg}: error: db is null`)
      return
    }

    logger.log(`database: transaction: ${msg}`)
    this.db.transaction(
      txf,
      (error) => {
        logger.error(`database: transaction: ${msg}: error (${{ error }})`)
        err && err(error)
      },
      () => {
        logger.log(`database: transaction: ${msg}: ok`);
        ok && ok()
      }
    )
  }

  enableForeignKeys(onSuccess) {
    this.db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, onSuccess);
  }

  create(tables, onSuccess) {
    this.transaction('create', (tx) => {
      tables.forEach(table => {
        table.sqls.create(tx)
      })
    }, onSuccess)
  }
  
  setup(tables, onSuccess) {
    this.enableForeignKeys(
      () => this.create(tables, onSuccess)
    )
  }

  refresh(table, filter, setter, onSuccess) {
    filter
      ? this.transaction(`refresh ${table.name} - filter`, (tx) => { table.sqls.filter(tx, filter, setter) }, onSuccess)
      : this.transaction(`refresh ${table.name} - select`, (tx) => { table.sqls.select(tx, setter) }, onSuccess)
  }

  readOne(table, v, setter, onSuccess) {
    this.transaction(`readOne ${table.name}`, (tx) => { table.sqls.getone(tx, v, setter) }, onSuccess)
  }

  update(table, v, onSuccess) {
    const values = [...table.fields.map(({ name }) => v[name]), v.id]
    this.transaction(`update ${table.name}`,
      (tx) => { table.sqls.update(tx, values) },
      onSuccess
    )
  }

  insert(table, v, onSuccess) {
    const values = table.fields.map(({ name }) => v[name])
    this.transaction(`insert ${table.name}`,
      (tx) => { table.sqls.insert(tx, values) },
      onSuccess
    )
  }

  delete(table, v, onSuccess) {
    this.transaction(`delete ${table.name}`,
      (tx) => { table.sqls.delete(tx, v) },
      onSuccess
    )
  }
}

export async function openDatabase() {
  logger.log('database: openDatabase: getInfoAsync')
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    logger.debug('database: openDatabase: makeDirectoryAsync')
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }

  const uri = Asset.fromModule(bodypace_db).uri
  logger.debug(`database: openDatabase: uri = ${uri}`)

  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/bodypace_local.db')).exists) {
    logger.info(`database: openDatabase: downloadAsync`)
    await FileSystem.downloadAsync(
      uri,
      FileSystem.documentDirectory + 'SQLite/bodypace_local.db'
    );
  }

  logger.debug(`database: openDatabase: SQLite.openDatabase`)
  const db = SQLite.openDatabase('bodypace_local.db');

  logger.log(`database: openDatabase: returning: ${db}`)
  return new Database({ db })
}