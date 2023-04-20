import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { sanchez, sizes } from '../../utils';
import heart from '../../../assets/heart_512.png';


export default function Logo() {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={heart} />
      <Text style={styles.text}>Bodypace</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    paddingVertical: sizes.gap.mid,
  },
  image: {
    marginRight: sizes.gap.mid,
    height: sizes.icon.logo,
    width: sizes.icon.logo,
  },
  text: {
    alignSelf: "stretch",
    textAlignVertical: "center",
    fontFamily: sanchez.regular,
    fontSize: sizes.font.large,
  },
})