import React from "react";
import { StyleSheet, TextInput, ScrollView, View, Text, Pressable } from "react-native";
import { Button } from "../button";
import Group from "../group";
import Icon from "../icon";
import Product from "../product";
import { sizes, colors, globalStyles, useDatabase } from "../../../utils";


export default function Products({ onCancel }) {
  const { productsFilter, setProductsFilter, products } = useDatabase()
  const [ newProduct, setNewProduct ] = React.useState(false)

  return (
    <Group style={globalStyles.flex}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          value={productsFilter}
          onChangeText={setProductsFilter}
          placeholder='Search products by name'
        />
        <Pressable style={{ justifyContent: 'center', alignItems: 'center', marginRight: 15 }}
          onPress={onCancel}
        >
          <Icon name="close-circle" />
        </Pressable>
      </View>
      <ScrollView>
        {products.map(p => {
          return (<Product key={p.id} obj={p} />)
        })}
        {!!newProduct ?
          <Product onDiscard={() => setNewProduct(false)}/> :
          <Button style={globalStyles.productButton} onPress={() => setNewProduct(true)}>
            <Icon name="plus" color="silver" focused material />
          </Button>
        }
        <View style={{height: 10}}/>
      </ScrollView>
    </Group>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    margin: sizes.gap.mid,
    paddingHorizontal: sizes.gap.mid,
    borderRadius: sizes.radius.mid,
    borderWidth: sizes.gap.line,
    borderColor: colors.palette.silver,
  }
})