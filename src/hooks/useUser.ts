import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getUser from '../services/user.service'
import { IRegister, IReviews, IUser } from "../types/user.interface";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

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
	const { mutate, isError } = useMutation({
		mutationKey: ['userLogin'],
		mutationFn: () => getUser.Login(form),
		onSuccess() {
			navigate('/');
			QueryClient.invalidateQueries({queryKey: ['userSession']});
			navigate(0);
		}
	});
	
	const QueryClient = useQueryClient();

	const navigate = useNavigate();

	return { mutate, isError }
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

export const useAddReview = (form: IReviews) => {
	const { mutate, isError, isSuccess } = useMutation({
		mutationKey: ['addReview'],
		mutationFn: () => getUser.addReview(form)
	});

	const QueryClient = useQueryClient();

	useEffect(() => {
		QueryClient.invalidateQueries({queryKey: ['user']});
	}, [isSuccess, mutate]);

	return { mutate, isError }
}

export const useRemoveReview = (form: {idReview: string, idProfile: string}) => {
	const { mutate, isError, isPending, isSuccess } = useMutation({
		mutationKey: ['removeReview'],
		mutationFn: () => getUser.removeReview(form),
	});

	const QueryClient = useQueryClient();

	useEffect(() => {
		QueryClient.invalidateQueries({queryKey: ['user']});
	}, [isSuccess, mutate]);

	return { mutate, isError, isPending }
}

export const useLogOut = () => {
	const { mutate } = useMutation({
		mutationKey: ['logOut'],
		mutationFn: () => getUser.logOut(),
		onSuccess() {
			QueryClient.invalidateQueries({queryKey: ['userSession']});
			navigate(0);
		}
	});

	const navigate = useNavigate();

	const QueryClient = useQueryClient();

	return { mutate }
}