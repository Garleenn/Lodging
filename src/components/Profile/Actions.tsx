import { IoMdClose } from 'react-icons/io'
import './Actions.scss'
import { Link } from 'react-router-dom'
import { useLogOut } from '../../hooks/useUser'

interface IProps {
	setIsOpen: (isOpen: boolean) => void,
	role: boolean
}

export function Actions(props: IProps) {

	const { mutate } = useLogOut();

	return (
		<>
			<div className='side-menu flex flex-col border-l-2 border-black p-6 gap-8'>
			<IoMdClose className='cursor-pointer' size={40} onClick={() => props.setIsOpen(false)}/>
				<div className='nav'>
					<ul className='flex gap-4 flex-col'>
						<li className='xl:text-xl text-base'><Link to='/changeProfile'>Изменить данные профиля</Link></li>
						{props.role && (<li className='xl:text-xl text-base'><Link to='/createLodging'>Разместить ночлег</Link></li>)}		
						<li className='xl:text-xl text-base'><Link to='/errors'>Сообщить об ошибке</Link></li>
						<li className='xl:text-xl text-base'><a href='#' onClick={() => mutate()}>Выйти из аккаунта</a></li>
					</ul>
				</div>
			</div>
		</>
	)
}