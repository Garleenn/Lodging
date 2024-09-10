import './ProductModal.scss'
import { IoMdClose } from 'react-icons/io'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import { useCallback, useState } from 'react';

interface IProps {
	setIsOpenImage: (data: any) => void,
	images: string[],
	indexNow: number
}

export function ImageModal(props: IProps) {

	const [index, setIndex] = useState<number>(props.indexNow);

	const sliderLeft = useCallback(() => {
		if(index == 0) {
			setIndex(props.images.length - 1);
		} else {
			setIndex(prev => {return prev - 1});
		}
	}, [index]);

	const sliderRight = useCallback(() => {
		if(index == props.images.length - 1) {
			setIndex(0);
		} else {
			setIndex(prev => {return prev + 1});
		}
	}, [index]);


	return (
		<>
			<div className="modal-window">
				<div className="modal-image">
					<div className="close-btn-white close-btn" onClick={() => props.setIsOpenImage(false)}><IoMdClose size={25} /></div>
					<div className="images-container flex flex-col">
							{props.images.length > 1 && (
								<div className="arrow-left arrow" onClick={sliderLeft}>
									<span>
										<FaArrowLeftLong />
									</span>
								</div>
							)}
							<img className='select-none' src={props.images[index]} />
							{props.images.length > 1 && (
								<div className="arrow-right arrow" onClick={sliderRight}>
									<span>
										<FaArrowRightLong />
									</span>
								</div>
							)}
						</div>
				</div>
			</div>
		</>
	)
}