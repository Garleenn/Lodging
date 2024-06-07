import { useQuery } from "@tanstack/react-query";
import getUser from '../services/user.service'

export const useUserInfo = (id: string) => {
	return useQuery({
		queryKey: ['user'],
		queryFn: () => getUser.getUserInfo(id),
		select: (data) => data.data
	});
}

export const useUserProducts = (id: string) => {
	return useQuery({
		queryKey: ['userProduct'],
		queryFn: () => getUser.getUserProducts(id),
		select: (data) => data.data
	});
}