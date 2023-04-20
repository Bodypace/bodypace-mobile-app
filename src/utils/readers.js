
export const readProductField = (item, field) =>
  item.__typename === "Product"
    ? item[field]
    : item.product[field]

export const readProductFields = (item, fields) =>
  fields.map(field => readProductField(item, field))

export const readPrice = item =>
  item.__typename === "Buy"
    ? item.price
    : item.__typename === "Eat" && item.buy
      ? item.buy.price * item.amount / item.buy.amount
      : undefined

export const readNutrient = (item, field) =>
  Math.round(
    (item.__typename === "Product" || item.__typename === "Goal")
      ? item[field] || 0
      : (item.product[field] || 0) * item.amount / 100
  )