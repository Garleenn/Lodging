import { useRef } from 'react'
import './CenterPage.scss'
import { useState } from 'react';

interface IProps {
	setFilters: (filters: any) => void,
	setIsRefetch: (isRefetch: number) => void,
}

export function CenterPage(props: IProps) {

	const typeRef = useRef(null);
	const filterRef = useRef(null);

	const [details, setDetails] = useState({
		city: ``,
		sPrice: null,
		dPrice: null,
		title: ``,
	});


	const filtreProducts = () => {
		props.setFilters((prev: object) => {
			return {
				...prev,
				isHotel: typeRef.current.value,
				filtre: filterRef.current.value,

				city: details.city,
				sPrice: details.sPrice,
				dPrice: details.dPrice,
				title: details.title
			}
		});
		props.setIsRefetch((prev: number) => {
			return {
				...prev,
				refetch: prev += 1
			}
		});
	}
	

	return (
		<>
			<div className="main-container flex items-center flex-col">
				<div className="image-block"></div>
				<input onChange={e => setDetails(prev => { return {...prev, title: e.target.value}})} value={details.title} className='top-input w-1/4' type="search" placeholder='Найти ночлег'/>
			</div>
			<div className="flex justify-center filtre-container p-8 gap-8">
				<select ref={typeRef} defaultValue={'null'}>
					<option value='null'>Тип</option>
					<option value="true">Отель</option>
					<option value="false">Частные дома</option>
				</select>
				<input onChange={e => setDetails(prev => { return {...prev, city: e.target.value}})} value={details.city} type="search" placeholder='Город:'/>
				<input onChange={e => setDetails(prev => { return {...prev, sPrice: e.target.value}})} value={details.sPrice} min={0} type="number" placeholder='Цена от:'/>
				<input onChange={e => setDetails(prev => { return {...prev, dPrice: e.target.value}})} value={details.dPrice} max={2000000} type="number" placeholder='Цена до:'/>
				<select ref={filterRef} defaultValue={'null'}>
					<option value='null'>Сортировать</option>
					<option value="price-1">По убыванию цены</option>
					<option value="price1">По возрастанию цены</option>
					<option value="raiting1">По возрастанию рейтинга</option>
					<option value="raiting-1">По убыванию рейтинга</option>
					<option value="data1">Сначала старые</option>
					<option value="data-1">Сначала новые</option>
				</select>
				<button onClick={filtreProducts} className='rounded-none'>Найти</button>
			</div>
		</>
	)
}