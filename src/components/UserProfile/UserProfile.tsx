import { useParams } from "react-router-dom"
import { useUserInfo } from '../../hooks/useUser';
import './UserProfile.scss'
import { MdOutlineMenu } from "react-icons/md";
import dayjs from 'dayjs'

export function UserProfile() {

	const { id } = useParams<string>();

	const { isLoading, error, data } = useUserInfo(id);

	const createDate = (data: string):string => {
		 return dayjs(data).format('DD.MM.YYYY');
	}


	return (
		<>
			<div className="flex flex-col items-center w-100 gap-12 my-10">
				{!error && data ? (
					<div className="info-user-all">
						<div className="flex flex-row justify-between w-100 gap-5 items-center">
							<div className="profile-info flex items-center gap-4">
								<img src={data.avaImage} alt={data.login} />
								<div className="flex flex-col">
									<h2 className="font-bold text-3xl">{data.login}</h2>
									<span className="text-slate-500 select-none">{data.role}</span>
								</div>
							</div>
							<div className="menu cursor-pointer">
								<MdOutlineMenu size={35}/>
							</div>
						</div>
						<div className="about-block mt-6 cursor-pointer">
							<div className="border rounded-xl shadow-xl p-10 hover:shadow-sm transition-all flex flex-col flex-wrap">
								<h3 className="font-bold text-xl select-none">О нас: </h3>
								<p className="cursor-text">{data.about}</p>
							</div>
							<span className="text-slate-500">Аккаунт создан {createDate(data.createdAt)}</span>
						</div>
					</div>
				) : (
					<h1>Ошибка! Невозможно загрузить пользователя.</h1>
				)}
			</div>
		</>
	)
}