import { Header } from "../Header/Header";

export function NotFound() {


	return (
		<>
		<Header />
			<div className="error-container text-2xl flex flex-col items-center my-40 ">
				<h1>404</h1>
				<p className="text-slate-500">Такой страницы не существует :(</p>
			</div>
		</>
	)
}