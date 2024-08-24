import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCart from '../services/cart.service';

export const useCart = () => {
	return useQuery({
		queryKey: ['cart'],
		queryFn: () => getCart.userCart(),
		select: (data) => data.data
	});
}

export const useAddToCart = (id: string) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['cart-post'],
		mutationFn: () => getCart.addToCart(id),
		onSuccess() {
			QueryClient.invalidateQueries({queryKey: ['userSession']});
		}
	});

	const QueryClient = useQueryClient();

	return { mutate, isError };
}

export const useRemoveFromCart = (id: string) => {
	const { mutate, isError } = useMutation({
		mutationKey: ['cart-delete'],
		mutationFn: () => getCart.removeFromCart(id),
		onSuccess() {
			QueryClient.invalidateQueries({queryKey: ['cart']});
			QueryClient.invalidateQueries({queryKey: ['userSession']});
		}
	});

	const QueryClient = useQueryClient();

	return { mutate, isError }
}