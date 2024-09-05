import { Link } from 'react-router-dom'
import './Footer.scss'

export function Footer() {


	return (
		<>
			<div className="flex xl:flex-row flex-col justify-evenly items-center footer-container xl:px-10 xl:pt-10 p-4 pt-6 w-full text-xl gap-6 mt-12">
					<div className="site-info flex items-center gap-3">
						<img src="/vite.svg" alt="Logo" />
						<h2 className='w-100 header-title text-3xl text-center'><Link to='/' className='font-bold'>всеночлеги.рф</Link></h2>
					</div>
					<a className='text-2xl xl:text-xl' href="https://vk.com/ivangorbenko52">Связаться с разработчиком</a>
					<a className='text-2xl xl:text-xl' href="https://vk.com/ivangorbenko52">Соглашения и лицензии</a>
			</div>
			<span className="text-slate-500 flex justify-center pb-4 xl:mt-2 mt-3">Все права защищены 2024©</span>
		</>
	)
}