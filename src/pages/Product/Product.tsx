import { GrFavorite } from 'react-icons/gr'
import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useCallback, useEffect, useState } from "react";
import './Product.scss'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useDeleteProduct, useProduct } from '../../hooks/useProducts';
import { useAddToCart, useRemoveFromCart } from '../../hooks/useCart';
import { ModalProduct } from '../../components/ProductModal/ModalProduct';
import { useSession } from '../../hooks/useUser';
import { IoMenu } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import dayjs from 'dayjs';
import { PlacesModal } from '../../components/ProductModal/PlacesModal';
import { ICart } from '../../types/user.interface';
import { ModalAddress } from '../../components/ProductModal/ModalAddress';
import { Footer } from '../../components/Footer/Footer';

export function Product() {

	const { id } = useParams<string>();

	const { isLoading, error, data } = useProduct(id);

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

	const { mutate } = useAddToCart(id);

	const removeCart = useRemoveFromCart(id);

	const addToCart = async () => {
		if(!isInCart) {
			mutate();
			// refetch();
		} else {
			removeCart.mutate();
			session.refetch();
			setIsInCart(false);
		}
	}

	const [isOpen, setIsOpen] = useState(false);

	const session = useSession();

	const [isOpenMenu, setIsOpenMenu] = useState(false);

	const deleteLodging = useDeleteProduct(id);

	const removeLodging = () => {
		const isRemove = confirm(`Вы действительно хотите удалить объявление "${data?.title}?"`);
		if(isRemove) {
			deleteLodging.mutate();
			setIsInCart(false);
		}
	}

	const createDate = (data: string):string => {
		return dayjs(data).format('DD.MM.YYYY');
	}

	const [aboutReplaced, setAboutReplaced] = useState(``);

	useEffect(() => {
		if(data && data.description) {
			setAboutReplaced(data.description.replace(/\n/g, '<br/>'));
		} 
	}, [data]);

	useEffect(() => {
		const doCart = () => {
			if(session.data) {
				session.data.cart.forEach((e: ICart) => {
					if(id == e.idProduct) {
						setIsInCart(true);
					} else {
						setIsInCart(false);
					}
				})
			}
		}

		doCart();
	}, [session.data, session.refetch]);

	const [isChanged, setIsChanged] = useState(false);

	const [isInCart, setIsInCart] = useState<boolean>();

	const [isAddress, setIsAddress] = useState(false);


	return (
		<>
		<Header />
		{isOpen && data && (
			<>
				<div className="background-dark fixed top-0 left-0 w-full h-full bg-black z-50 opacity-40"></div>
				<ModalProduct phone={data.phoneNumber} setIsOpen={setIsOpen} />
			</>
		)}
		{isAddress && data && (
			<>
				<div className="background-dark fixed top-0 left-0 w-full h-full bg-black z-50 opacity-40"></div>
				<ModalAddress address={data.address} setIsAddress={setIsAddress} />
			</>
		)}
		{isChanged && data && id && (
			<>
				<div className="background-dark fixed top-0 left-0 w-full h-full bg-black z-50 opacity-40"></div>
				<PlacesModal id={id} places={data.places} setIsChanged={setIsChanged} />
			</>
		)}
			{isLoading ? (
					<div className="flex justify-center my-20">
						<h1 className='text-center'>Загрузка...</h1>
					</div>
		) : (
				<div className="size product-container flex justify-center mx-48 my-12">
					{data && !error ? (<div className="product-info flex flex-row gap-12">
						<div className="image-container flex flex-col">
							{data && data.images.length > 1 && (
								<div className="arrow-left arrow" onClick={sliderLeft}>
									<span>
										<FaArrowLeftLong size={24} />
									</span>
								</div>
							)}
							<img className='select-none' src={data.images[index]} alt={data.title} />
							{data && session.data?._id == data.authorId && (
								<div className="absolute top-5 left-5">
									<span>
										{!isOpenMenu && (<div onClick={() => setIsOpenMenu(true)} className="p-4 cursor-pointer bg-slate-200 rounded-full z-10"><IoMenu className='' size={28} /></div>)}
									</span>
									{isOpenMenu && data && (
										<ul className='bg-slate-100 z-10 p-6 rounded-2xl relative border-2 border-black'>
											<li className='cursor-pointer absolute top-1 right-1'><IoMdClose size={20} onClick={() => setIsOpenMenu(false)}/></li>
											<li onClick={() => setIsChanged(true)}><a href="#">Изменить количество мест</a></li>
											<li><Link to={`/changeLodging/${id}`}>Изменить</Link></li>
											<li onClick={removeLodging}><a href="#">Удалить</a></li>
										</ul>
									)}
								</div>
							)}
							{data && data.images.length > 1 && (
								<div className="arrow-right arrow" onClick={sliderRight}>
									<span>
										<FaArrowRightLong size={24} />
									</span>
								</div>
							)}
							<i className='select-none'>Выставленно {createDate(data.createdAt)}</i>
							{session.data && !session.isError && (
								<div className="favourite" onClick={addToCart}>
										<GrFavorite size={32} className='w-fit' color={isInCart ? 'crimson' : '#000'} />
								</div>
							)}
						</div>
						<div className="info-block flex flex-col gap-2">
							<h2 className="text-3xl font-bold">{data.title}</h2>
							<p className="text-slate-500" dangerouslySetInnerHTML={{__html: aboutReplaced}}></p>
							<i>Тип: {data.isHotel ? 'Отель'  : 'Частный'}</i>
							<span>Город: <u>{data.city}</u></span>
							<Link to={'/user/' + data.authorId}>Создатель: {data.author}</Link>
							<i>{data.isHotel ? 'Рейтинг' : 'Средняя оценка'}: {data.raiting} звёзд</i>
							<i className='places-count'>Осталось: {data.places} места</i>
							<span className='text-xl'>Цена: <b>{data.price} руб.</b></span>
							<div className="bttns flex gap-4">
								<button role='button' className='w-100 btn mt-2 text-center border border-emerald-500' onClick={() => setIsAddress(true)}>Узнать адрес</button>
								<button role='button' className='w-100 btn mt-2 text-center' onClick={() => setIsOpen(true)}>Узнать телефон</button>
							</div>
						</div>
					</div>) : (
					<h1>Ошибка! Товара несуществует либо товар был удалён</h1>
					)}
				</div>
			)}
			<Footer />
		</>
	)
}