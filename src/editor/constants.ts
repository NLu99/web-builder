export const DESKTOP_WIDTH = 1160
export const MOBILE_WIDTH = 375
export const GRID = 8
export const OVERLAY_BREAKPOINT = 1024
export const CONTENT_ONLY_BREAKPOINT = 640

export function snap(value: number) {
  return Math.round(value / GRID) * GRID
}
