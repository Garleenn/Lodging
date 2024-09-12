import './Products.scss';
import { GrFavorite } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { CenterPage } from '../CenterPage/CenterPage';
import { IProduct } from '../../types/product.interface';
import { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAddToCart, useRemoveFromCart } from '../../hooks/useCart';
import { useSession } from '../../hooks/useUser';

export function Products() {

	const [filters, setFilters] = useState({
		isHotel: 'null',
		filtre: 'null',
		city: '',
		sPrice: null,
		dPrice: null,
		title: ``,
		limit: 1,
	});

	const { isLoading, data, refetch } = useProducts(filters);

	const [idProduct, setIdProduct] = useState<string>(``);

	const { mutate } = useAddToCart(idProduct);

	const removeCart = useRemoveFromCart(idProduct);

	const addToCart = (id: string, index: number) => {
		
		setIdProduct(id);

		if(isInCart && isInCart[index] && id) {
			removeCart.mutate(id);
		} else {	
			mutate();
		}
	}

	const session = useSession();

	let [isInCart, setInCart] = useState<boolean[]>();

	useEffect(() => {
		const doCart = () => {
			if (data && session.data) {
				const cartStatus = data.map(product => 
					session.data.cart.some(cartItem => cartItem.idProduct === product._id)
				);
	
				if (JSON.stringify(cartStatus) !== JSON.stringify(isInCart)) {
					setInCart(cartStatus);
				}
			}
		};
	
		doCart();
	}, [data, session]);

	const [navigateNumbers, setТavigateNumbers] = useState<number[] | string[]>([]);

	const [count, setCount] = useState(6);

	useEffect(() => {
		const navigate = () => {
			if(data && data.length && data[0].allProductsCount) {
				let countWhile = 1;
				let navigateNumbers: any[] = []
				for(let i = 0; i < data[0].allProductsCount; i++) {
					countWhile++;

					if(countWhile <= 50) {
						navigateNumbers = [];
					} else if(countWhile <= 100) {
						navigateNumbers = [1, 2];
					} else if(countWhile <= 150) {
						navigateNumbers = [1, 2, 3];
					} else if(countWhile <= 200) {
						navigateNumbers = [1, 2, 3, 4];
					} else if(countWhile <= 250) {
						navigateNumbers = [1, 2, 3, 4, 5];
					} else if(countWhile > 250) {
						navigateNumbers = [1, 2, 3, 4, 5, `...`, count];
					} //так проще всего

					setТavigateNumbers(navigateNumbers);
				}
			} else {
				setТavigateNumbers([]);
			}
		};

		navigate();
	}, [data]);

	const navigatePage = async (index: number) => {
		if(index != 6) {
			setFilters((prev: any) => {return {...prev, limit: navigateNumbers[index]} });
			setCount(6);
		} else {
			setFilters((prev: any) => {return {...prev, limit: count } });
			setCount(count + 1);
		}
	}

	useEffect(() => {
		refetch();
	}, [filters]);


	return (
		<>
			{data && <CenterPage setFilters={setFilters} />}
			{!isLoading && data ? (
				<>
				{data.length && data[0].allProductsCount && (
					<h3 className='text-2xl font-bold text-slate-500 flex justify-center'>Найдено {data[0].allProductsCount} вариантов</h3>
				)}
				<div className="products-container flex items-center justify-center xl:gap-10 gap-5 flex-wrap">
					{data.map((product: IProduct, index: number) => (
						<div className="card flex flex-col flex-wrap w-1/6 border border-black rounded-xl cursor-pointer" key={product._id}>
							<div className="image-card select-none">
								<img className='rounded-t-xl' src={product.images[0]} alt={product.title} />
							</div>
							<div className="info-container px-4 py-3 flex flex-col">
								<h3 className='font-bold text-2xl'>{product.title.substring(0, 20)}{product.title.length >= 20 && '...'}</h3>
								<p className='text-slate-500'>{product.description.substring(0, 30)}{product.description.length >= 30 && '...'}</p>
								<span>Тип: {product.isHotel ? 'Отель' : 'Частный'}</span>
								<span>Город: <u>{product.city}</u></span>
								{!product.isHotel ? (
									<i>Ср. оценка: {product.raiting} звёзд</i>
								) : (
									<i>Рейтинг: {product.raiting} звёзд</i>
								)}
								<span className='text-xl'>Цена: <b>{product.price} руб/сутки</b></span>
								<Link role='button' className='w-100 btn mt-2 text-center btn-link-bottom' to={'product/' + product._id}>Подробнее</Link>
								{isInCart && (
									<GrFavorite onClick={() => addToCart(product._id, index)} size={32} className='w-fit favourite' color={!isInCart[index] ? '#000' : 'crimson'} />
								)}
							</div>
						</div>
					))}
				</div>
				</>
			) : (
				<div className="flex justify-center my-20">
					<h1 className='text-center'>Загрузка...</h1>
				</div>
			)}
			{data && data.length == 0 && (
					<h2 className='text-center text-2xl font-semibold text-slate-500'>Таких товаров пока нет(</h2>
			)}
			<div className="navigator-container flex gap-3 justify-center mt-10">
				{navigateNumbers && navigateNumbers.map((number: number | string, index: number) => (
					<a href="#"><button onClick={() => navigatePage(index)} key={number} className='border border-slate-400 p-5 flex items-center justify-center'>{number}</button></a>
				))}
			</div>
		</>
	)
}