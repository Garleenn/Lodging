import './Header.scss'
import { CgProfile } from 'react-icons/cg' 
import { GrFavorite } from 'react-icons/gr'
import { FaShop } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'

interface IProps {
	setIsOpen: (isOpen: boolean) => void,
	idProfile: string,
}

export function Menu(props: IProps) {


	return (
		<>
			<div className="burger-container flex flex-col border-l-2 border-black p-6 gap-8">
			<IoMdClose size={40} onClick={() => props.setIsOpen(false)}/>
				<nav>
					{props.idProfile == 'not' ? (
						<Link to='/login'><button>Войти!</button></Link>
					) : (
						<ul className='flex gap-8 flex-col'>
							<li className='flex gap-4 items-center'>
								<Link to={`/booking`}>
									<FaShop size={40}/>Брони
								</Link></li>
							<li className='flex gap-4 items-center'>
								<Link to={`/favorites`}>
									<GrFavorite size={40}/>Избранное
								</Link></li>
							<li className='flex gap-4 items-center'>
								<Link to={`/user/${props.idProfile}`}>
									<CgProfile size={40}/>Профиль
								</Link></li>
						</ul>
					)}
				</nav>
			</div>
		</>
	)
}