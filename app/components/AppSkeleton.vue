<template>
	<main>
		<header
			class="px-2 py-4 md:p-8 grid grid-cols-12 grid-rows-[auto_1fr] gap-2 mb-2"
		>
			<div
				v-for="n in 4"
				:key="n"
				class="aspect-square flex flex-col justify-between px-4 py-3 border border-neutral-200 col-span-6 md:col-span-3 animate-pulse"
			>
				<div class="h-4 w-24 bg-neutral-100"></div>
				<div class="h-4 w-32 bg-neutral-100"></div>
			</div>
		</header>

		<ul
			class="border-t border-t-neutral-200 divide-y divide-neutral-200 animate-pulse"
		>
			<li
				v-for="i in 20"
				:key="i"
				class="grid grid-cols-12 gap-x-2 px-2 md:px-8 py-2 md:py-4 items-center"
			>
				<div
					class="col-span-6 md:col-span-3 pr-2 flex items-center overflow-hidden h-3 bg-neutral-100"
				/>

				<div class="hidden md:flex col-span-2 h-3 bg-neutral-100" />

				<div class="col-span-2 flex h-3 bg-neutral-100" />

				<div class="flex col-span-2 h-3 bg-neutral-100" />

				<div class="hidden md:flex col-span-2 h-3 bg-neutral-100" />

				<div
					class="col-span-2 md:col-span-1 flex justify-end h-3 bg-neutral-100"
				/>
			</li>
		</ul>
	</main>
</template>
