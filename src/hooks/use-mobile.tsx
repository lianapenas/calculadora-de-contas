
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Usar matchMedia para detectar tamanho da tela
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Adicionar listener para mudanças de tamanho
    mql.addEventListener("change", onChange)
    
    // Definir estado inicial
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Limpeza
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
