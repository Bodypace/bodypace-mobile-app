import React from 'react';
import { Text } from 'react-native'

import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

import {
  Sanchez_400Regular,
  Sanchez_400Regular_Italic,
} from '@expo-google-fonts/sanchez';

export const WithFonts = ({ children, Placeholder }) => {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
    Sanchez_400Regular,
    Sanchez_400Regular_Italic,
  });

  return fontsLoaded ? children : <Placeholder/>
}

export const roboto = {
  thin: "Roboto_100Thin",
  thin_italic: "Roboto_100Thin_Italic",
  light: "Roboto_300Light",
  light_italic: "Roboto_300Light_Italic",
  regular: "Roboto_400Regular",
  regular_italic: "Roboto_400Regular_Italic",
  medium: "Roboto_500Medium",
  medium_italic: "Roboto_500Medium_Italic",
  bold: "Roboto_700Bold",
  bold_italic: "Roboto_700Bold_Italic",
  superbold: "Roboto_900Black",
  superbold_italic: "Roboto_900Black_Italic",
}

export const sanchez = {
  regular: "Sanchez_400Regular",
  regular_italic: "Sanchez_400Regular_Italic",
}