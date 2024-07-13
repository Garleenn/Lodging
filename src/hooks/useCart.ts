import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCart from '../services/cart.service';
import { useEffect } from "react";

export const useCart = () => {
	return useQuery({
		queryKey: ['cart'],
		queryFn: () => getCart.userCart(),
		select: (data) => data.data
	});
}

export const useAddToCart = (id: string) => {
	return useMutation({
		mutationKey: ['cart-post'],
		mutationFn: () => getCart.addToCart(id),
	});
}

export const useRemoveFromCart = (id: string) => {
	const { mutate, isError, isSuccess } = useMutation({
		mutationKey: ['cart-delete'],
		mutationFn: () => getCart.removeFromCart(id),
	});

	const QueryClient = useQueryClient();

	useEffect(() => {
		QueryClient.invalidateQueries({queryKey: ['cart']});
	}, [isSuccess, mutate]);

	return { mutate, isError }
}