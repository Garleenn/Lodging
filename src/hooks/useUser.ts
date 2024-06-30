import { useMutation, useQuery } from "@tanstack/react-query";
import getUser from '../services/user.service'
import { IRegister, IUser } from "../types/user.interface";

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

export const useRegister = (form: IRegister) => {
	return useMutation({
		mutationKey: ['userPost52'],
		mutationFn: () => getUser.Register(form),
	})
}

export const useUserLogin = (form: IRegister) => {
	return useMutation({
		mutationKey: ['userLogin'],
		mutationFn: () => getUser.Login(form)
	});
}

export const useChangeProfile = (form: IUser) => {
	return useMutation({
		mutationKey: ['ChangeProfile'],
		mutationFn: () => getUser.ChangeProfile(form)
	});
}

export const useSession = () => {
	return useQuery({
		queryKey: ['userSession'],
		queryFn: () => getUser.Session(),
		select: (data) => data.data
	});
}

export const useCheck = (id: string) => {
	return useQuery({
		queryKey: ['userCheck'],
		queryFn: () => getUser.Check(id),
		select: (data) => data.data
	});
}