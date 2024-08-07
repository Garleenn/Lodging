import axios from "axios";
import { IIsCreator, IRegister, IReviews, IUser } from "../types/user.interface";
import { IProduct } from "../types/product.interface";
axios.defaults.baseURL = 'http://localhost:3005'
axios.defaults.withCredentials = true

class getUser {

	async getUserInfo(id: string) {
		return await axios.get<IUser>('/user', {
			params: {
				id
			}
		});
	}

	async getUserProducts(id: string) {
		return axios.get<IProduct[]>('/myProducts', {
			params: {
				id
			}
		});
	}

	async Register(form: IRegister) {
		return axios.post<IRegister>('/users', {
			login: form.login,
			email: form.email,
			password: form.password,
			role: form.role,
		});
	}

	async Login (form: IRegister) {
		return axios.post<IRegister>('/login', {
				email: form.email,
				password: form.password,
		});
	}

	async ChangeProfile(form: IUser) {
		return axios.put<IUser>('/users', {
			login: form.login,
			email: form.email,
			role: form.role,
			avaImage: form.avaImage,
			about: form.about
		});
	}

	async Session() {
		return axios.get<IUser>('/session');
	}

	async logOut() {
		return axios.post('/logout');
	}

	async Check(id: string) {
		return axios.get<IIsCreator>('/check', {
			params: {
				id
			}
		});
	}

	async addReview(form: IReviews) {
		return axios.put<IReviews>('/reviews', {
			id: form.user.id,
			comment: form.comment,
			raiting: form.raiting,
			idProfile: form.user.idProfile,
		});
	}

	async removeReview(form: {idReview: string, idProfile: string}) {
		return axios.put<IReviews>('/delete-review', {
			idReview: form.idReview,
			idProfile: form.idProfile,
		});
	}
}

export default new getUser()