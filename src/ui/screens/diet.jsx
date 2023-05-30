import React from "react";
import { Screen, Logo, Group } from "../components"


export default function DietScreen() {
  const [adding, setAdding] = React.useState(false)

  return (
    <Screen>
      <Logo />
      {!adding && <Group.Calendar/> }
      <Group.Eats adding={adding} setAdding={setAdding}/>
      {!!adding ?
        <Group.Products onCancel={() => setAdding(false)}/> :
        <Group.WaterGlasses />
      }
    </Screen>
  )
}
