import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { IProduct } from "../../types/product.interface";
import { usePostProduct } from "../../hooks/useProducts";
import { useState } from "react";

export function CreateLodging() {

	const { register, handleSubmit, reset, formState: { errors } } = useForm<IProduct>();

	const [product, setProduct] = useState<IProduct>();

	const { mutate, isError } = usePostProduct(product);

	const submit: SubmitHandler<IProduct> = data => {
		setProduct(data);
		console.log(data);
		
		if(data) {
			mutate(data);
			reset();
		}

		if(!isError) {
			
		}
	}


	return (
		<>
			<Header />
			<form onSubmit={handleSubmit(submit)} className="flex flex-col items-center border border-black rounded-2xl xl:p-16 p-5 my-10 xl:mx-60 mx-6">
				<h2 className="text-3xl font-bold text-center">Создать объявление</h2>
				<div className="inputs flex flex-col">
					<label className="mt-5">Название номера</label>
					<input type="text" {...register('title', { required: 'Поле обязательно' })}/>
					<label className="mt-5">Изображения номера</label>
					<input type="file" {...register('images', { required: 'Поле обязательно' })}/>
					<label className="mt-5">Описание номера</label>
					<textarea {...register('description', { required: 'Поле обязательно' })}/>
					<div className="checkbox flex items-center gap-2">
						<input className="mt-4 text-purple-600" type="checkbox" {...register('isHotel', { required: 'Поле обязательно' })}/>
						<label>Это отель?</label>
					</div>
					<label className="mt-5">Город</label>
					<input {...register('city', { required: 'Поле обязательно' })}/>
					<label className="mt-5">Цена</label>
					<input type="number" min='0' {...register('price', { required: 'Поле обязательно', max: 2000000 })}/>
					<label className="mt-5">Ваш номер телефона</label>
					<input type="tel" {...register('phoneNumber', { required: 'Поле обязательно' })}/>
					<label className="mt-5">Количество оставшихся мест</label>
					<input type="number" min='0' {...register('places', { required: 'Поле обязательно' })}/>
				</div>
				<button type="submit" className="mt-8 w-fit mx-auto">Создать объявление</button>
			</form>
		</>
	)
}