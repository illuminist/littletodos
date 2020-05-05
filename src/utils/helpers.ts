import color from 'color'

export const makeHash = (text: string) => {
  let hash = 0
  if (text.length == 0) {
    return hash
  }
  for (var i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export const makeColor = (id: string) => {
  const c = color.hsl(
    Math.abs(makeHash(id.substring(0, 6))) % 360,
    (Math.abs(makeHash(id.substring(6, 12))) % 50) + 50,
    (Math.abs(makeHash(id.substring(12, 18))) % 50) + 30,
  )
  return c.hsv().string()
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
