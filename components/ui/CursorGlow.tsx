'use client'

import { useEffect } from 'react'

export default function CursorGlow() {
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.className = 'cursor-glow'
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(255,0,255,0.2) 50%, transparent 70%);
      box-shadow: 0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(255,0,255,0.3);
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease-out;
      mix-blend-mode: screen;
    `
    document.body.appendChild(cursor)

    const spotlight = document.createElement('div')
    spotlight.className = 'cursor-spotlight'
    spotlight.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      background: radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease-out;
      mix-blend-mode: screen;
    `
    document.body.appendChild(spotlight)

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      spotlight.style.left = `${e.clientX}px`
      spotlight.style.top = `${e.clientY}px`
    }

    const handleMouseEnter = () => {
      cursor.style.opacity = '1'
      spotlight.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      cursor.style.opacity = '0'
      spotlight.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Hide default cursor on interactive elements
    const style = document.createElement('style')
    style.textContent = `
      a, button, [role="button"], input, textarea, select {
        cursor: none !important;
      }
      .cursor-glow {
        opacity: 0;
      }
      .cursor-spotlight {
        opacity: 0;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cursor.remove()
      spotlight.remove()
      style.remove()
    }
  }, [])

  return null
}

