import { GrFavorite } from 'react-icons/gr'
import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useCallback, useState } from "react";
import './Product.scss'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useProduct } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { ModalProduct } from '../../components/ProductModal/ModalProduct';

export function Product() {

	const { id } = useParams<string>();

	const { isLoading, error, data, refetch } = useProduct(id);

	const [index, setIndex] = useState<number>(0);

	const sliderLeft = useCallback(() => {
		if(data && index == 0) {
			setIndex(data.images.length - 1);
		} else {
			setIndex(prev => {return prev - 1});
		}
	}, [index]);

	const sliderRight = useCallback(() => {
		if(data && index == data.images.length - 1) {
			setIndex(0);
		} else {
			setIndex(prev => {return prev + 1});
		}
	}, [index]);

	const {mutate} = useAddToCart(id);

	const addToCart = () => {
		mutate();
		refetch();
	}

	const [isOpen, setIsOpen] = useState(false);


	return (
		<>
		<Header />
		{isOpen && data && (
			<>
				<div className="background-dark fixed top-0 left-0 w-full h-full bg-black z-50 opacity-40"></div>
				<ModalProduct phone={data?.phoneNumber} setIsOpen={setIsOpen} />
			</>
		)}
			{isLoading ? (
					<div className="flex justify-center my-20">
						<h1 className='text-center'>Загрузка...</h1>
					</div>
		) : (
				<div className="product-container flex justify-center mx-48 my-12">
					{data && !error ? (<div className="product-info flex flex-row gap-12">
						<div className="image-container flex flex-col">
							{data&& data.images.length > 1 && (
								<div className="arrow-left arrow" onClick={sliderLeft}>
									<span>
										<FaArrowLeftLong size={24} />
									</span>
								</div>
							)}
							<img src={data.images[index]} alt={data.title} />
							{data&& data.images.length > 1 && (
								<div className="arrow-right arrow" onClick={sliderRight}>
									<span>
										<FaArrowRightLong size={24} />
									</span>
								</div>
							)}
							<i>Выставленно {data.createdAt}</i>
							<div className="favourite" onClick={addToCart}>
								<GrFavorite size={32} className='w-fit' />
							</div>
						</div>
						<div className="info-block flex flex-col gap-2">
							<h2 className="text-3xl font-bold">{data.title}</h2>
							<p className="text-slate-500">{data.description}</p>
							<i>Тип: {data.isHotel ? 'Отель'  : 'Частный'}</i>
							<span>Город: <u>{data.city}</u></span>
							<Link to={'/user/' + data.authorId}>Создатель: {data.author}</Link>
							<i>Рейтинг: {data.raiting} звёзд</i>
							<i className='places-count'>Осталось: {data.places} мест</i>
							<span className='text-xl'>Цена: <b>{data.price} руб.</b></span>
							<div className="bttns flex gap-4">
								<button role='button' className='w-100 btn mt-2 text-center border border-emerald-500'>Забронировать</button>
								<button role='button' className='w-100 btn mt-2 text-center' onClick={() => setIsOpen(true)}>Узнать телефон</button>
							</div>
						</div>
					</div>) : (
					<h1>Ошибка! Товара несуществует либо товар был удалён</h1>
					)}
				</div>
			)}
		</>
	)
}