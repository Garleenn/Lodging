import '../EnterPage/Enter.scss'
import { Header } from "../../components/Header/Header";
import { useCheckReminder, useReminder } from "../../hooks/useUser";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';

export function Reminder() {

	const [err, setErr] = useState(``);

	const [form, setForm] = useState({
		email: ``,
		password: ``,
		password2: ``,
		code: 0
	});

	const { mutate, isError, error } = useReminder(form.email, form.password, form.code);

	const passwordCheck = useCheckReminder(form.email);

	const submit = () => {
		if (isError || error) {
			setErr(`Ошибка! Невозможно восстановить пароль!`);
		} else {
			if(form.password == form.password2) {
				mutate();
				setErr(``);
			} else {
				setErr(`Пароли неверны!`)
			}
		}
	}


	return (
		<>
			<Header />
			<div className="log-container flex flex-col items-center my-16 mx-40 border border-black rounded-2xl shadow-xl p-16 size">
				<h1 className="font-bold mb-5">Восстановление пароля</h1>
				<div className="flex flex-col items-start">
					<label>Ваш email</label>
					<input type="email" placeholder="Введите вашу почту" onChange={(e) => setForm((prev) => {return {...prev, email: e.target.value} })} />
				</div>
				{passwordCheck.isSuccess ? (
					<>
					<div className="flex flex-col items-start">
						<label className='mt-3 flex'>Введите код</label>
						<input className='mt-1' type="number" placeholder="Введите код с почты" onChange={(e) => setForm((prev) => {return {...prev, code: e.target.value} })}  />
					<label>Пароль</label>
					<input onChange={(e) => setForm((prev) => {return {...prev, password: e.target.value} })}  type="password" placeholder="Введите новый пароль" />
					<label>Повторите пароль</label>
					<input onChange={(e) => setForm((prev) => {return {...prev, password2: e.target.value} })} type="password" placeholder="Повторите пароль" />
					</div>

						<button onClick={submit} className="btn mt-10">Восстановить пароль!</button>
						{isError && (<span className='text-xl mt-6 text-red-500 font-semibold'>Неверный код!</span>)}
					</>
				) : (
						<button type='button' onClick={() => passwordCheck.mutate()} className="btn mt-10">Получить код</button>
				)}
				{err && (<h3 className="text-red-500 font-bold text-xl mt-5">{err}</h3>)}
				<Link className='mt-8' to='/login'>Вспомнили пароль? Войдите!</Link>
			</div>
			<Footer />
		</>
	)
}