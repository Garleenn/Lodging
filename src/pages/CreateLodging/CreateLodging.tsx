import './CreateLodging.scss'
import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header/Header";
import { IProduct } from "../../types/product.interface";
import { usePostProduct } from "../../hooks/useProducts";
import { useState } from "react";

export function CreateLodging() {

	const { register, handleSubmit, reset, setValue } = useForm<IProduct>();

	const [product, setProduct] = useState<IProduct>();

	const { mutate } = usePostProduct(product);

	const submit: SubmitHandler<IProduct> = data => {
		setProduct(data);
		console.log(data);
		
		if(data) {
			mutate();
			reset();
		}
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
					console.log(imagesArray);
				}
			};
			reader.readAsDataURL(file);
		});
	}
	
	const renderImages = (imagesArray: string[]) => {
		const imageContainer = document.getElementById("imageContainer");
		if (imageContainer) {
			imageContainer.innerHTML = "";
			imagesArray.forEach(image => {
				const imgElement = document.createElement("img");
				imgElement.src = image;
				imgElement.style.maxWidth = "150px";
				imgElement.style.maxHeight = "150px";
				imgElement.style.borderRadius = "12px";
				imgElement.style.objectFit = "cover";
				imageContainer.appendChild(imgElement);
			});
		}
	}


	return (
		<>
			<Header />
			<div className="main flex justify-center">
				<form onSubmit={handleSubmit(submit)} className="form-create flex flex-col items-center border border-black rounded-2xl xl:p-16 p-5 my-10 mx-6">
					<h2 className="text-3xl font-bold text-center">Создать объявление</h2>
					<div className="inputs flex flex-col">
						<label className="mt-5">Название номера</label>
						<input type="text" {...register('title')}/>
						<label className="mt-5">Изображения номера</label>
						<div className="input-file-row">
							<label className="input-file">
								<input type="file" name="file[]" onChange={(event) => convertImages(event)} multiple accept="image/*"/>
								<span>Выбрать изображения</span>
							</label>
							<div id="imageContainer"></div>
						</div>
						<label className="mt-5">Описание номера</label>
						<textarea {...register('description')} />
						<div className="checkbox flex items-center gap-2">
							<input className="mt-4 text-purple-600" type="checkbox" {...register('isHotel')}/>
							<label>Это отель?</label>
						</div>
						<label className="mt-5">Город</label>
						<input {...register('city')}/>
						<label className="mt-5">Цена</label>
						<input type="number" {...register('price')}/>
						<label className="mt-5">Ваш номер телефона</label>
						<input type="tel" {...register('phoneNumber')}/>
						<label className="mt-5">Количество оставшихся мест</label>
						<input type="number" min='0' {...register('places')}/>
					</div>
					<button type="submit" className="mt-8 w-fit mx-auto">Создать объявление</button>
				</form>
			</div>
		</>
	)
}