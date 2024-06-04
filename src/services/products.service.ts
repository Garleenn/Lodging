import { IProduct } from "../types/product.interface";
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:3005'

class getProducts {

	async getAllProducts(filters: any) {
		return axios.get<IProduct[]>('/products', {
			params: {
				isHotel: filters.isHotel,
				filtre: filters.filtre,
				city: filters.city,
				sPrice: filters.sPrice,
				dPrice: filters.dPrice,
				title: filters.title,
			}
		});
	}

	async getProducts(id: string | undefined) {
		return axios.get<IProduct>('/product', {
			params: {
				id: id
			}
		});
	}
}

export default new getProducts()