import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Group from "../group";
import Icon from "../icon";
import { Button } from "../button";
import { sizes, globalStyles, useDatabase, transform } from "../../../utils"
import Product from "../product";


export default function Eats({ adding, setAdding }) {
  const { eats } = useDatabase()

  const fields = ['kcal', 'fat', 'saturated', 'carbs', 'sugar', 'protein', 'salt']

  const sums = fields.reduce((a, field) => ({
    ...a, [field]: eats.reduce((sum, eat) => sum + (eat[field] / 100 * eat.amount), 0)
  }), {})

  return (
    // TODO: respect group border radius by scrollable/expanded elements
    <Group title="Eats" value={`${sums.kcal} kcal`} style={!adding && globalStyles.flex}>
      <View style={styles.grid}>
        {fields.slice(1).map(field => {
          return (
            <View key={field} style={[styles.field, globalStyles.spaced]}>
              <Text>{field}</Text>
              <Text>{Math.round(sums[field])} g</Text>
            </View>
          )
        })}
      </View>
      <ScrollView>
        {!adding &&
          eats.map(p => {
            return (<Product key={p.id} obj={p} />)
          })
        }
        {!adding &&
          <Button style={globalStyles.productButton} onPress={() => setAdding(!adding)}>
            <Icon name="plus" color="silver" focused material />
          </Button>
        }
        <View style={{height: 10}}/>
      </ScrollView>
    </Group>
  )
}

const styles = StyleSheet.create({
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
    paddingBottom: sizes.gap.mid,
    flexDirection: 'row',
    flexWrap: "wrap",
  },
})