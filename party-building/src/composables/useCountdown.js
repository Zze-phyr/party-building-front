// 倒计时函数
import { ref, onUnmounted } from 'vue'

export function useCountdown(initialTime, initialButtonText) {
  const time = ref(initialTime) //倒计时总时间
  const isCounting = ref(false) //倒计时是否已经开始
  let timer = null //是否设定了定时器

  // 按钮文本计算属性
  const buttonText = ref(initialButtonText)

  // 开始倒计时
  const start = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isCounting.value = true
    time.value = initialTime
    updateButtonText()

    timer = setInterval(() => {
      time.value--
      updateButtonText()

      if (time.value <= 0) {
        stop()
      }
    }, 1000)
  }

  // 停止倒计时
  const stop = () => {
    clearInterval(timer)
    timer = null
    isCounting.value = false
    updateButtonText()
  }

  const updateButtonText = () => {
    buttonText.value = isCounting.value ? `倒计时${time.value}s` : initialButtonText
  }

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  return {
    time,
    isCounting,
    buttonText,
    start,
    stop,
  }
}
