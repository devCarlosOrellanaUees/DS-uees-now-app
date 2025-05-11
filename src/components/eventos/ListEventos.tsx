"use client";

import { formatDateSmall } from '@/utils/common';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaCog, FaImage } from 'react-icons/fa';
import Badge from '../ui/badge/Badge';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

interface Evento {
    idEvento: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string | null;
    idCategoria: number;
    cantidadAforo: number;
    estado: number;
    banner: string;
    inscritos: number;
}

interface ListEventosProps {
    eventos: Evento[];
    setOpenModalCrearEvento: Dispatch<SetStateAction<boolean>>;
    setOpenConfirmationActivacion: Dispatch<SetStateAction<boolean>>;
    setOpenConfirmationCerrar: Dispatch<SetStateAction<boolean>>;
    setIdEvento: Dispatch<SetStateAction<number>>;
    setTituloEvento: Dispatch<SetStateAction<string>>;
    setFechaInicioEvento: Dispatch<SetStateAction<string>>;
    setFechaFinalEvento: Dispatch<SetStateAction<string>>;
    setCodigoCategoria: Dispatch<SetStateAction<number>>;
    setDescripcion: Dispatch<SetStateAction<string>>;
    setCantidadAforo: Dispatch<SetStateAction<number>>;
    setInscritos: Dispatch<SetStateAction<number>>;
    setOpenConfirmation: Dispatch<SetStateAction<boolean>>;
    setEventoSelect: Dispatch<SetStateAction<any>>
}

export default function ListEventos({
    eventos,
    setOpenModalCrearEvento,
    setOpenConfirmationActivacion,
    setOpenConfirmationCerrar,

    setIdEvento,
    setTituloEvento,
    setFechaInicioEvento,
    setFechaFinalEvento,
    setCodigoCategoria,
    setDescripcion,
    setCantidadAforo,
    setInscritos,
    setOpenConfirmation,
    setEventoSelect
}: ListEventosProps) {

    const [openedDropdown, setOpenedDropdown] = useState<number | null>(null);

    const optionsSettigns = [
        { key: 4, option: 'Editar' },
        { key: 3, option: 'Cerrar' },
        { key: 2, option: 'Suspender' },
        { key: 1, option: 'Activar' }
    ]


    const toggleDropdown = (id: number) => {
        if (openedDropdown === id) {
            setOpenedDropdown(null);
        } else {
            setOpenedDropdown(id);
        }
    };

    const handleSettingsClick = (evento: Evento, option: string) => {

        setIdEvento(evento.idEvento)
        setTituloEvento(evento.nombre)
        setFechaInicioEvento(new Date(evento.fechaInicio).toISOString());
        setFechaFinalEvento(new Date(evento.fechaFin).toISOString());
        setCodigoCategoria(evento.idCategoria)
        setDescripcion(evento.descripcion ?? '')
        setCantidadAforo(evento.cantidadAforo)
        setInscritos(evento.inscritos)

        switch (option) {
            case 'Editar':
                setOpenModalCrearEvento(true)

                break;
            case 'Suspender':
                setOpenConfirmation(true)

                break;
            case 'Cerrar':
                setOpenConfirmationCerrar(true)

                break;
            case 'Activar':
                setOpenConfirmationActivacion(true)

                break;
            default:
                console.warn('Opción no reconocida:', option);
        }
    };




    return (
        <div>

            <div className="flex flex-wrap gap-4">

                {eventos.map((evento: any, index: any) => (

                    <div key={index} className="max-w-md bg-white dark:bg-gray-900 rounded-[28px] shadow-md overflow-hidden border border-gray-300 dark:border-gray-700">
                        {/* Banner */}
                        <Image
                            className="w-full h-48 object-cover"
                            src="/images/banners/evento1.png"
                            alt="Logo1"
                            width={150}
                            height={40}
                        />

                        {/* Detalles */}
                        <div className="p-4 space-y-2">
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                                <div>
                                    <p className="font-semibold">Nombre:</p>
                                    <p className='text-sm'>{evento.nombre}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Categoría:</p>
                                    <p className='text-sm'>
                                        {evento.idCategoria == 1 ? 'DEPORTIVO'
                                            : evento.idCategoria == 2 ? 'SOCIAL' : 'EDUCATIVO'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Fecha Inicio:</p>
                                    <p className='text-sm'>{formatDateSmall(evento.fechaInicio)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Fecha Fin:</p>
                                    <p className='text-sm'>{formatDateSmall(evento.fechaFin)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Aforo:</p>
                                    <p className='text-sm'>{evento.cantidadAforo}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Estado:</p>
                                    <Badge size="sm" color={evento.estado === 1 ? 'success' : evento.estado === 2 ? 'info' : 'error'}>
                                        {evento.estado === 1 ? 'Activo' : evento.estado === 2 ? 'Suspendido' : 'Cerrado'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="mt-4 text-sm text-gray-800 dark:text-white">
                                <p className="font-semibold mb-1">Descripción:</p>
                                <p className="text-justify text-sm">{evento.descripcion}</p>
                            </div>

                            {/* Acciones */}
                            <div className="mt-2 flex justify-end gap-4 text-gray-600 dark:text-gray-300 relative">
                                {/* Botón para mostrar el Dropdown */}
                                <button
                                    title="Actualizar banner"
                                    className="hover:text-blue-500"
                                >
                                    <FaImage size={18} />
                                </button>
                                <button
                                    onClick={() => { toggleDropdown(evento.idEvento) }}
                                    title="Opciones del evento"
                                    className="hover:text-red-500"
                                >
                                    <FaCog size={18} />
                                </button>


                                {/* Dropdown */}
                                {openedDropdown === evento.idEvento && (
                                    <Dropdown
                                        isOpen={true}
                                        onClose={() => setOpenedDropdown(null)}
                                        className="absolute bottom-full right-0 mb-2 w-40 p-2 z-50 bg-white shadow-lg rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        {optionsSettigns.map((x) => (
                                            <DropdownItem
                                                key={x.key}
                                                value={x.option}
                                                onItemClick={() => { handleSettingsClick(evento, x.option) }}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                {x.option}
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    </div>

                ))}
            </div>


            {eventos.length === 0 && (
                <div className="flex justify-center items-center h-90">
                    <h1 className="text-gray-500">No hay eventos</h1>
                </div>
            )}
        </div>
    )
}
