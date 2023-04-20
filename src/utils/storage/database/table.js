import logger from "../../logging"

const printObject = (o, level = 1) => {
  if (!o) {
    logger.info(' '.repeat(2 * level) + `> null`)
    return
  }

  Object.entries(o).forEach(([k, v]) => {
    if (typeof (v) === 'object') {
      logger.info(' '.repeat(2 * level) + `> ${k}:`)
      printObject(v, level + 1)
    } else {
      logger.info(' '.repeat(2 * level) + `> ${k}:`, v)
    }
  })
}

const helpers = {
  logOk: (msg) => () => {
    logger.debug(`database: ${msg}: ok`)
  },
  logError: (msg) => (err) => {
    logger.error(`database: ${msg}: error:`)
    printObject(err)
  },
  callIfOneResult: (msg, f, fe) => (_, { rows: { _array, length } }) => {
    if (length === 1) {
      logger.debug(`database: ${msg}: ok: callIfOneResult(): ok`)
      return f(_array[0])
    } else {
      logger.error(`database: ${msg}: ok: callIfOneResult(): error (length = ${length})`)
      return fe ? fe(_array, length) : undefined
    }
  },
  callWithResults: (msg, f) => (_, { rows: { _array, length } }) => {
    logger.debug(`database: ${msg}: ok: callWithResults(): ok (length = ${length})`)
    f(_array)
  },
  executeSql: (tx, query, ...args) => {
    logger.debug(`sql: ${query} args: ${args}`)
    tx.executeSql(query, ...args)
  }
}

export class Table {
  constructor({ name, fields, foreign = '', select = null, filter, order = 'asc' }) {
    this.name = name
    this.fields = fields
    this.foreign = foreign
    this.filter = filter
    this.order = order
    this.queries = {
      create: `create table if not exists ${name} (id integer primary key not null` + fields.map(({ name, def }) => `, ${name} ${def}`).join('') + (foreign ? `, ${foreign}` : '') + ');',
      insert: `insert into ${name} (` + fields.map(({ name }) => name).join(', ') + ') values (' + fields.map(_ => '?').join(', ') + ');',
      insall: `insert into ${name} (id` + fields.map(({ name }) => `, ${name}`).join('') + ') values (?' + fields.map(_ => ', ?').join('') + ');',
      update: `update ${name} set ` + fields.map(({ name }) => `${name} = ?`).join(', ') + ' where id = ?;',
      select: 'select ' + (select ? select.fields.join(', ') : '*') + ` from ${name}` + (select ? ` ${select.join} ` : ' ') + `order by id ${order};`,
      filter: 'select ' + (select ? select.fields.join(', ') : '*') + ` from ${name}` + (select ? ` ${select.join} ` : ' ') + `where ${filter} order by id ${order};`,
      getone: 'select ' + (select ? select.fields.join(', ') : '*') + ` from ${name}` + (select ? ` ${select.join} ` : ' ') + `where id = ?;`,
      delete: `delete from ${name} where id = ?;`,
      wipe: `delete from ${name};`,
      drop: `drop table if exists ${name};`,
    }
    this.sqls = {
      create: (tx) => tx.executeSql(this.queries.create, null, helpers.logOk(`sqls.${name}.create`), helpers.logError(`sqls.${name}.create`)),
      insert: (tx, v) => tx.executeSql(this.queries.insert, v, helpers.logOk(`sqls.${name}.insert`), helpers.logError(`sqls.${name}.insert`)),
      // insert: (tx, v) => helpers.executeSql(tx, this.queries.insert, v, helpers.logOk(`sqls.${name}.insert`), helpers.logError(`sqls.${name}.insert`)),
      insall: (tx, v) => tx.executeSql(this.queries.insall, v, helpers.logOk(`sqls.${name}.insall`), helpers.logError(`sqls.${name}.insall`)),
      update: (tx, v) => tx.executeSql(this.queries.update, v, helpers.logOk(`sqls.${name}.update`), helpers.logError(`sqls.${name}.update`)),
      select: (tx, f) => tx.executeSql(this.queries.select, [], helpers.callWithResults(`sqls.${name}.select`, f), helpers.logError(`sqls.${name}.select`)),
      filter: (tx, v, f) => tx.executeSql(this.queries.filter, [v], helpers.callWithResults(`sqls.${name}.filter`, f), helpers.logError(`sqls.${name}.filter`)),
      getone: (tx, v, f, fe) => tx.executeSql(this.queries.getone, [v], helpers.callIfOneResult(`sqls.${name}.getone`, o => f ? f(o) : undefined, fe), helpers.logError(`sqls.${name}.getone`)),
      delete: (tx, v) => tx.executeSql(this.queries.delete, [v], helpers.logOk(`sqls.${name}.delete`), helpers.logError(`sqls.${name}.delete`)),
      wipe: (tx) => tx.executeSql(this.queries.wipe, [], helpers.logOk(`sqls.${name}.wipe`), helpers.logError(`sqls.${name}.wipe`)),
      drop: (tx) => tx.executeSql(this.queries.drop, [], helpers.logOk(`sqls.${name}.drop`), helpers.logError(`sqls.${name}.drop`)),
      setone: (tx, v, vs) => {
        this.sqls.delete(tx, v);
        this.sqls.insall(tx, [v, ...vs]);
      },
    }
  }
}
