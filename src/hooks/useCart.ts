import { useMutation, useQuery } from "@tanstack/react-query";
import getCart from '../services/cart.service';

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
	return useMutation({
		mutationKey: ['cart-delete'],
		mutationFn: () => getCart.removeFromCart(id),
	});
}