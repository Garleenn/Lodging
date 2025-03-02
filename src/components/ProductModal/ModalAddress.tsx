import { IoMdClose } from 'react-icons/io'
import './ProductModal.scss'
import { YMaps, Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';
import { useState } from 'react';

interface IProps {
    setIsAddress: (data: any) => void,
    address: string,
    coords: number[],
}

export function ModalAddress(props: IProps) {

    const [zoom, setZoom] = useState(9);
    
    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
      };

    return (
        <>
            <div className="modal-window">
                <div className="modal-phone">
                    <div className="close-btn" onClick={() => props.setIsAddress(false)}><IoMdClose size={30} /></div>
                    <h2 className="text-3xl">Адрес:</h2>
                    <b className="text-3xl text-center">{props.address}</b>

                    <YMaps>
                        <Map
                            defaultState={{ center: props.coords, zoom: zoom }}
                            // width="100%"
                            // height="500px"
                            onZoomChange={(e: any) => handleZoomChange(e.get('newZoom'))}
                        >
                            <Placemark geometry={props.coords} />
                            <ZoomControl options={{ float: 'left' }} />
                        </Map>
                    </YMaps>


                    <a className='mt-4' target='_blank' href={`https://yandex.ru/maps/geo/` + props.coords[0] + '/' + props.coords[1]}><button>Посмотреть город на карте</button></a>
                </div>
            </div>
        </>
    )
}