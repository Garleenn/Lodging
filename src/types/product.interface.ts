export interface IProduct {
	_id: string,
	title: string,
	description: string,
	author: string,
	isHotel: boolean,
	city:  string,
	price: number,
	raiting: number,
	images: string[],
	phoneNumber: string,
	places: number,
	createdAt: string,
}