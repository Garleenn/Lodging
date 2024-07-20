import { IoMdClose } from 'react-icons/io'
import './ProductModal.scss'

interface IProps {
    setIsOpen: (data: any) => void,
    phone: string
}

export function ModalProduct(props: IProps) {


    return (
        <>
            <div className="modal-window">
                <div className="modal-phone">
                    <div className="close-btn" onClick={() => props.setIsOpen(false)}><IoMdClose size={30} /></div>
                    <h2 className="text-3xl">Номер телефона:</h2>
                    <b className="text-3xl">{props.phone}</b>
                    <a className='mt-4' href={`tel:` + props.phone}><button>Позвонить</button></a>
                </div>
            </div>
        </>
    )
}