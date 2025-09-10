// 倒计时函数
import { ref, onUnmounted } from 'vue'

export function useCountdown(initialTime, initialButtonText) {
  let time = initialTime //倒计时总时间
  let isCounting = false //倒计时是否已经开始
  let timer = null //是否设定了定时器

  // 按钮文本计算属性
  const buttonText = ref(initialButtonText)

  // 开始倒计时
  const start = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isCounting = true
    time = initialTime
    updateButtonText()

    timer = setInterval(() => {
      time--
      updateButtonText()

      if (time <= 0) {
        stop()
      }
    }, 1000)
  }

  // 停止倒计时
  const stop = () => {
    clearInterval(timer)
    timer = null
    isCounting = false
    updateButtonText()
  }

  const updateButtonText = () => {
    buttonText.value = isCounting ? `倒计时${time}s` : initialButtonText
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
