import { useImperativeHandle, useState } from "react"

export interface CopyButtonRef {
	copy: () => Promise<void>
}

export function CopyButton({
	id,
	ref,
}: {
	id: number
	ref?: React.Ref<CopyButtonRef>
}) {
	const [busy, setBusy] = useState(false)

	const handle = async (activityId: number) => {
		setBusy(true)
		// needs to be a native fetch because rr's `fetcher` doesn't return a promise
		// and safari can't do async clipboard writes
		try {
			const text = new ClipboardItem({
				"text/plain": fetch(`/detail/${activityId}`)
					.then((res) => res.json())
					.then(
						(data) =>
							new Blob([JSON.stringify(data, null, 2)], {
								type: "text/plain",
							}),
					),
			})

			await navigator.clipboard.write([text])
		} catch (err) {
			console.error("Failed to copy: ", err)
		}
		setBusy(false)
	}

	useImperativeHandle(ref, () => ({
		copy: () => handle(id),
	}))

	return (
		<button
			type="button"
			onClick={() => handle(id)}
			className="px-2 py-0.5 inline-grid place-items-center border tracking-wide uppercase disabled:opacity-50 hover:opacity-50 cursor-pointer"
		>
			<span className="w-[4ch]">{busy ? "...." : "Copy"}</span>
		</button>
	)
}
