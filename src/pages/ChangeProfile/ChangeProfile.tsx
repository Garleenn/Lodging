import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { useState } from "react";
import { IUser } from "../../types/user.interface";
import { useChangeProfile, useUserInfo } from "../../hooks/useUser";

export function ChangeProfile() {
    const { register, handleSubmit, reset } = useForm<IUser>();

	const [profile, setProfile] = useState<IUser>();

	const { mutate } = useChangeProfile<IUser>(profile);

	const submit: SubmitHandler<IUser> = data => {
		setProfile(data);
		console.log(data);
		
		if(data) {
			mutate(data);
			reset();
		}
	}

    const { data, isError, isLoading } = useUserInfo('not');


	return (
		<>
			<Header />
            {!isLoading && !isError && data && (
			<form onSubmit={handleSubmit(submit)} className="flex flex-col items-center border border-black rounded-2xl xl:p-16 p-5 my-10 xl:mx-60 mx-6">
				<h2 className="text-3xl font-bold text-center">Изменить профиль</h2>
				<div className="inputs flex flex-col">
					<label className="mt-5">Ваш логин</label>
					<input type="text" {...register('login', { required: 'Поле обязательно', value: data.login })}/>
					<label className="mt-5">Изображение профиля</label>
					<input type="file" {...register('avaImage')}/>
					<label className="mt-5">Электронная почта</label>
					<input {...register('email', { required: 'Поле обязательно', value: data.email })}/>
					<label className="mt-5">Ваша роль</label>
					<select {...register('role', { required: 'Поле обязательно', value: data.role })}>
                        <option value="Частник">Частник</option>
                        <option value="Отель">Отель</option>
                        <option value="Турист">Турист</option>
                    </select>
				</div>
				<button type="submit" className="mt-8 w-fit mx-auto">Изменить</button>
			</form>
            )}
		</>
	)
}