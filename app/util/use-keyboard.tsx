import { useEffect, useRef } from "react"

type KeyHandler = (event: KeyboardEvent) => void

interface UseKeyboardOptions {
	bindings: Record<string, KeyHandler>
	sequenceTimeout?: number // ms between keys to count as a sequence
	enabled?: boolean
}

/**
 * Example usage:
 *
 * useKeyboard({
 *   bindings: {
 *     j: () => moveDown(),
 *     k: () => moveUp(),
 *     "g g": () => scrollToTop(),
 *     "Shift+G": () => scrollToBottom(),
 *   },
 * });
 */

export function useKeyboard({
	bindings,
	sequenceTimeout = 500,
	enabled = true,
}: UseKeyboardOptions) {
	const sequenceRef = useRef<string[]>([])
	const timerRef = useRef<number | null>(null)

	useEffect(() => {
		if (!enabled) return

		const normalizeKey = (e: KeyboardEvent) => {
			const parts: string[] = []
			if (e.ctrlKey) parts.push("Ctrl")
			if (e.altKey) parts.push("Alt")
			if (e.metaKey) parts.push("Meta")
			if (e.shiftKey && e.key.length > 1) parts.push("Shift") // for Shift-G etc
			parts.push(e.key)
			return parts.join("+")
		}

		const handle = (e: KeyboardEvent) => {
			const key = normalizeKey(e)

			// direct match
			if (bindings[key]) {
				e.preventDefault()
				bindings[key](e)
				return
			}

			// sequence handling
			if (timerRef.current) clearTimeout(timerRef.current)
			sequenceRef.current.push(key.toLowerCase())

			const seq = sequenceRef.current.join(" ")

			if (bindings[seq]) {
				e.preventDefault()
				bindings[seq](e)
				sequenceRef.current = []
				return
			}

			// reset timer
			timerRef.current = window.setTimeout(() => {
				sequenceRef.current = []
			}, sequenceTimeout)
		}

		window.addEventListener("keydown", handle)
		return () => {
			window.removeEventListener("keydown", handle)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [bindings, sequenceTimeout, enabled])
}
