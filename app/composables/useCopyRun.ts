export function useCopyRun() {
	const busy = ref(false);
	const copied = ref(false);
	const handle = async (id: number) => {
		busy.value = true;

		try {
			const text = new ClipboardItem({
				"text/plain": $fetch(`/api/run/${id}`)
					.then((json) => JSON.stringify(json, null, 2))
					.then((str) => new Blob([str], { type: "text/plain" })),
			});
			await navigator.clipboard.write([text]);
		} catch (e) {
			console.error("Failed to copy: ", e);
		} finally {
			busy.value = false;
			copied.value = true;
			setTimeout(() => (copied.value = false), 1000);
		}
	};
	return { copying: busy, copied, copyRun: handle };
}
