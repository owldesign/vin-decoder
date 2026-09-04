const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "*": "nwnnwnwnn",
}

const NARROW = 2
const WIDE = 6

interface BarcodeDisplayProps {
  value: string
}

export const BarcodeDisplay = ({ value }: BarcodeDisplayProps) => {
  if (!value) return null

  const rects: { x: number; width: number; key: number }[] = []
  let x = 8

  for (const character of `*${value}*`) {
    const pattern = CODE39[character]
    if (!pattern) continue
    for (let index = 0; index < 9; index += 1) {
      const width = pattern[index] === "w" ? WIDE : NARROW
      if (index % 2 === 0) {
        rects.push({ x, width, key: rects.length })
      }
      x += width
    }
    x += NARROW
  }

  return (
    <svg
      viewBox={`0 0 ${x + 6} 100`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Code 39 barcode for ${value}`}
      className="block h-16 w-full md:h-24"
      style={{ opacity: value.length === 17 ? 1 : 0.35 }}
    >
      {rects.map((rect) => (
        <rect
          key={rect.key}
          x={rect.x}
          y={0}
          width={rect.width}
          height={100}
          fill="#111111"
        />
      ))}
    </svg>
  )
}
