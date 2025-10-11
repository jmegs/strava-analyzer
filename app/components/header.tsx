export function Header({
	stats,
}: {
	stats: { mileage: string; runs: number }
}) {
	return (
		<header className="md:grid grid-cols-12 p-2 md:px-8 mb-[50dvh]">
			<div className="col-span-4 md:col-span-8 mb-2 md:mb-0">
				<p className="uppercase tracking-wider">anima sana in corpore sano</p>
			</div>
			<p className="col-span-2 md:text-right">{stats.mileage}&nbsp;mi</p>
			<p className="col-span-2 md:text-right">{stats.runs} runs</p>
		</header>
	)
}
