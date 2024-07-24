import { useMutation, useQuery } from "@tanstack/react-query";
import getProducts from '../services/products.service';
import { IProduct } from "../types/product.interface";
import { useNavigate } from "react-router-dom";

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

export const usePostProduct = (product: IProduct) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['postProduct'], 
		mutationFn: () => getProducts.postProduct(product),
		onSuccess() {
			navigate('/');
		}
	});

	const navigate = useNavigate();		

	return { mutate, isError }
}