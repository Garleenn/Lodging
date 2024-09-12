import './ProductModal.scss'
import { IoMdClose } from 'react-icons/io'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
	setIsOpenImage: (data: any) => void,
	images: string[],
	indexNow: number
}

export function ImageModal(props: IProps) {

	const [index, setIndex] = useState<number>(props.indexNow);

	const sliderLeft = useCallback(() => {
		if (index == 0) {
			setIndex(props.images.length - 1);
		} else {
			setIndex(prev => { return prev - 1 });
		}
	}, [index]);

	const sliderRight = useCallback(() => {
		if (index == props.images.length - 1) {
			setIndex(0);
		} else {
			setIndex(prev => { return prev + 1 });
		}
	}, [index]);

	const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "ArrowLeft") {
      sliderLeft();
    } else if (event.code === "ArrowRight") {
      sliderRight();
    } else if (event.code === "Escape") {
      props.setIsOpenImage(false);
    }
  };

	const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
		if(ref.current) {
			ref.current.focus();
		}
  }, []);


	return (
		<>
			<div className="modal-window">
				<div className="modal-image">
					{props.images ? (
						<>

							<div className="close-btn-white close-btn" onClick={() => props.setIsOpenImage(false)}><IoMdClose size={25} /></div>
							<div ref={ref} className="images-container flex flex-col" tabIndex={0} onKeyDown={keyDownHandler} >
								{props.images.length > 1 && (
									<div className="arrow-left arrow" onClick={sliderLeft}>
										<span>
											<FaArrowLeftLong />
										</span>
									</div>
								)}
								<img className='select-none' src={props.images[index]} />
								{props.images.length > 1 && (
									<div className="arrow-right arrow" tabIndex={0} onClick={sliderRight}>
										<span>
											<FaArrowRightLong />
										</span>
									</div>
								)}
							</div>
						</>
					) : (
						<>
						<div className="close-btn-white close-btn" onClick={() => props.setIsOpenImage(false)}><IoMdClose size={25} /></div>
						<div className="w-full h-full flex justify-center items-center">
							<h1 className=''>Загрузка...</h1>
						</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}