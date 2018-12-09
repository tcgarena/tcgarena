const uniqFormats = items => {
  let formats = []
  items.forEach(item => {
    if (!formats.includes(item.format)) 
      formats.push(item.format)
  })
  return formats
}

export default uniqFormats