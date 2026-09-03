import type { Directive } from 'vue'

interface ScrollData {
  onWheel: (e: WheelEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseUp: () => void
  onClickCapture: (e: MouseEvent) => void
}

const map = new WeakMap<HTMLElement, ScrollData>()

export const vHorizontalScroll: Directive<HTMLElement> = {
  mounted(el) {
    let isMouseDown = false
    let startX = 0
    let scrollLeftStart = 0
    let hasMoved = false

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth
        if (maxScroll > 1) {
          if ((e.deltaY > 0 && el.scrollLeft < maxScroll - 1) || (e.deltaY < 0 && el.scrollLeft > 1)) {
            e.preventDefault()
            el.scrollLeft += e.deltaY
          }
        }
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      isMouseDown = true
      hasMoved = false
      startX = e.clientX
      scrollLeftStart = el.scrollLeft
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) {
        if (!hasMoved) {
          hasMoved = true
          el.style.userSelect = 'none'
          el.style.cursor = 'grabbing'
        }
        e.preventDefault()
        el.scrollLeft = scrollLeftStart - dx
      }
    }

    const onMouseUp = () => {
      if (!isMouseDown) return
      isMouseDown = false
      el.style.userSelect = ''
      el.style.cursor = ''
    }

    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault()
        e.stopPropagation()
        hasMoved = false
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('click', onClickCapture, true)

    map.set(el, { onWheel, onMouseDown, onMouseMove, onMouseUp, onClickCapture })
  },

  unmounted(el) {
    const data = map.get(el)
    if (!data) return
    el.removeEventListener('wheel', data.onWheel)
    el.removeEventListener('mousedown', data.onMouseDown)
    window.removeEventListener('mousemove', data.onMouseMove)
    window.removeEventListener('mouseup', data.onMouseUp)
    el.removeEventListener('click', data.onClickCapture, true)
    map.delete(el)
  },
}
