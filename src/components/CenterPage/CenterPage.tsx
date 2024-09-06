import './CenterPage.scss'
import { useForm, SubmitHandler } from 'react-hook-form';

interface IProps {
	setFilters: (filters: any) => void,
}

interface IFind {
		city?: string,
		sPrice?: number,
		dPrice?: number,
		title?: string,
		isHotel?: boolean,
		filters?: string,
}

export function CenterPage(props: IProps) {

	const { register, handleSubmit } = useForm<IFind>();

	const submit: SubmitHandler<IFind> = async data => {
		await props.setFilters((prev: object) => {
			return {
				...prev,
				isHotel: data?.isHotel,
				filtre: data?.filters,
				city: data?.city,
				sPrice: data?.sPrice,
				dPrice: data?.dPrice,
				title: data?.title
			}
		});
	}
	

	return (
		<>
		<form onSubmit={handleSubmit(submit)}>
			<div className="main-container flex items-center flex-col">
				<div className="image-block"></div>
				<input {...register('title')} className='top-input w-1/4' type="search" placeholder='Найти ночлег'/>
			</div>
			<div className="flex justify-center filtre-container p-8 gap-8">
				<select {...register('isHotel')} defaultValue={'null'}>
					<option value='null'>Тип</option>
					<option value="true">Отель</option>
					<option value="false">Частные дома</option>
				</select>
				<input {...register('city')} type="search" placeholder='Город:'/>
				<input {...register('sPrice')} min={0} type="number" placeholder='Цена от:'/>
				<input {...register('dPrice')} max={2000000} type="number" placeholder='Цена до:'/>
				<select {...register('filters')} defaultValue={'null'}>
					<option value='null'>Сортировать</option>
					<option value="price-1">По убыванию цены</option>
					<option value="price1">По возрастанию цены</option>
					<option value="raiting1">По возрастанию рейтинга</option>
					<option value="raiting-1">По убыванию рейтинга</option>
					<option value="data1">Сначала старые</option>
					<option value="data-1">Сначала новые</option>
				</select>
				<button type='submit' className='rounded-none'>Найти</button>
			</div>
		</form>
		</>
	)
}