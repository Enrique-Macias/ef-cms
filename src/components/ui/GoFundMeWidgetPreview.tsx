'use client'

import { useEffect, useRef } from 'react'

interface GoFundMeWidgetPreviewProps {
  widgetCode: string
}

export function GoFundMeWidgetPreview({ widgetCode }: GoFundMeWidgetPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!widgetCode || !containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create a temporary container to parse the widget code
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = widgetCode

    // Extract the div and script elements
    const widgetDiv = tempDiv.querySelector('.gfm-embed')
    const scriptElement = tempDiv.querySelector('script')

    if (widgetDiv && containerRef.current) {
      // Add the widget div to our container
      containerRef.current.appendChild(widgetDiv.cloneNode(true))

      // Execute the script if it exists
      if (scriptElement) {
        // Check if the script is already loaded
        const existingScript = document.querySelector(`script[src="${scriptElement.src}"]`)
        
        if (!existingScript) {
          const newScript = document.createElement('script')
          newScript.src = scriptElement.src
          newScript.defer = scriptElement.defer
          newScript.async = scriptElement.async
          
          // Add the script to the document head
          document.head.appendChild(newScript)

          // Wait for the script to load
          newScript.onload = () => {
            console.log('GoFundMe script loaded')
            // Force a re-render by triggering a DOM change
            setTimeout(() => {
              const widgets = containerRef.current?.querySelectorAll('.gfm-embed')
              if (widgets && widgets.length > 0) {
                // Trigger a re-render by cloning and replacing
                const widget = widgets[0] as HTMLElement
                const clonedWidget = widget.cloneNode(true) as HTMLElement
                widget.parentNode?.replaceChild(clonedWidget, widget)
              }
            }, 1000)
          }

          newScript.onerror = () => {
            console.warn('Failed to load GoFundMe script')
          }
        } else {
          console.log('GoFundMe script already loaded')
          // Force re-initialization
          setTimeout(() => {
            const widgets = containerRef.current?.querySelectorAll('.gfm-embed')
            if (widgets && widgets.length > 0) {
              const widget = widgets[0] as HTMLElement
              const clonedWidget = widget.cloneNode(true) as HTMLElement
              widget.parentNode?.replaceChild(clonedWidget, widget)
            }
          }, 500)
        }
      }
    }

    // Cleanup function
    return () => {
      const container = containerRef.current
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [widgetCode])

  return (
    <div 
      ref={containerRef}
      className="min-h-[200px] flex items-center justify-center"
    />
  )
}