import './Header.scss'
import { CgProfile } from 'react-icons/cg' 
import { GrFavorite } from 'react-icons/gr'
import { FaShop } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

interface IProps {
	setIsOpen: (isOpen: boolean) => void
}

export function Menu(props: IProps) {


	return (
		<>
			<div className="burger-container flex flex-col border-l-2 border-black p-6 gap-8">
			<IoMdClose size={40} onClick={() => props.setIsOpen(false)}/>
				<nav>
					<ul className='flex gap-8 flex-col'>
						<li className='flex gap-4 items-center'><FaShop size={40}/>Брони</li>
						<li className='flex gap-4 items-center'><GrFavorite size={40}/>Избранное</li>
						<li className='flex gap-4 items-center'><CgProfile size={40}/>Профиль</li>
					</ul>
				</nav>
			</div>
		</>
	)
}