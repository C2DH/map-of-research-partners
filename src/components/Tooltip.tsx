import { useSpring, a } from '@react-spring/web'
import { useStore } from './QuickMapbox'
import { useEffect } from 'react'
import type { FC } from 'react'
import './Tooltip.css'
interface TooltipProps {
  className?: string
}

const Tooltip: FC<TooltipProps> = ({ className = '' }) => {
  const selectedFeature = useStore((state) => state.selectedFeature)

  const [animatedStyle, apiAnimatedStyle] = useSpring(() => ({
    opacity: 0,
  }))

  useEffect(() => {
    if (!selectedFeature) {
      apiAnimatedStyle.start({ opacity: 0 })
      return
    }
    apiAnimatedStyle.start({ opacity: 1 })
  }, [selectedFeature])

  return (
    <a.div style={animatedStyle} className={`Tooltip ${className}`}>
      <h2>{selectedFeature?.properties?.name}</h2>
      <div>
        {selectedFeature?.properties?.city},{' '}
        {selectedFeature?.properties?.country}
      </div>
    </a.div>
  )
}

export default Tooltip
