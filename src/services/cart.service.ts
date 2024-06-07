import axios from "axios"
import { ICart } from "../types/user.interface";
axios.defaults.baseURL = 'http://localhost:3005'

class getCart {
	userCart = async () => {
		return axios.get<ICart[]>('/cart');
	}

	addToCart = async (id: string) => {
		return axios.put<ICart>('/cart-post', {
			id: id
		});
	}

	removeFromCart = async (id: string) => {
		return axios.put<ICart>('/cart-delete', {
			id: id,
		})
	}
}

export default new getCart();