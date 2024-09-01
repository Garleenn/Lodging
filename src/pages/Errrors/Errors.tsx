import { useForm, SubmitHandler } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { IErrorRequests } from "../../types/user.interface";
import { useSendError } from "../../hooks/useUser";
import { useState } from "react";


export function Errors() {

	const { register, handleSubmit } = useForm<IErrorRequests>();

	const [form, setForm] = useState({
		title: ``,
		message: ``,
	})

	const { mutate } = useSendError(form.title, form.message);

	const submit: SubmitHandler<IErrorRequests> = data => {
		setForm((prev) => { return {...prev, title: data.title, message: data.message} });
		mutate(data.title, data.message);
	}


	return (
		<>
		<Header />
			<form onSubmit={handleSubmit(submit)} className="errors-container flex flex-col items-center p-20 border-2 border-black rounded-2xl shadow-xl xl:mx-40 mx-5 mt-8">
				<h1 className="font-bold">Напишите нам вашу жалобу/предложение</h1>
				<div className="flex flex-col items-start">
					<label className="mt-5">Краткое название проблемы</label>
					<input className="w-full" type="text" {...register('title', { required: 'Поле обязательно' })}/>
					<label className="mt-5">Подробное название проблемы</label>
					<textarea className="w-full" rows={8} {...register('message', { required: 'Поле обязательно' })}/>
				</div>
				<button className="mt-10" type="submit">Отправить!</button>
			</form>
		</>
	)
}