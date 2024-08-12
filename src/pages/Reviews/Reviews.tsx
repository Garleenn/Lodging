import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useAddReview, useRemoveReview, useSession, useUserInfo } from "../../hooks/useUser";
import { IReviews, IUser } from "../../types/user.interface";
import './Reviews.scss'
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";


export function Reviews() {

	const { id } = useParams<string>();

	const { register, handleSubmit, reset } = useForm<IReviews>();

	const { data, refetch, isLoading } = useUserInfo<IUser>(id);

	const session = useSession();

	const [review, setReview] = useState<IReviews>();
	
	const { mutate, isError, error } = useAddReview<IReviews>({
		user: {
			id: id,
			idProfile: session.data?._id
		},
		raiting: review?.raiting,
		comment: review?.comment
	});

	const submit: SubmitHandler<IReviews> = data => {
		if (data) {
			setReview(data);
		}

		try {
				mutate();
				reset();
				refetch();
		} catch (err) {
				console.error(err);
		}
	}

	const QueryClient = useQueryClient();

	const [idReview, setIdReview] = useState({
		idReview: '', 
		idProfile: ''
	});

	const queryRemoveReview = useRemoveReview(idReview);

	const deleteReview = (id: string) => {
		if(data && session.data) {
			setIdReview({
				idReview: id,
				idProfile: data._id
			});
	
			queryRemoveReview.mutate();
			if(!isError || !queryRemoveReview.isPending) {
				QueryClient.invalidateQueries({queryKey: ['user']});
				refetch();
			}
		}
	}


	return (
		<>
			<Header />
			{data && !isLoading && (
				<div className="review flex flex-col items-center w-100 gap-12 my-10">
					<div className="info-user-all">
						<div className="flex flex-row justify-between w-100 gap-5 items-center">
							<Link to={`/user/${data._id}`} className="profile-info flex items-center gap-4">
								<img src={data.avaImage} alt={data.login} />
								<div className="flex flex-col">
									<h2 className="font-bold xl:text-3xl text-xl">{data.login}</h2>
									<span className="text-slate-500 select-none">{data.role}</span>
								</div>
							</Link>
							<div className="flex gap-4 items-center">
							Ср. оценка: <b>{data.reviews.length != 0 ? data.grade / data.reviews.length : 0}</b>
							</div>
						</div>
						<hr className="mt-10 border-black" />

						{!session.isError && session.data && data._id != session.data._id && (
							<form className="send-review mt-12" onSubmit={handleSubmit(submit)}>
								<Link to={`/user/${session.data._id}`} className="profile-info flex items-center gap-4">
									<img src={session.data.avaImage} alt={session.data.login} />
									<div className="flex flex-col">
										<h2 className="font-bold xl:text-3xl">{session.data.login}</h2>
										<span className="text-slate-500 select-none">{session.data.role}</span>
									</div>
								</Link>
								<input {...register('raiting', { required: 'Поле обязательно' })} className="w-full rounded-xl mt-3 font-normal" type="number" min={1} max={5} maxLength={1} placeholder="Оцените ночлег от 1 до 5" />
								<textarea {...register('comment', { required: 'Поле обязательно' })} className="w-full font-normal rounded-xl mt-3" rows={4} placeholder="Опишите детали проживания и качество номеров" />
								<div className="flex justify-end mt-3">
									<button type="submit">Отправить отзыв</button>
								</div>
								{isError && error && (<h2 className="text-red-500">Произошла ошибка! {error.response?.data?.message || error.message}</h2>)}
							</form>
						)}

						<h2 className="font-bold xl:text-3xl mt-5">{data.reviews.length} Отзывов</h2>

						<div className="flex flex-col gap-6 all-reviews-container mt-6 cursor-pointer">
							{data.reviews.map((user) => (
								<div className="card-review border rounded-xl shadow-xl p-10 pb-12 hover:shadow-sm transition-all flex flex-col flex-wrap" key={user.user.id}>
									<Link to={`/user/${user.user.idProfile}`} className="user-info-block flex flex-row items-center gap-5">
										<img src={user.user.avaImage} alt={user.user.login} />
										<h2 className="font-bold xl:text-3xl text-xl">{user.user.login}</h2>
									</Link>
									<i className="mt-2">Оценка: {user.raiting} звёзд</i>
									<p>{user.comment}</p>
									{/* <i className="absolute bottom-3 left-10">{user.createdAt}</i> */}
									{session.data && session.data._id == user.user.idProfile && (
										<div onClick={() => deleteReview(user._id)} className="close-btn"><IoMdClose size={40} /></div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
}