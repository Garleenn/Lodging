import './Enter.scss'
import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { IRegister } from "../../types/user.interface";
import { useUserLogin } from "../../hooks/useUser";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export function Login() {

	const { register, handleSubmit, reset, formState: { errors } } = useForm<IRegister>({
		mode: 'onChange'
	});

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;

	const [form, setForm] = useState<IRegister>();
	const [err, setErr] = useState(``);

	const { mutate, isError } = useUserLogin(form);
	
	const login: SubmitHandler<IRegister> = date => {
		setForm(date);

		if (isError) {
			setErr(`Errorchik`);
		} else {
			mutate(date);
			reset();
			setErr(``);
			// navigate(`/`);
		}
	}

	const navigate = useNavigate();


	return (
		<>
			<Header />
			<form onSubmit={handleSubmit(login)} className="log-container flex flex-col items-center my-16 mx-40 border border-black rounded-2xl shadow-xl p-16">
				<h1 className="font-bold mb-5">Вход</h1>
				<div className="flex flex-col items-start">
					<label>Ваш email</label>
					<input {...register('email', { required: 'Поле обязательно' })} type="email" placeholder="Введите вашу почту" />
					{emailError && (<p className='text-red-500 pt-2 mb-0'>{emailError}</p>)}
					<label>Пароль</label>
					<input {...register('password', { required: 'Длинна от 6 до 20 символов', minLength: 6, maxLength: 20 })} type="password" placeholder="Введите пароль" />
					{passwordError && (<p className='text-red-500 pt-2 mb-0'>{passwordError}</p>)}
				</div>
				<button type='submit' className="btn mt-8">Войти!</button>
				{err && (<h3 className="text-red-500 font-bold text-xl mt-5">{err}</h3>)}
				<Link className='mt-8' to='/register'>Ещё нет аккаунта? Зарегестрируйтесь!</Link>
			</form>
		</>
	)
}