export interface IUser {
	_id: string,
	login: string,
	email: string,
	about: string,
	avaImage: string,
	role: string,
	reviews: IReviews[],
	cart: ICart[],
	createdAt: string,
	grade: number
}

export interface IReviews {
	user: {
		login: string,
		avaImage: string,
		id: string,
		idProfile: string,
	},
	comment: string,
	raiting: number,
	_id: string,
	createdAt: string
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

export interface IRegister extends IUser {
	password: string,
	exPassword: string,
}

export interface IIsCreator {
	isCreator: string
}