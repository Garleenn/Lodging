import { GrFavorite } from "react-icons/gr";
import { Header } from "../../components/Header/Header";
import { useCart, useRemoveFromCart } from "../../hooks/useCart";
import { Link } from 'react-router-dom';
import './Cart.scss'
import { ICart } from "../../types/user.interface";
import { useEffect, useState } from "react";

export function Cart() {

	const { isLoading, error, data, refetch } = useCart();

	const [idRemoved, setIdRemoved] = useState<string>(``);

	const { mutate } = useRemoveFromCart(idRemoved);
	
	const removeProduct = (id: string) => {
		setIdRemoved(id);

		mutate();
	}

	useEffect(() => {
		setTimeout(() => {
			refetch();
		}, 10)
	}, [idRemoved]);


	return (
		<>
			<Header />
			{!isLoading ? (
				<div className="cart xl:mx-20 mx-3">
					<h1 className="font-bold my-6">Избранное: </h1>
					{data && !error ? (
						<div className="cart-container flex gap-12">
							{data.map((product: ICart) => (
								<div className="card flex flex-col flex-wrap w-1/6 border border-black rounded-xl cursor-pointer" key={product.idProduct}>
									<div className="image-card select-none">
										<img className='rounded-t-xl' src={product.images[0]} alt={product.title} />
									</div>
									<div className="info-container px-4 py-3 flex flex-col">
										<h3 className='font-bold text-2xl'>{product.title}</h3>
										<span>Тип: {product.isHotel ? 'Отель' : 'Частный'}</span>
										<span>Город: <u>{product.city}</u></span>
										<i>Рейтинг: {product.raiting} звёзд</i>
										<span className='text-xl'>Цена: <b>{product.price} руб.</b></span>
										<Link role='button' className='w-100 btn mt-2 text-center' to={'/product/' + product.idProduct}>Подробнее</Link>
										<div className="favourites" onClick={() => {removeProduct(product.idProduct); refetch()}}>
											<GrFavorite size={32} className='w-fit' />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (<h1>Избранных товаров необнаруженно</h1>)}
					{error && (<h2>Ошибка, невозможно загрузить избранные товары</h2>)}
				</div>
			) : (
				<h1>Загрузка</h1>
			)}
		</>
	)
}