import React from "react";
import { Pressable } from "react-native";
import Group from "../group";
import { useDatabase } from "../../../utils";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from "moment";


export default function Calendar() {
  const { dayFilter, setDayFilter } = useDatabase()

  const selectDay = () => {
    DateTimePickerAndroid.open({
      value: new Date(moment(dayFilter)),
      onChange: (_, selected) => { setDayFilter(moment(selected).format('YYYY-MM-DD')) },
      mode: 'date',
      is24Hour: false,
    });
  }

  return (
    <Pressable onPress={selectDay}>
      <Group title={dayFilter} />
    </Pressable>
  )
}