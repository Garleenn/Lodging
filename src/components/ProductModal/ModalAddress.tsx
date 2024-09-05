import { IoMdClose } from 'react-icons/io'
import './ProductModal.scss'

interface IProps {
    setIsAddress: (data: any) => void,
    address: string,
}

export function ModalAddress(props: IProps) {


    return (
        <>
            <div className="modal-window">
                <div className="modal-phone">
                    <div className="close-btn" onClick={() => props.setIsAddress(false)}><IoMdClose size={30} /></div>
                    <h2 className="text-3xl">Адрес:</h2>
                    <b className="text-3xl text-center">{props.address}</b>
                    <a className='mt-4' target='_blank' href={`https://yandex.ru/maps/geo/` + props.address}><button>Посмотреть город на карте</button></a>
                </div>
            </div>
        </>
    )
}