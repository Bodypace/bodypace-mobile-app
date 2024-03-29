import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Icon from "./icon";
import { sizes, colors, globalStyles, useDatabase, transform } from "../../utils";
import { Editable } from "./setting";


const toStringValues = obj => transform(obj, (_, v) => String(v))

const emptyProduct = {
  name: "?",
  kcal: 0,
  fat: 0,
  saturated: 0,
  carbs: 0,
  sugar: 0,
  protein: 0,
  salt: 0
}

const ProductTypes = Object.freeze({
  EatEditor: 1,
  EatReader: 2,
  EatAdder: 3,
  ProductEditor: 4, 
  ProductReader: 5,
  ProductAdder: 6,
})

export default function Product({ obj = emptyProduct, onDiscard }) {
  const db = useDatabase();
  const [edits, setEdits] = React.useState(obj === emptyProduct ? toStringValues(emptyProduct) : null)
  const [expanded, setExpanded] = React.useState(false)
  const [see100g, setSee100g] = React.useState(false)

  React.useEffect(() => { if (!edits) setSee100g(false) }, [edits])

  const type =
    (obj === emptyProduct) ? ProductTypes.ProductAdder :
      ('amount' in obj) ?
        (edits === null ? ProductTypes.EatReader : ProductTypes.EatEditor) :
        (edits === null ?
          ProductTypes.ProductReader :
          ('amount' in edits ? ProductTypes.EatAdder : ProductTypes.ProductEditor)
        );

  const fields = ['fat', 'saturated', 'carbs', 'sugar', 'protein', 'salt']
  const expand = expanded || !!edits

  const onEditIconPress = ({ addAmount = false }) => {
    if (edits !== null) setExpanded(true)
    setEdits(edits !== null ? null : toStringValues(
      addAmount ? { ...obj, amount: 100 } : obj
    ))
  }

  const onDelete = () => {
    if (type === ProductTypes.EatEditor) {
      db.delEat(obj.id)
    }
    else if (type === ProductTypes.ProductEditor) {
      db.delProduct(obj.id)
    }
  }

  const onCancel = () => {
    setEdits(null)
  }

  const onSave = () => {
    const newObj = transform(edits, (k, v) => {
      switch (typeof (obj[k])) {
        case 'number':
          return Number(v)
        default:
          return v;
      }
    })
    if (type === ProductTypes.EatEditor) {
      db.setEat(newObj)
    }
    else if (type === ProductTypes.ProductEditor) {
      db.setProduct(newObj)
    }
    setExpanded(true)
    setEdits(null)
  }

  const onCreate = () => {
    db.addProduct({
      name: String(edits.name),
      kcal: Number(edits.kcal),
      protein: Number(edits.protein),
      carbs: Number(edits.carbs),
      sugar: Number(edits.sugar),
      fat: Number(edits.fat),
      saturated: Number(edits.saturated),
      salt: Number(edits.salt),
    })
    onDiscard()
  }

  const onPress = () => { if (!edits) setExpanded(!expanded) }

  const onCreateEat = () => {
    db.addEat({
      day: db.dayFilter,
      amount: edits.amount,
      productId: obj.id,
    })
  }

  const onToggle100gView = () => { setSee100g(!see100g) }

  const options = {
    [ProductTypes.EatEditor]: [
      { name: ' save', icon: 'check-circle', cb: onSave },
      { name: ' close', icon: 'close-circle', cb: onCancel },
      { name: ' delete', icon: 'trash-can', cb: onDelete },
    ],
    [ProductTypes.EatReader]: null,
    [ProductTypes.EatAdder]: [
      { name: ' create', icon: 'check-circle', cb: onCreateEat },
      { name: ' discard', icon: 'close-circle', cb: onCancel },
      { name: ' see 100 g', icon: 'eye', cb: onToggle100gView, switchedOn: see100g },
    ],
    [ProductTypes.ProductEditor]: [
      { name: ' save', icon: 'check-circle', cb: onSave },
      { name: ' close', icon: 'close-circle', cb: onCancel },
      { name: ' delete', icon: 'trash-can', cb: onDelete },
    ],
    [ProductTypes.ProductReader]: null,
    [ProductTypes.ProductAdder]: [
      { name: ' save', icon: 'check-circle', cb: onCreate },
      { name: ' discard', icon: 'close-circle', cb: onDiscard },
    ]
  }[type]

  const typesWith = {
    editableProductName: [ProductTypes.ProductEditor, ProductTypes.ProductAdder],
    ateAmountNextToProductName: [ProductTypes.EatEditor, ProductTypes.EatReader],

    editableCalories: [ProductTypes.ProductEditor, ProductTypes.ProductAdder],
    calculatedCalories: [ProductTypes.EatEditor, ProductTypes.EatReader, ProductTypes.EatAdder],

    alwaysVisibleEditButton: [ProductTypes.EatEditor, ProductTypes.EatReader],
    addEatButton: [ProductTypes.EatAdder, ProductTypes.ProductEditor, ProductTypes.ProductReader],

    editableFields: [ProductTypes.ProductEditor, ProductTypes.ProductAdder],
    calculatedFields: [ProductTypes.EatEditor, ProductTypes.EatReader, ProductTypes.EatAdder],

    editableAmount: [ProductTypes.EatEditor, ProductTypes.EatAdder]
  }

  const isOneOf = (type, types) => (types.indexOf(type) !== -1)

  const data = !!edits ? edits : obj;

  return (
    <Pressable style={styles.product} onPress={onPress}>
      <View style={globalStyles.spaced}>
        {
          (isOneOf(type, typesWith.editableProductName)) ?
            <Editable
              ktype="default"
              style={[styles.editName, globalStyles.elevated]}
              input={edits.name}
              setInput={(v) => setEdits({ ...edits, name: String(v) })}
            /> :
            (isOneOf(type, typesWith.ateAmountNextToProductName)) ?
              <Text>{obj.name} ({obj.amount} g)</Text> :
              <Text>{obj.name}</Text>
        }

        <View style={{ flexDirection: 'row' }}>
          {
            (isOneOf(type, typesWith.editableCalories)) ?
              <Editable
                style={[styles.editName, globalStyles.elevated]}
                input={edits.kcal}
                setInput={(v) => setEdits({ ...edits, kcal: String(v) })}
                postfix=" kcal"
              /> :
              (isOneOf(type, typesWith.calculatedCalories)) ?
                <Text style={{ marginRight: 10 }}>{Math.round(obj.kcal / 100 * (see100g ? 100 : data.amount))} kcal</Text> :
                <Text style={{ marginRight: 10 }}>{obj.kcal} kcal</Text>
          }
          {
            (type !== ProductTypes.ProductAdder) &&
            (<>
              {
                (expand || isOneOf(type, typesWith.alwaysVisibleEditButton)) ?
                  <Pressable onPress={onEditIconPress} style={{ marginRight: 10 }} disabled={!!edits}>
                    <Icon name="circle-edit" material color={!!edits ? 'grey' : 'black'} />
                  </Pressable> : <></>
              }
              {
                (isOneOf(type, typesWith.addEatButton)) ?
                  <Pressable onPress={() => onEditIconPress({ addAmount: true })} disabled={!!edits}>
                    <Icon name={"plus-circle"} material color={!!edits ? 'grey' : 'black'} />
                  </Pressable> : <></>
              }
            </>)
          }
        </View>

      </View>
      {expand &&
        <View style={styles.grid}>
          {fields.map(field => isOneOf(type, typesWith.editableFields) ?
            <Editable
              key={field}
              style={[styles.editField, globalStyles.spaced, globalStyles.elevated]}
              input={edits[field]}
              setInput={(v) => setEdits({ ...edits, [field]: String(v) })}
              postfix=" g"
            >{field}</Editable>
            :
            <View key={field} style={[styles.field, globalStyles.spaced]}>
              <Text>{field}</Text>
              {(isOneOf(type, typesWith.calculatedFields)) ?
                <Text>{Math.round(obj[field] / 100 * (see100g ? 100 : data.amount))} g</Text> :
                <Text>{obj[field]} g</Text>
              }
            </View>
          )}
        </View>
      }
      {isOneOf(type, typesWith.editableAmount) &&
        <Editable
          style={[styles.editAmount, globalStyles.spaced, globalStyles.elevated]}
          input={edits.amount}
          setInput={(v) => setEdits({ ...edits, amount: String(v) })}
          postfix=" g"
        >{(type === ProductTypes.EatEditor) ? 'new' : 'ate'} amount: </Editable>
      }
      {options &&
        <View style={{ flexDirection: 'row', justifyContent: "space-evenly", marginTop: 10 }}>
          {options.map(({ name, icon, cb, switchedOn }) => (
            <Pressable key={name} style={[{ flexDirection: 'row' }]} onPress={cb}>
              <Icon name={icon} material focused={!!switchedOn} />
              <Text style={{ color: (switchedOn === true || switchedOn === undefined) ? 'black' : 'grey' }}>{name}</Text>
            </Pressable>
          ))}
        </View>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  product: {
    fontSize: sizes.font.idk,
    margin: sizes.gap.small,
    padding: sizes.gap.mid,
    backgroundColor: colors.palette.anti_flash_white,
    borderRadius: sizes.radius.mid,
  },
  field: {
    // TODO: calculate it so that it doesn't become a one not
    // stretched column on more narrow devices
    width: '47%',
    borderRadius: sizes.radius.mid,
    padding: sizes.gap.small,
    margin: sizes.gap.small,
    marginVertical: 0,
  },
  grid: {
    justifyContent: 'center',
    paddingTop: sizes.gap.mid,
    flexDirection: 'row',
    flexWrap: "wrap",
  },
  editAmount: {
    backgroundColor: colors.palette.anti_flash_white,
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 10
  },
  editField: {
    width: '45%',
    backgroundColor: colors.palette.anti_flash_white,
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  editName: {
    backgroundColor: colors.palette.anti_flash_white,
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  }
})
