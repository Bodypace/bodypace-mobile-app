import React, { useState, useEffect, createContext, useContext } from "react";
import { Table } from "./database/table"
import { openDatabase } from "./database/database";
// import { commandsRunner } from "./database/commands";
import logger from "../logging";
import moment from "moment";


export const databaseContext = createContext();

const Products = new Table({
  name: 'products',
  fields: [
    { name: 'name', def: 'text not null' },
    // TODO: remove vendor
    { name: 'vendor', def: 'text' },
    { name: 'kcal', def: 'real' },
    { name: 'protein', def: 'real' },
    { name: 'carbs', def: 'real' },
    { name: 'sugar', def: 'real' },
    { name: 'fat', def: 'real' },
    { name: 'saturated', def: 'real' },
    { name: 'salt', def: 'real' },
  ],
  filter: 'instr(lower(name), lower(?))',
  order: 'asc',
})

const Water = new Table({
  name: 'water',
  fields: [ // unused update
    { name: 'day', def: 'text not null' },
    { name: 'amount', def: 'integer not null' },
  ],
  filter: 'day = ?',
})

const Eats = new Table({
  name: 'eats',
  fields: [
    { name: 'day', def: 'text not null' },
    { name: 'amount', def: 'integer' },
    { name: 'productId', def: 'integer not null' },
  ],
  foreign: 'foreign key (productId) references products (id) on update cascade on delete cascade',
  select: {
    join: 'as e inner join products as p on e.productId = p.id',
    fields: [
      'e.id as id',
      'e.day as day',
      'e.amount as amount',
      'e.productId as productId',
      'p.name as name',
      'p.vendor as vendor',
      'p.kcal as kcal',
      'p.protein as protein',
      'p.carbs as carbs',
      'p.sugar as sugar',
      'p.fat as fat',
      'p.saturated as saturated',
      'p.salt as salt',
    ]
  },
  filter: 'day = ?',
  order: 'asc',
})

const Settings = new Table({
  name: 'settings',
  fields: [
    { name: 'value', def: 'int' },
  ],
  filter: 'id = ?',
})

const SETTINGS = Object.freeze({
  GLASS_SIZE: {
    ID: 1,
    DEFAULT: 250
  }
})

export function useDatabase() {
  return useContext(databaseContext);
}

export function ProvideDatabase({ children }) {
  const [db, setDb] = useState(null)
  const [glassSize, _setGlassSize] = useState('') // SETTINGS.GLASS_SIZE.DEFAULT)
  const [products, _setProducts] = useState([])
  const [productsFilter, _setProductsFilter] = useState(null)
  const [water, _setWater] = useState([])
  const [eats, _setEats] = useState([])
  const [dayFilter, _setDayFilter] = useState(null)

  const logSetState = (name, setter) => v => { logger.log(`database: ${name}(${v})`); setter(v) }
  const setGlassSize = logSetState('setGlassSize', (v) => v !== null && v !== glassSize ? _setGlassSize(v) : undefined)
  const setProducts = logSetState('setProducts', _setProducts)
  const setProductsFilter = logSetState('setProductsFilter', _setProductsFilter)
  const setWater = logSetState('setWater', _setWater)
  const setEats = logSetState('setEats', _setEats)
  const setDayFilter = logSetState('setDayFilter', _setDayFilter)

  const refreshGlassSize = () => db.readOne(Settings, SETTINGS.GLASS_SIZE.ID, o => setGlassSize(o.value))
  const refreshProducts = (onSuccess) => db.refresh(Products, productsFilter, setProducts, onSuccess)
  const refreshWater = (onSuccess) => db.refresh(Water, dayFilter, setWater, onSuccess)
  const refreshEats = (onSuccess) => db.refresh(Eats, dayFilter, setEats, onSuccess)

  const databaseClient = {
    // settings.glassSize
    glassSize,
    setGlassSize: (v) => {
      if (db !== null && v !== null && v !== "" && v !== glassSize) {
        db.update(Settings, { value: v, id: SETTINGS.GLASS_SIZE.ID }, refreshGlassSize)
      }
    },

    // products
    products,
    setProduct: (v) => db.update(Products, v, refreshProducts),
    addProduct: (v, onSuccess) => db.insert(Products, v, () => refreshProducts(onSuccess)),
    delProduct: (v) => db.delete(Products, v, refreshProducts),
    productsFilter,
    setProductsFilter,

    // water
    water,
    addWater: (v, onSuccess) => db.insert(Water, v, () => refreshWater(onSuccess)),
    delWater: (v) => db.delete(Water, v, refreshWater),

    // // eats
    eats,
    setEat: (v) => db.update(Eats, v, refreshEats),
    addEat: (v, onSuccess) => db.insert(Eats, v, () => refreshEats(onSuccess)),
    delEat: (v) => db.delete(Eats, v, refreshEats),

    // day filter
    dayFilter,
    setDayFilter
  }

  const tables = [Settings, Products, Water, Eats]
  const fetch = (onSuccess) => {
    db.transaction('fetch', (tx) => {
      const insertGlassSize = () => {
        Settings.sqls.insall(tx, [SETTINGS.GLASS_SIZE.ID, SETTINGS.GLASS_SIZE.DEFAULT]);
        setGlassSize(SETTINGS.GLASS_SIZE.DEFAULT); 
      }

      const updateGlassSize = () => {
        Settings.sqls.update(tx, [SETTINGS.GLASS_SIZE.DEFAULT, SETTINGS.GLASS_SIZE.ID]);
        setGlassSize(SETTINGS.GLASS_SIZE.DEFAULT); 
      }

      const fetchGlassSize = (obj) => {
        if (!obj.value) {
          updateGlassSize();
        }
        else {
          setGlassSize(obj.value)
        }
      }

      Settings.sqls.getone(tx, SETTINGS.GLASS_SIZE.ID, fetchGlassSize, insertGlassSize)
      Products.sqls.select(tx, setProducts)
      Water.sqls.select(tx, setWater)
      Eats.sqls.select(tx, setEats)
    }, onSuccess)
  }

  // const runCommand = commandsRunner({
  //   db, Settings, SETTINGS, glassSize,
  //   Products, setProducts,
  //   Water, setWater,
  //   Eats, setEats
  // })

  const initDayFilter = () => setDayFilter(moment().format('YYYY-MM-DD'))

  // use double '=== null' check?
  useEffect(() => { db === null && openDatabase().then(setDb) }, [db])
  useEffect(() => { db !== null && dayFilter === null && db.setup(tables, () => fetch(initDayFilter)) }, [dayFilter, db])
  useEffect(() => { db !== null && dayFilter !== null && refreshProducts() }, [dayFilter, productsFilter])
  // useEffect(() => { db !== null && dayFilter !== null && (runCommand(productsFilter) || refreshProducts()) }, [dayFilter, productsFilter])
  useEffect(() => { db !== null && dayFilter !== null && refreshWater() }, [dayFilter])
  useEffect(() => { db !== null && dayFilter !== null && refreshEats() }, [dayFilter])
  useEffect(() => { db !== null && dayFilter !== null && refreshEats() }, [products])

  return (
    <databaseContext.Provider value={databaseClient} >
      {children}
    </databaseContext.Provider >
  )
}
