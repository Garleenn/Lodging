import { useParams, Link } from 'react-router-dom';
import { useUserProducts } from '../../hooks/useUser';
import './ProductsProfile.scss';
import { IProduct } from '../../types/product.interface';
import { GrFavorite } from 'react-icons/gr';

export function ProductsProfile() {

	const { id } = useParams<string>();

		const { isLoading, error, data } = useUserProducts(id);


	return (
		<>
			<div className="wrap">
				{!isLoading ? (
					<div className="prod flex flex-col w-100 gap-4 my-3">
						<h2 className="font-bold text-3xl">Обьявления: </h2>
						{data && (
							<div className="card-containre flex items-center gap-10 flex-wrap">
							{data.map((product: IProduct) => (
								<div className="card flex flex-col flex-wrap w-1/6 border border-black rounded-xl cursor-pointer" key={product._id}>
									<div className="image-card select-none">
										<img className='rounded-t-xl' src={product.images[0]} alt={product.title} />
									</div>
									<div className="info-container px-4 py-3 flex flex-col">
										<h3 className='font-bold text-2xl'>{product.title}</h3>
										<span>Тип: {product.isHotel ? 'Отель'  : 'Частный'}</span>
										<span>Город: <u>{product.city}</u></span>
										<i>Рейтинг: {product.raiting} звёзд</i>
										<span className='text-xl'>Цена: <b>{product.price} руб.</b></span>
										<Link role='button' className='w-100 btn mt-2 text-center' to={'/product/' + product._id}>Подробнее</Link>
										<GrFavorite size={32} className='w-fit favourite' />
									</div>
								</div>
							))}
							{error && (<h1>Ошибка! Невозможно подгрузить ночлеги!</h1>)}
							</div>
						)}
					</div>
				) : (
					<h1>Загрузка...</h1>
				)}
				
			</div>
		</>
	)
}