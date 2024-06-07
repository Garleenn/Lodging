export interface IUser {
	login: string,
	email: string,
	about: string,
	avaImage: string,
	role: string,
	reviews: IReviews[],
	cart: ICart[],
	createdAt: string,
}

interface IReviews {
	user: string,
	comment: string,
	raiting: number,
}

export interface ICart {
	idProduct: string,
	title: string,
	description: string,
	author: string,
	isHotel: boolean,
	city: string,
	price: number,
	raiting: number,
	images: string[],
	phoneNumber: string,
	places: number,
}