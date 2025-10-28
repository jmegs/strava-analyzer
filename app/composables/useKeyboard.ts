import { onBeforeUnmount, onMounted } from "vue"

type BindingFn = () => void
type Bindings = Record<string, BindingFn>

export function useKeyboard(bindings: Bindings) {
	let buffer: string[] = []
	let lastKeyTime = 0
	const SEQ_TIMEOUT_MS = 1000 // reset sequence after 1s

	function handler(e: KeyboardEvent) {
		const now = Date.now()
		if (now - lastKeyTime > SEQ_TIMEOUT_MS) buffer = []
		lastKeyTime = now

		const key = e.key
		buffer.push(key)
		if (buffer.length > 2) buffer.shift()

		const single = key
		const seq = buffer.join(" ")

		if (bindings[single]) {
			e.preventDefault()
			bindings[single]()
			buffer = []
			return
		}

		if (bindings[seq]) {
			e.preventDefault()
			bindings[seq]()
			buffer = []
			return
		}
	}

	onMounted(() => {
		window.addEventListener("keydown", handler)
	})

	onBeforeUnmount(() => {
		window.removeEventListener("keydown", handler)
	})
}
