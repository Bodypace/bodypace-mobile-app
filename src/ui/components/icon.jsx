import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { sizes, colors } from '../../utils';

export default function Icon({
  focused, name, size = sizes.icon.default, color = colors.palette.black, material = false
}) {
  const IconComponent = material ? MaterialCommunityIcons : Ionicons;
  // const prefix = material ? 'md' : ''
  const prefix = ''
  const postfix = focused ? '' : '-outline'

  return <IconComponent
    name={`${prefix}${name}${postfix}`}
    size={size}
    color={color}
  />
}