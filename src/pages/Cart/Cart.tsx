import './Cart.scss'
import { GrFavorite } from "react-icons/gr";
import { Header } from "../../components/Header/Header";
import { useCart, useRemoveFromCart } from "../../hooks/useCart";
import { Link } from 'react-router-dom';
import { ICart } from "../../types/user.interface";
import { useState } from "react";
import { Footer } from "../../components/Footer/Footer";

export function Cart() {

	const { isLoading, error, data } = useCart();

	const [idRemoved, setIdRemoved] = useState<string>(``);

	const { mutate } = useRemoveFromCart(idRemoved);
	
	const removeProduct = (id: string) => {
		setIdRemoved(id);
		mutate();
	}


	return (
		<>
			<Header />
			{!isLoading ? (
				<div className="cart xl:mx-20 mx-5 size">
					<h1 className="font-bold my-6">Избранное: </h1>
					{data && data?.length > 0 && !error ? (
						<div className="cart-container flex flex-wrap gap-12">
							{data.map((product: ICart) => (
								<div className="cart-card flex flex-col flex-wrap xl:w-1/6 w-full border border-black rounded-xl cursor-pointer" key={product.idProduct}>
									<div className="image-card select-none">
										<img className='rounded-t-xl' src={product.images[0]} alt={product.title} />
									</div>
									<div className="info-container px-4 py-3 flex flex-col">
										<h3 className='font-bold text-2xl'>{product.title.substring(0, 19)}{product.title.length >= 19 && '...'}</h3>
										<span>Тип: {product.isHotel ? 'Отель' : 'Частный'}</span>
										<span>Город: <u>{product.city}</u></span>
										<i>Рейтинг: {product.raiting} звёзд</i>
										<span className='text-xl'>Цена: <b>{product.price} руб.</b></span>
										<Link role='button' className='w-100 btn mt-2 text-center' to={'/product/' + product.idProduct}>Подробнее</Link>
										<div className="favourite" onClick={() => removeProduct(product.idProduct)}>
											<GrFavorite size={32} className='w-fit' />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
					<h2 className="text-2xl text-slate-500">Избранных товаров необнаруженно, но Вы можете их добавить)</h2>
					) }
					{error && (<h2>Ошибка, невозможно загрузить избранные товары</h2>)}
				</div>
			) : (
				<h1>Загрузка</h1>
			)}
			<Footer />
		</>
	)
}