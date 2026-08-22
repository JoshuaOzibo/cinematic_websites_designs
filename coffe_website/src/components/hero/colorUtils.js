export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export const smoothstep = (t) => {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

export function rgbToHsl(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min

  if (d === 0) return { h: 0, s: 0, l }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === rn) h = ((gn - bn) / d) % 6
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4

  h *= 60
  if (h < 0) h += 360
  return { h, s, l }
}


export function mixHsl(entries) {
  let x = 0
  let y = 0
  let s = 0
  let l = 0
  let total = 0

  for (const { color, weight } of entries) {
    if (weight <= 0) continue
    const rad = (color.h * Math.PI) / 180
    x += Math.cos(rad) * weight
    y += Math.sin(rad) * weight
    s += color.s * weight
    l += color.l * weight
    total += weight
  }

  if (total === 0) return entries[0].color

  let h = (Math.atan2(y / total, x / total) * 180) / Math.PI
  if (h < 0) h += 360
  return { h, s: s / total, l: l / total }
}

export function hslString({ h, s, l }, ds = 0, dl = 0) {
  const sat = clamp(s + ds, 0, 1) * 100
  const lum = clamp(l + dl, 0, 1) * 100
  return `hsl(${h.toFixed(1)} ${sat.toFixed(1)}% ${lum.toFixed(1)}%)`
}
const DRINK_CROP = { x: 0.24, y: 0.52, w: 0.52, h: 0.34 }

export function extractAccent(src, { lightness = 0.3, sample = 56 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onerror = reject
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = sample
        canvas.height = sample
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return reject(new Error('no 2d context'))
        ctx.drawImage(
          img,
          img.naturalWidth * DRINK_CROP.x,
          img.naturalHeight * DRINK_CROP.y,
          img.naturalWidth * DRINK_CROP.w,
          img.naturalHeight * DRINK_CROP.h,
          0,
          0,
          sample,
          sample,
        )
        const { data } = ctx.getImageData(0, 0, sample, sample)

        let x = 0
        let y = 0
        let satSum = 0
        let total = 0

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 200) continue
          const hsl = rgbToHsl(data[i], data[i + 1], data[i + 2])
          if (hsl.l > 0.82 || hsl.l < 0.14 || hsl.s < 0.2) continue
          const weight = hsl.s * hsl.s * (1 - Math.abs(hsl.l - 0.5) * 0.6)
          const rad = (hsl.h * Math.PI) / 180
          x += Math.cos(rad) * weight
          y += Math.sin(rad) * weight
          satSum += hsl.s * weight
          total += weight
        }

        if (total === 0) return reject(new Error('no representative pixels'))

        let h = (Math.atan2(y / total, x / total) * 180) / Math.PI
        if (h < 0) h += 360

        resolve({
          h,
          s: clamp((satSum / total) * 1.3, 0.44, 0.64),
          l: lightness,
        })
      } catch (error) {
        reject(error)
      }
    }
    img.src = src
  })
}
