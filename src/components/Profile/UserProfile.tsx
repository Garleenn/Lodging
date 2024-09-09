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

	const createDate = (data: string): string => {
		return dayjs(data).format('DD.MM.YYYY');
	}

	const [aboutReplaced, setAboutReplaced] = useState(``);

	useEffect(() => {
		if (data && data.about) {
			setAboutReplaced(data.about.replace(/\n/g, '<br/>'));
		}
	}, [data]);


	const [isOpen, setIsOpen] = useState<boolean>(false);


	return (
		<>
			<Header />
			{isOpen && (<Actions setIsOpen={setIsOpen} role={data?.role == 'Отель' || data?.role == 'Частник'} />)}
			<div className="flex flex-col items-center w-100 gap-12 my-10">
				{!error && data && isCreator ? (
					<div className="info-user-all">
						<div className="main-info flex flex-row justify-between w-100 gap-5 items-center">
							<div className="profile-info flex items-center gap-4">
								<img src={data.avaImage} alt={data.login} />
								<div className="flex flex-col">
									<h2 className="font-bold text-3xl">{data.login}</h2>
									<span className="text-slate-500 select-none">{data.role}</span>
								</div>
							</div>
							<div className="right-block-profile flex gap-4 items-center">
								{data.role == 'Отель' ? (
									<span>Звёзд: <b>{data.raiting}</b></span>
								) : (
									<span>Ср. оценка: <b>{data.reviews.length != 0 ? data.grade / data.reviews.length : 0}</b></span>
								)}

								{isCreator.isCreator == 'you' && (
									<div className="menu cursor-pointer" onClick={() => setIsOpen(true)}>
										<MdOutlineMenu size={35} />
									</div>
								)}
							</div>
						</div>
						<div className="about-block mt-6 cursor-pointer">
							<div className="border rounded-xl shadow-xl x:p-10 p-4 hover:shadow-sm transition-all flex flex-col flex-wrap xl:mt-2 mt-10">
							{data.about ? (
								<>
									<h3 className="font-bold text-xl select-none">О нас: </h3>
									<p className="cursor-text" dangerouslySetInnerHTML={{ __html: aboutReplaced }}></p>
								</>
							) : (
								<h3 className="font-bold xl:text-xl text-slate-500 select-none">Пользователь не добавил описание</h3>
							)}
							</div>
						</div>
						<div className="bottom-info flex justify-between align-center mt-5">
							<span className="text-slate-500">Аккаунт создан {createDate(data.createdAt)}</span>
							<div className="font-bold"><Link to={'/reviews/' + data._id}>Смотреть отзывы</Link></div>
						</div>
					</div>
				) : (
					<h1>Ошибка! Невозможно загрузить пользователя.</h1>
				)}
			</div>
		</>
	)
}