import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Icon from "./icon";
import { sizes, colors, globalStyles, useDatabase } from "../../utils";
import { Editable } from "./setting";


const transform = (obj, f) => Object.keys(obj).reduce((a, c) => ({ ...a, [c]: f(c, obj[c]) }), {})
const stringify = obj => transform(obj, (_, v) => String(v))

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


export default function Product({ obj = emptyProduct, onDiscard }) {
  const creatorMode = obj === emptyProduct
   
  const { dayFilter, addEat, delEat, setEat, addProduct, setProduct, delProduct } = useDatabase()
  const [expanded, setExpanded] = React.useState(false)
  const [edits, setEdits] = React.useState(!!creatorMode ? stringify(emptyProduct) : null)
  const [see100g, setSee100g] = React.useState(false)

  const adjustByAmount = 'amount' in obj;
  const fields = ['fat', 'saturated', 'carbs', 'sugar', 'protein', 'salt']

  React.useEffect(() => {
    if (!edits) {
      setSee100g(false)
    }
  }, [edits])

  const expand = expanded || !!edits

  const onEditIconPress = ({ addAmount = false }) => {
    if (!!edits) setExpanded(true)
    const toStringify = addAmount ? { ...obj, amount: 100 } : obj
    setEdits(!!edits ? null : stringify(toStringify))
  }

  const onDelete = () => {
    if (!!adjustByAmount) {
      delEat(obj.id)
    }
    else {
      delProduct(obj.id)
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
    if (!!adjustByAmount) {
      setEat(newObj)
    }
    else {
      setProduct(newObj)
    }
    setExpanded(true)
    setEdits(null)
  }

  const onCreate = () => {
    addProduct({
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

  const onPress = () => {
    if (!edits) {
      setExpanded(!expanded)
    }
  }

  const onCreateEat = () => {
    addEat({
      day: dayFilter,
      amount: edits.amount,
      productId: obj.id,
    })
  }

  const onToggle100gView = () => {
    setSee100g(!see100g)
  }

  const eatEditOptions = [
    { name: ' save', icon: 'check-circle', cb: onSave },
    { name: ' close', icon: 'close-circle', cb: onCancel },
    { name: ' delete', icon: 'trash-can', cb: onDelete },
  ]

  const eatCreateOptions = [
    { name: ' create', icon: 'check-circle', cb: onCreateEat },
    { name: ' discard', icon: 'close-circle', cb: onCancel },
    { name: ' see 100 g', icon: 'eye', cb: onToggle100gView, switchedOn: see100g },
  ]

  const productCreateOptions = [
    { name: ' save', icon: 'check-circle', cb: onCreate },
    { name: ' discard', icon: 'close-circle', cb: onDiscard },
  ]

  const productEditOptions = [
    { name: ' save', icon: 'check-circle', cb: onSave },
    { name: ' close', icon: 'close-circle', cb: onCancel },
    { name: ' delete', icon: 'trash-can', cb: onDelete },
  ]

  const options = !!adjustByAmount ?
    eatEditOptions : (!!edits && 'amount' in edits) ?
      eatCreateOptions : creatorMode ?
      productCreateOptions : 
      productEditOptions;

  const data = !!edits ? edits : obj;

  return (
    <Pressable style={styles.product} onPress={onPress}>
      <View style={globalStyles.spaced}>
        {!adjustByAmount ?
          (!!edits && !('amount' in edits)) ?
            <Editable
              ktype="default"
              style={[styles.editName, globalStyles.elevated]}
              input={edits.name}
              setInput={(v) => setEdits({ ...edits, name: String(v) })}
            /> :
            <Text>{obj.name}</Text> :
          <Text>{obj.name} ({obj.amount} g)</Text>
        }
        <View style={{ flexDirection: 'row' }}>
          {!!edits && !('amount' in edits) ?
            <Editable
              style={[styles.editName, globalStyles.elevated]}
              input={edits.kcal}
              setInput={(v) => setEdits({ ...edits, kcal: String(v) })}
              postfix=" kcal"
            /> :
            (!adjustByAmount && !edits) ?
              <Text style={{ marginRight: 10 }}>{obj.kcal} kcal</Text> :
              <Text style={{ marginRight: 10 }}>{Math.round(obj.kcal / 100 * (see100g ? 100 : data.amount))} kcal</Text>
          }
          {(!!expand && !adjustByAmount) &&
            <Pressable onPress={onEditIconPress} style={{ marginRight: 10 }} disabled={!!edits}>
              <Icon name="circle-edit" material color={!!edits ? 'grey' : 'black'}/>
            </Pressable>
          }
          {!!adjustByAmount ?
            <Pressable onPress={() => onEditIconPress({ addAmount: false })} disabled={!!edits}>
              <Icon name="circle-edit" material color={!!edits ? 'grey' : 'black'} />
            </Pressable> :
            <Pressable onPress={() => onEditIconPress({ addAmount: true })} disabled={!!edits}>
              <Icon name={"plus-circle"} material color={!!edits ? 'grey' : 'black'} />
            </Pressable>
          }
        </View>
      </View>
      {expand &&
        <View style={styles.grid}>
          {fields.map(field => {
            if (!edits || 'amount' in edits) {
              return (
                <View key={field} style={[styles.field, globalStyles.spaced]}>
                  <Text>{field}</Text>
                  {(!adjustByAmount && (!edits || !('amount' in edits))) ?
                    <Text>{obj[field]} g</Text> :
                    <Text>{Math.round(obj[field] / 100 * (see100g ? 100 : data.amount))} g</Text>
                  }
                </View>
              )
            }
            return (
              <Editable
                key={field}
                style={[styles.editField, globalStyles.spaced, globalStyles.elevated]}
                input={edits[field]}
                setInput={(v) => setEdits({ ...edits, [field]: String(v) })}
                postfix=" g"
              >{field}</Editable>
            )
          })}
        </View>
      }
      {(!!edits && 'amount' in edits) &&
        <Editable
          style={[styles.editAmount, globalStyles.spaced, globalStyles.elevated]}
          input={edits.amount}
          setInput={(v) => setEdits({ ...edits, amount: String(v) })}
          postfix=" g"
        >{!!adjustByAmount ? 'new' : 'ate'} amount: </Editable>
      }
      {!!edits &&
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
