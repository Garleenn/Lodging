export interface IUser {
	login: string,
	email: string,
	password: string,
	avaImage: string,
	role: string,
	reviews: IReviews[],
	cart: ICart[],
}

interface IReviews {
	user: string,
	comment: string,
	raiting: number,
}

interface ICart {
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