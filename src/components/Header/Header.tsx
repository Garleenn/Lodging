import './Header.scss'
import { CgProfile } from 'react-icons/cg'
import { GrFavorite } from 'react-icons/gr'
import { FaShop } from 'react-icons/fa6'
import { MdOutlineMenu } from 'react-icons/md'
import { useState } from 'react'
import { Menu } from './BurgerMenu'
import { Link } from 'react-router-dom'
import { useSession } from '../../hooks/useUser'

export function Header() {

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { data, isError } = useSession();
	

	return (
		<>
			<div className="header-container flex border-b border-black justify-between py-10 px-16 w-100 items-center gap-8">
				<div className="">
					<Link to='/'><img className='cursor-pointer' src={'/vite.svg'}></img></Link>
				</div>
				<form className='w-100'>
					<input type="search" placeholder='Найти ночлег'/>
				</form>
				<nav>
						{data && !isError ? (
					<ul className='flex gap-8'>
						<li><Link className='header-link' to='/booking'>
							<FaShop size={40}/>
						</Link></li>
						<li><Link className='header-link' to='/favorites'>
							<GrFavorite size={40}/>
						</Link></li>
						<li><Link className='header-link' to={`/user/${data._id}`}>
							<CgProfile size={40}/>
						</Link></li>
					</ul>
						) : (<Link to='/login'><button>Войти!</button></Link>)}
				</nav>
				<MdOutlineMenu onClick={() => setIsOpen(true)} className='burger-btn hidden' size={40}/>
				{isOpen && (<Menu setIsOpen={setIsOpen} />)}
			</div>
		</>
	)
}