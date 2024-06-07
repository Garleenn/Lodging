import { useQuery } from "@tanstack/react-query";
import getProducts from '../services/products.service';

export const useProducts = (filters: object) => {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => getProducts.getAllProducts(filters),
		select: (data) => data.data
	});
}

export const useProduct = (id: string | undefined) => {
	return useQuery({
		queryKey: ['product', id], 
		queryFn: () => getProducts.getProducts(id),
		select: (data) => data.data,
		enabled: !!id,
	});
}