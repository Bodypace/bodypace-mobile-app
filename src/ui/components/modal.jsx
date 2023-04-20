import React from 'react'
import { View, StyleSheet, Modal as NativeModal } from 'react-native'


export default function Modal({ children, visible = false, onClose }) {
  return (
    <NativeModal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {children}
      </View>
    </NativeModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})