import React from "react";
import { View, StyleSheet } from "react-native";
import Group from "../group";
import { sizes, useDatabase } from "../../../utils";
import WaterGlass from "../water-glass";


export default function WaterGlasses() {
  const { water } = useDatabase()

  const sum = water.reduce((a, c) => a + c.amount, 0)

  return (
    <Group title="Water" value={`${sum} ml`}>
      <View style={styles.water}>
        {water.map(({ id, amount }) => {
          return <WaterGlass key={id} id={id} amount={amount} />
        })}
        <WaterGlass />
      </View>
    </Group>
  )
}

const styles = StyleSheet.create({
  water: {
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: "wrap",
  },
})