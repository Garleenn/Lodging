import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useChangeProduct = (product: IProduct, id: string) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['changeProduct'], 
		mutationFn: () => getProducts.changeProduct(product, id),
		onSuccess() {
			navigate('/');
		}
	});

	const navigate = useNavigate();		

	return { mutate, isError }
}

export const useDeleteProduct = (id: string) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['deleteProduct'], 
		mutationFn: () => getProducts.deleteProduct(id),
		onSuccess() {
			navigate('/');
		}
	});


	const navigate = useNavigate();		

	return { mutate, isError }
}


export const useChangePlaces = (places: number, id: string) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['placesChangeProduct'], 
		mutationFn: () => getProducts.changePlaces(places, id),
		onSuccess() {
			QueryClient.invalidateQueries({ queryKey: ['product', id] });
		}
	});

	const QueryClient = useQueryClient();

	return { mutate, isError }
}

export const useGetRatings = (products: IProduct[]) => {
	return useQuery({
		queryKey: ['getRatings'], 
		queryFn: () => getProducts.getRatings(products),
		select: (data) => data.data
	});
}