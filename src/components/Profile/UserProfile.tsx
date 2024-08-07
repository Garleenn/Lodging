import { Link, useParams } from "react-router-dom"
import { useCheck, useUserInfo } from '../../hooks/useUser';
import './UserProfile.scss'
import { MdOutlineMenu } from "react-icons/md";
import dayjs from 'dayjs'
import { IIsCreator } from "../../types/user.interface";
import { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { Actions } from "./Actions";

export function UserProfile() {
	const { id } = useParams<string>();

	const { data: isCreator } = useCheck<IIsCreator>(id);

	const { error, data } = useUserInfo(id);
	
	const createDate = (data: string):string => {
		return dayjs(data).format('DD.MM.YYYY');
	}

	const [aboutReplaced, setAboutReplaced] = useState(``);

	useEffect(() => {
		if(data && data.about) {
			setAboutReplaced(data.about.replace(/\n/g, '<br/>'));
		} 
	}, [data]);


	const [isOpen, setIsOpen] = useState<boolean>(false);


	return (
		<>
			<Header />
			{isOpen && (<Actions setIsOpen={setIsOpen} />)}
			<div className="flex flex-col items-center w-100 gap-12 my-10">
				{!error && data && isCreator ? (
					<div className="info-user-all">
						<div className="flex flex-row justify-between w-100 gap-5 items-center">
							<div className="profile-info flex items-center gap-4">
								<img src={data.avaImage} alt={data.login} />
								<div className="flex flex-col">
									<h2 className="font-bold text-3xl">{data.login}</h2>
									<span className="text-slate-500 select-none">{data.role}</span>
								</div>
							</div>
							<div className="flex gap-4 items-center">
								Ср. оценка: <b>{data.grade / data.reviews.length}</b>
								{isCreator.isCreator == 'you' && (
									<div className="menu cursor-pointer sm:mt-0 mt-16" onClick={() => setIsOpen(true)}>
										<MdOutlineMenu size={35}/>
									</div>
								)}
							</div>
						</div>
						<div className="about-block mt-6 cursor-pointer">
							<div className="border rounded-xl shadow-xl p-10 hover:shadow-sm transition-all flex flex-col flex-wrap">
								<h3 className="font-bold text-xl select-none">О нас: </h3>
								<p className="cursor-text" dangerouslySetInnerHTML={{__html: aboutReplaced}}></p>
							</div>
						</div>
						<div className="flex justify-between align-center mt-5">
							<span className="text-slate-500">Аккаунт создан {createDate(data.createdAt)}</span>
							<span className="font-bold"><Link to={'/reviews/' + data._id}>Смотреть отзывы</Link></span>
						</div>
					</div>
				) : (
					<h1>Ошибка! Невозможно загрузить пользователя.</h1>
				)}
			</div>
		</>
	)
}