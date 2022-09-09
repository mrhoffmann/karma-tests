export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
	const enumValues = Object.keys(anEnum) as Array<keyof T>;
	const randomIndex = Math.floor(Math.random() * enumValues.length);
	const randomEnumKey = enumValues[randomIndex];
	return anEnum[randomEnumKey];
}

export function Random(max: number, min: number): number {
	if (min > max)
		throw Error(
			`Expected min-parameter (${min}) to be less than max-parameter (${max}).`
		);
	return Math.floor(Math.random() * (max - min) + min);
}
