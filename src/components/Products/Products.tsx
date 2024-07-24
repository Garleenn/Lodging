import './Products.scss'
import { GrFavorite } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import { CenterPage } from '../CenterPage/CenterPage';
import { IProduct } from '../../types/product.interface';
import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { useUserInfo } from '../../hooks/useUser';

export function Products() {

	const [filters, setFilters] = useState({
		isHotel: 'null',
		filtre: 'null',
		city: '',
		sPrice: null,
		dPrice: null,
		title: ``,
	});

	const { isLoading, data, refetch } = useProducts(filters);

	const [idProduct, setIdProduct] = useState<string>(``);

	const { mutate } = useAddToCart(idProduct);

	const addToCart = (id: string) => {
		setIdProduct(id);

		mutate();
	}

	const getRaiting = (authorId: string) => {
		const { data, error, isLoading } = useUserInfo(authorId);

		if (isLoading) {
			return 'Загрузка...';
		} else if (error) {
			return 'Ошибка';
		}

		return data?.grade;
	}


	return (
		<>
			{data && <CenterPage setFilters={setFilters} refetch={refetch} />}
			{isLoading ? (
				<div className="flex justify-center my-20">
					<h1 className='text-center'>Загрузка...</h1>
				</div>
			) : (
				<div className="products-container flex items-center justify-center gap-10 flex-wrap">
					{data?.map((product: IProduct) => (
						<div className="card flex flex-col flex-wrap w-1/6 border border-black rounded-xl cursor-pointer" key={product._id}>
							<div className="image-card select-none">
								<img className='rounded-t-xl' src={product.images[0]} alt={product.title} />
							</div>
							<div className="info-container px-4 py-3 flex flex-col">
								<h3 className='font-bold text-2xl'>{product.title.substring(0, 20)}{product.title.length >= 20 && '...'}</h3>
								<p className='text-slate-500'>{product.description.substring(0, 30)}{product.description.length >= 30 && '...'}</p>
								<span>Тип: {product.isHotel ? 'Отель' : 'Частный'}</span>
								<span>Город: <u>{product.city}</u></span>
								{product.isHotel ? (
									<i>Рейтинг: {product.raiting} звёзд</i>
								) : (
									<i>Средняя оценка: {product.raiting} звёзд</i>
								)}
								<span className='text-xl'>Цена: <b>{product.price} руб.</b></span>
								<Link role='button' className='w-100 btn mt-2 text-center btn-link-bottom' to={'product/' + product._id}>Подробнее</Link>
								<GrFavorite onClick={() => addToCart(product._id)} size={32} className='w-fit favourite' />
							</div>
						</div>
					))}
				</div>)}
		</>
	)
}