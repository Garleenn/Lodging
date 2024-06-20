import axios from "axios";
import { IRegister, IUser } from "../types/user.interface";
import { IProduct } from "../types/product.interface";
axios.defaults.baseURL = 'http://localhost:3005'
axios.defaults.withCredentials = true

class getUser {

	async getUserInfo(id: string) {
		return axios.get<IUser>('/user', {
			params: {
				id: id,
			}
		});
	}

	async getUserProducts(id: string) {
		return axios.get<IProduct[]>('/myProducts', {
			params: {
				id: id
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

	async Session() {
		return axios.get<IUser>('/session');
	}

	async Check(id: string) {
		return axios.get<string>('/check', {
			params: {
				id: id
			}
		});
	}
}

export default new getUser()