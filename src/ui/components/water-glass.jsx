import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Icon from "./icon";
import { sizes, colors, useDatabase } from "../../utils"

export default function WaterGlass ({ id, amount }) {
  const { glassSize, dayFilter, addWater, delWater } = useDatabase()

  const adder = id === undefined && amount === undefined

  const onPress = () => {
    if (adder) addWater({ day: dayFilter, amount: glassSize })
    else delWater(id)
  }

  return (
    <Pressable style={styles.glass} onPress={onPress}>
      <Icon name="cup" size={32} color={adder ? colors.palette.silver : colors.palette.grey} material />
      <Text>{adder ? glassSize : amount} ml</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  glass: {
    padding: 5,
  },
})