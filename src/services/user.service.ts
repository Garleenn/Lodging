import axios from "axios";
import { IUser } from "../types/user.interface";
axios.defaults.baseURL = 'http://localhost:3005'

class getUser {

	async getUserInfo(id: string) {
		return axios.get<IUser[]>('/user', {
			params: {
				id: id,
			}
		});
	}

	async getUserProducts(id: string) {
		return axios.get<IUser>('/myProduct', {
			params: {
				id: id
			}
		});
	}
}

export default new getUser()