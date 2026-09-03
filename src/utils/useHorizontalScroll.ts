import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface HorizontalScrollOptions {
  step?: number
  enableWheel?: boolean
  enableDrag?: boolean
}

export function useHorizontalScroll(
  containerRef: Ref<HTMLElement | null>,
  options: HorizontalScrollOptions = {},
) {
  const { step = 320, enableWheel = true, enableDrag = true } = options

  const canScrollLeft = ref(false)
  const canScrollRight = ref(false)
  const isDragging = ref(false)

  let isMouseDown = false
  let startX = 0
  let scrollLeftStart = 0
  let hasDragged = false

  function updateScrollState() {
    const el = containerRef.value
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    canScrollLeft.value = el.scrollLeft > 2
    canScrollRight.value = maxScroll > 2 && el.scrollLeft < maxScroll - 2
  }

  function scrollBy(delta: number) {
    const el = containerRef.value
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  function scrollLeft() {
    scrollBy(-step)
  }

  function scrollRight() {
    scrollBy(step)
  }

  function onWheel(e: WheelEvent) {
    if (!enableWheel) return
    const el = containerRef.value
    if (!el) return

    // If mainly vertical scrolling, translate to horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll > 2) {
        if ((e.deltaY > 0 && el.scrollLeft < maxScroll - 1) || (e.deltaY < 0 && el.scrollLeft > 1)) {
          e.preventDefault()
          el.scrollLeft += e.deltaY
          updateScrollState()
        }
      }
    }
  }

  function onMouseDown(e: MouseEvent) {
    if (!enableDrag) return
    const el = containerRef.value
    if (!el) return
    // Only primary (left) button
    if (e.button !== 0) return

    isMouseDown = true
    hasDragged = false
    startX = e.clientX
    scrollLeftStart = el.scrollLeft
    el.style.scrollBehavior = 'auto'
  }

  function onMouseMove(e: MouseEvent) {
    if (!isMouseDown) return
    const el = containerRef.value
    if (!el) return

    const dx = e.clientX - startX
    if (Math.abs(dx) > 3) {
      if (!isDragging.value) {
        isDragging.value = true
        el.style.userSelect = 'none'
        el.style.cursor = 'grabbing'
      }
      hasDragged = true
      e.preventDefault()
      el.scrollLeft = scrollLeftStart - dx
      updateScrollState()
    }
  }

  function onMouseUp() {
    if (!isMouseDown) return
    isMouseDown = false
    isDragging.value = false

    const el = containerRef.value
    if (el) {
      el.style.userSelect = ''
      el.style.cursor = ''
      el.style.scrollBehavior = ''
    }
  }

  function onClickCapture(e: MouseEvent) {
    if (hasDragged) {
      e.preventDefault()
      e.stopPropagation()
      hasDragged = false
    }
  }

  onMounted(() => {
    const el = containerRef.value
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })

    if (enableWheel) {
      el.addEventListener('wheel', onWheel, { passive: false })
    }

    if (enableDrag) {
      el.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      el.addEventListener('click', onClickCapture, true)
    }

    window.addEventListener('resize', updateScrollState, { passive: true })
  })

  onBeforeUnmount(() => {
    const el = containerRef.value
    if (el) {
      el.removeEventListener('scroll', updateScrollState)
      if (enableWheel) el.removeEventListener('wheel', onWheel)
      if (enableDrag) {
        el.removeEventListener('mousedown', onMouseDown)
        el.removeEventListener('click', onClickCapture, true)
      }
    }
    if (enableDrag) {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.removeEventListener('resize', updateScrollState)
  })

  return {
    canScrollLeft,
    canScrollRight,
    isDragging,
    scrollLeft,
    scrollRight,
    updateScrollState,
  }
}
