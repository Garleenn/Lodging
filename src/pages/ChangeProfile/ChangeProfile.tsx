import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { IUser } from "../../types/user.interface";
import { useChangeProfile, useUserInfo } from "../../hooks/useUser";
import { Footer } from "../../components/Footer/Footer";

export function ChangeProfile() {
  const { register, handleSubmit, setValue } = useForm<IUser>();

	const [profile, setProfile] = useState<IUser>();

	const { mutate } = useChangeProfile(profile);

	const submit: SubmitHandler<IUser> = data => {
		setProfile(data);
		
		if(data) {
			mutate();
		}
	}

  const { data, isError, isLoading } = useUserInfo('not');

	const convertFileAvatar = (event: Event | any) => {
    let file = event.target.files[0];
    const reader: any = new FileReader();
    
    reader.onload = () => {
			setValue('avaImage', reader.result);
    };
    
    reader.readAsDataURL(file);
  };

	const [role, setRole] = useState<string>();
	
	useEffect(() => {
		if(data) {
			setRole(data.role);
		}
	}, [data]);
	

	return (
		<>
			<Header />
      {!isLoading && !isError && data && (
				<form onSubmit={handleSubmit(submit)} className="flex flex-col items-center border border-black rounded-2xl xl:p-16 p-5 my-10 xl:mx-60 mx-0 size">
					<h2 className="text-3xl font-bold text-center">Изменить профиль</h2>
					<div className="inputs flex flex-col">
						<label className="mt-5">Ваш логин</label>
						<input type="text" {...register('login', { required: 'Поле обязательно', value: data.login })}/>
						<label className="mt-5">Изображение профиля</label>
						<input type="file" onChange={(event) => convertFileAvatar(event)} />
						<label className="mt-5">О вас</label>
						<textarea rows={10} { ...register('about', { value: data.about }) }/>
						<label className="mt-5">Электронная почта</label>
						<input { ...register('email', { required: 'Поле обязательно', value: data.email }) }/>
						<label className="mt-5">Ваша роль</label>
						<select className="w-100" {...register('role', { required: 'Поле обязательно', value: data.role })} onChange={(e) => {setRole(e.target.value)} }>
								<option value="Частник">Частник</option>
								<option value="Отель">Отель</option>
								<option value="Турист">Турист</option>
						</select>
						{role == 'Отель' && (
							<>
								<label>Сколько звёзд у отеля?</label>
								<input {...register('raiting', {value: data.raiting, min: 0, max: 5})} type="number" placeholder="Введите число от 0 до 5" />
							</>
						)}
					</div>
					<button type="submit" className="mt-8 w-fit mx-auto">Изменить</button>
				</form>
      )}
			<Footer />
		</>
	)
}