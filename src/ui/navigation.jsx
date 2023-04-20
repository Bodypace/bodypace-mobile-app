import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "./components"
import { Diet, Settings } from './screens'
import { langEn, colors } from "../utils";


export default function Screens({ navigator }) {
  const lang = langEn.navigator;

  return (
    <NavigationContainer>
      <navigator.Navigator initialRouteName={lang.diet} barStyle={styles.bar}>
        <navigator.Screen name={lang.diet} component={Diet}
          options={{ tabBarIcon: ({ focused }) => (
            <Icon focused={focused} name="food-apple" material />
          )}}
        />
        <navigator.Screen name={lang.settings} component={Settings}
          options={{ tabBarIcon: ({ focused }) => (
            <Icon focused={focused} name="settings" />
          )}}
        />
      </navigator.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.palette.heart_3,
  }
})