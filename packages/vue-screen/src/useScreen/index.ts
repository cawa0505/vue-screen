import { reactive } from 'vue'
import { inBrowser } from '../utils'
import { ScreenObject, ScreenConfig } from '../types'

// GoogleBot default screen properties
export const DEFAULT_WIDTH = 410
export const DEFAULT_HEIGHT = 730
export const DEFAULT_ORIENTATION = 'portrait'
export const DEFAULT_TOUCH_SUPPORT = true

export const useScreen = (config: ScreenConfig = {}): Readonly<ScreenObject> => {
  const width = config.width || DEFAULT_WIDTH
  const height = config.height || DEFAULT_HEIGHT
  const orientation = config.orientation || DEFAULT_ORIENTATION
  const touch = config.touch === undefined ? DEFAULT_TOUCH_SUPPORT : config.touch

  const screen = reactive({
    resolution: `${width}x${height}`,
    width: width,
    height: height,
    orientation: orientation,
    portrait: orientation === 'portrait',
    landscape: orientation !== 'portrait',
    touch: touch,
  } as ScreenObject)

  const updateWindowProperties = () => {
    screen.width = window.innerWidth
    screen.height = window.innerHeight
    screen.resolution = `${screen.width}x${screen.height}`
  }
  
  const updateOrientationPropperties = (e: MediaQueryListEvent) => {
    screen.portrait = e.matches
    screen.landscape = !e.matches
    screen.orientation = e.matches ? 'portrait' : 'landscape'
  }
  
  if (inBrowser) {
    window.addEventListener('resize', updateWindowProperties)
    updateWindowProperties()
  
    const query = window.matchMedia('(orientation: portrait)')
    if ('addEventListener' in query) {
      query.addEventListener('change', updateOrientationPropperties);
    } else {
      // query.addListener is not deprecated for iOS 12
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (query as any).addListener(updateOrientationPropperties)
    }

    // This does not react to resize events.
    // You always need to reload the browser to add/remove touch support,
    // even when using DevTools device simulation
    screen.touch = 'ontouchstart' in window
  }

  return screen as Readonly<ScreenObject>
}