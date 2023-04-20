import { ToastAndroid } from "react-native";


const seedData = ({
  db, Settings, SETTINGS, glassSize,
  Products, setProducts,
  Water, setWater,
  Eats, setEats
}) => {
  const seed = (onSuccess) => {
    db.transaction('seedData - insert', (tx) => {
      Settings.sqls.getone(tx, SETTINGS.GLASS_SIZE.ID, null,
        () => Settings.sqls.setone(tx, SETTINGS.GLASS_SIZE.ID, [glassSize])
      )
      Products.sqls.select(tx, (storedProducts) => {
        if (storedProducts.length === 0) {
          Products.sqls.insert(tx, ['maslanka', 'dolina defaultow', 72, null, null, null, null, null, null])
        }
      })
      Water.sqls.select(tx, (storedWater) => {
        if (storedWater.length === 0) {
          const glasses = [200, 220, 250, 280, 300, 320]
          for (let i = 0; i < 10; i++) {
            const randomGlassSize = glasses[Math.floor(Math.random() * glasses.length)];
            Water.sqls.insert(tx, [dayFilter, randomGlassSize]);
          }
        }
      })
      Eats.sqls.select(tx, (storedEats) => {
        if (storedEats.length === 0) {
          const amounts = [50, 100, 200, 350, 500, 750]
          for (let i = 0; i < 4; i++) {
            const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
            Eats.sqls.insert(tx, [dayFilter, randomAmount, 1]);
          }
        }
      })
    }, onSuccess)
  }

  seed(() => {
    db.transaction('seedData - refresh', (tx) => {
      Products.sqls.select(tx, setProducts)
      Water.sqls.select(tx, setWater)
      Eats.sqls.select(tx, setEats)
    })
  })
}

const wipeData = ({
  db,
  Products, setProducts,
  Water, setWater,
  Eats, setEats
}) => {
  const wipe = (onSuccess) => {
    db.transaction('wipeData - delete', (tx) => {
      Water.sqls.wipe(tx)
      Eats.sqls.wipe(tx)
      Products.sqls.wipe(tx)
    }, onSuccess)
  }

  wipe(() => {
    db.transaction('wipeData - refresh', (tx) => {
      Products.sqls.select(tx, setProducts)
      Water.sqls.select(tx, setWater)
      Eats.sqls.select(tx, setEats)
    })
  })
}

const runCommand = (command, context) => {
  // TODO: filter refreshes should not execute before init or if the filter did not change
  const commands = {
    '!seed': seedData,
    '!wipe': wipeData
  }

  if (command in commands) {
    setProductsFilter()
    commands[command](context)
    ToastAndroid.show(`ran ${command} command`, ToastAndroid.SHORT)
    return true
  }

  return false
}

export const commandsRunner = ({
  db, Settings, SETTINGS, glassSize,
  Products, setProducts,
  Water, setWater,
  Eats, setEats
}) => {
  const context = {
    db, Settings, SETTINGS, glassSize,
    Products, setProducts,
    Water, setWater,
    Eats, setEats
  }
  return (command) => runCommand(command, context)
}