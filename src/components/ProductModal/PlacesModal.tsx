import { IoMdClose } from 'react-icons/io'
import './ProductModal.scss'
import { useState } from 'react';
import { useChangePlaces } from '../../hooks/useProducts';

interface IProps {
    setIsChanged: (data: any) => void,
    places: number,
		id: string,
}

export function PlacesModal(props: IProps) {

	const [places, setPlaces] = useState(props.places);

	const { mutate } = useChangePlaces(places, props.id);


    return (
        <>
            <div className="modal-window">
                <div className="modal-phone">
                    <div className="close-btn" onClick={() => props.setIsChanged(false)}><IoMdClose size={30} /></div>
                    <h2 className="text-3xl">Количество мест:</h2>
                    <b className="text-3xl">{props.places}</b>
										<input onChange={(e: any) => { setPlaces(e.target.value) } } type="number" placeholder={props.places + ` мест`} />
                    <button onClick={() => { mutate(); props.setIsChanged(false); } }>Изменить</button>
                </div>
            </div>
        </>
    )
}