export interface Coordinate {
	latitude: number
	longitude: number
}

const getRadiansFromDegrees = (degrees: number): number => {
	return (degrees * Math.PI) / 180
}
export function getDistanceBetweenCoordinates(from: Coordinate, to: Coordinate): number {
	const R = 6371

	const deltaLatitude = getRadiansFromDegrees(to.latitude - from.latitude)
	const deltaLongitude = getRadiansFromDegrees(to.longitude - from.longitude)

	const a =
		Math.cos(getRadiansFromDegrees(from.latitude)) *
			Math.cos(getRadiansFromDegrees(to.latitude)) *
			Math.sin(deltaLongitude / 2) *
			Math.sin(deltaLongitude / 2) +
		Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2)

	const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	const distance = R * angularDistance

	return distance
}
