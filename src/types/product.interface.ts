export interface IProduct {
	_id: string,
	title: string,
	description: string,
	author: string,
	authorId: string,
	isHotel: boolean,
	city:  string,
	price: number,
	raiting: number,
	images: string[],
	phoneNumber: string,
	places: number,
	createdAt: string,
	address: string,
	allProductsCount: number,
	coords: number[]
}