import * as React from "react"

// Mobile-first approach - consider everything mobile unless explicitly larger
const MOBILE_BREAKPOINT = 768
const SMALL_MOBILE_BREAKPOINT = 375

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(true) // Default to mobile

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean>(true)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SMALL_MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT)
    }
    
    setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isSmallMobile
}

export function useScreenOrientation() {
  const [isLandscape, setIsLandscape] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerHeight < window.innerWidth)
    }
    
    checkOrientation()
    
    window.addEventListener("orientationchange", checkOrientation)
    window.addEventListener("resize", checkOrientation)
    
    return () => {
      window.removeEventListener("orientationchange", checkOrientation)
      window.removeEventListener("resize", checkOrientation)
    }
  }, [])

  return isLandscape
}
