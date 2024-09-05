import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

export function NotFound() {


	return (
		<>
		<Header />
			<div className="w-full h-full error-container text-2xl flex flex-col items-center justify-center flex size">
				<h1>404</h1>
				<p className="text-slate-500">Такой страницы не существует :(</p>
			</div>
		<Footer />
		</>
	)
}