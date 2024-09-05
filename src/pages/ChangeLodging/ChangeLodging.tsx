import { useParams } from "react-router-dom"
import { Header } from "../../components/Header/Header";
import { useChangeProduct, useProduct } from "../../hooks/useProducts";
import { SubmitHandler, useForm } from "react-hook-form";
import { IProduct } from "../../types/product.interface";
import { useRef, useState } from "react";
import { useSession } from "../../hooks/useUser";
import { Footer } from "../../components/Footer/Footer";


export function ChangeLodging() {

	let { id } = useParams<string>();

	let { data, isError } = useProduct(id);

	const { register, handleSubmit, setValue } = useForm<IProduct>();

	const [product, setProduct] = useState<IProduct>();

	const { mutate } = useChangeProduct(product, id);

	const submit: SubmitHandler<IProduct> = async data => {
		setProduct(data);
		
		mutate();
	}

	const convertImages = (event: React.ChangeEvent<HTMLInputElement> | any) => {
		let files = event.target.files;
		let imagesArray: any[] = [];
	
		Array.from(files).forEach((file: any) => {
			const reader = new FileReader();
			reader.onload = () => {
				imagesArray.push(reader.result);
				if (imagesArray.length === files.length) {
					setValue('images', imagesArray);
					renderImages(imagesArray);
					startImagesRef.current.style.display = 'none';
				}
			};
			reader.readAsDataURL(file);
		});
	}
	
	const renderImages = (imagesArray: string[]) => {
		if (changedImagesRef.current) {
			changedImagesRef.current.innerHTML = "";
			imagesArray.forEach(image => {
				const imgElement = document.createElement("img");
				imgElement.src = image;
				imgElement.style.maxWidth = "150px";
				imgElement.style.maxHeight = "150px";
				imgElement.style.borderRadius = "12px";
				imgElement.style.objectFit = "cover";
				changedImagesRef.current.appendChild(imgElement);
			});
		}
	}

	const session = useSession();

	const startImagesRef = useRef<HTMLDivElement | any>();
	const changedImagesRef = useRef<HTMLDivElement | any>();


	return (
		<>
			<Header />
			<div className="main flex justify-center size">
				{session.data && data && !isError && session.data._id == data.authorId && (
					<form onSubmit={handleSubmit(submit)} className="form-create flex flex-col items-center border border-black rounded-2xl xl:p-16 p-5 my-10 mx-6">
						<h2 className="text-3xl font-bold text-center">Создать объявление</h2>
						<div className="inputs flex flex-col">
							<label className="mt-5">Название номера</label>
							<input type="text" {...register('title', { value: data.title })}/>
							<label className="mt-5">Изображения номера</label>
							<div className="input-file-row">
								<label className="input-file">
									<input type="file" name="file[]" onChange={(event) => convertImages(event)} multiple accept="image/*" />
									<span>Выбрать изображения</span>
								</label>
								<div ref={changedImagesRef} id="imageContainer"></div>
								<div ref={startImagesRef} id="imageContainer">{data?.images.map((image) => {return (
									<img key={image} src={image} alt="" />
								)})}</div>
							</div>
							<label className="mt-5">Описание номера</label>
							<textarea {...register('description', { value: data.description })} />
							<div className="checkbox flex items-center gap-2">
								<input className="mt-4 text-purple-600" type="checkbox" {...register('isHotel', { value: data.isHotel })}/>
								<label>Это отель?</label>
							</div>
							<label className="mt-5">Город</label>
							<input {...register('city', { value: data.city })}/>
							<label className="mt-5">Адрес</label>
						<input {...register('address', { value: data.address })}/>
							<label className="mt-5">Цена</label>
							<input type="number" {...register('price', { value: data.price })}/>
							<label className="mt-5">Ваш номер телефона</label>
							<input type="tel" {...register('phoneNumber', { value: data.phoneNumber })}/>
							<label className="mt-5">Количество оставшихся мест</label>
							<input type="number" min='0' {...register('places', { value: data.places })}/>
						</div>
						<button type="submit" className="mt-8 w-fit mx-auto">Изменить объявление</button>
					</form>
				)}
			</div>
			<Footer />
		</>
	)
}