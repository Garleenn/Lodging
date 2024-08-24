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

	async postProduct(product: IProduct) {
		return axios.post<IProduct>('/products', {
			title: product.title,
			description: product.description,
			price: product.price,
			isHotel: product.isHotel,
			city: product.city,
			raiting: product.raiting,
			phoneNumber: product.phoneNumber,
			places: product.places,
			images: product.images,
			address: product.address,
		});
	}

	async changeProduct(product: IProduct, id: string) {
		return axios.put<IProduct>('/products', {
			id: id,
			title: product.title,
			description: product.description,
			price: product.price,
			isHotel: product.isHotel,
			city: product.city,
			raiting: product.raiting,
			phoneNumber: product.phoneNumber,
			places: product.places,
			images: product.images,
			address: product.address,
		});
	}

	async changePlaces(places: number, id: string) {
		return axios.put<IProduct>('/place-on-product', {
			places: places,
			id: id,
		});
	}

	async deleteProduct(id: string) {
		return axios.delete<IProduct>('/products', {
			params: {
				id: id,
			}
		});
	}

	async getRatings(products: IProduct[]) {
		return axios.get<number[]>('/ratings', {
			params: {
				products: products,
			}
		});
	}
}

export default new getProducts()