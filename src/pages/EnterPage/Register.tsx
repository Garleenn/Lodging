import './Enter.scss'
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { IRegister } from "../../types/user.interface";
import { useRegister } from "../../hooks/useUser";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';

export function Register() {

	const { register, handleSubmit, reset, formState: { errors } } = useForm<IRegister>();

	const [form, setForm] = useState<IRegister>();
	const [err, setErr] = useState(``);

	const { mutate, isError } = useRegister<IRegister>(form);

	const submit: SubmitHandler<IRegister> = (data: IRegister) => {
		setForm(data);
		mutate(data);

		if (isError) {
			setErr(`Errorchik`);
		} else {
			reset();
			setErr(``);
		}
	}

	const validError: SubmitErrorHandler<IRegister> = data => {
		if (errors.login) {
			setErr('Введите логин');
		} else if (errors.email) {
			setErr('Введите email');
		} else if (errors.role) {
			setErr('Выберите вашу роль');
		} else if (errors.password) {
			setErr('Введите пароль');
		} else if (errors.exPassword) {
			setErr('Повторите пароль пароль');
		} else if (data.exPassword != data.password) {
			setErr('Пароли не совпадают');
		} else if (errors.root) {
			setErr('Введите больше данных');
		} else {
			setErr('');
		}
	}

	const [role, setRole] = useState<string>(``);


	return (
		<>
			<Header />
			<form onSubmit={handleSubmit(submit, validError)} className="log-container flex flex-col items-center my-16 mx-40 border border-black rounded-2xl shadow-xl p-16 size">
				<h1 className="font-bold mb-5">Регистрация</h1>
				<div className="flex flex-col items-start">
					<label>Имя</label>
					<input {...register('login', { required: true })} type="text" placeholder="Введите логин" />
					<label>Ваш email</label>
					<input {...register('email', { required: true })} type="email" placeholder="Введите вашу почту" />
					<label>Ваша роль</label>
					<select className='select-menu' {...register('role', { required: true })} onChange={(e) => {setRole(e.target.value)} }>
						<option value="">Выбирете роль</option>
						<option value="Отель">Отель</option>
						<option value="Частник">Частный</option>
						<option value="Турист">Турист</option>
					</select>
					{role == 'Отель' && (
						<>
							<label>Сколько звёзд у отеля?</label>
							<input {...register('raiting', {min: 0, max: 5})} type="number" placeholder="Введите число от 1 до 5" />
						</>
					)}
					<label>Пароль</label>
					<input {...register('password', { required: true })} type="password" placeholder="Введите пароль" />
					<label>Повторите пароль</label>
					<input {...register('exPassword', { required: true })} type="password" placeholder="Введите пароль" />
				</div>
				<button type='submit' className="btn mt-10">Зарегестрироваться!</button>
				{err && (<h3 className="text-red-500 font-bold text-xl mt-5">{err}</h3>)}
				<Link className='mt-8' to='/login'>Уже есть аккаунт? Войдите!</Link>
			</form>
			<Footer />
		</>
	)
}