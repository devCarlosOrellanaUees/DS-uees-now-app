"use client";

import { formatDateSmall } from '@/utils/common';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';
import { FaEye, FaPencil } from 'react-icons/fa6';

interface Evento {
    idEvento: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string | null;
    idCategoria: number;
    cantidadAforo: number;
    inscritos: number;
    estado: number;
    banner: string;
}

interface ListEventosProps {
    eventos: Evento[];

}

export default function ListEventosInscritos({
    eventos,

}: ListEventosProps) {

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
                                    <p className='text-sm'>{evento.idCategoria}</p>
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
                                <div>
                                    <p className="font-semibold">Inscritos:</p>
                                    <p className='text-sm'>{evento.inscritos}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Cupos disponibles:</p>
                                    <p className='text-sm'>{evento.cantidadAforo - evento.inscritos}</p>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="mt-4 text-sm text-gray-800 dark:text-white">
                                <p className="font-semibold mb-1">Descripción:</p>
                                <p className="text-justify text-sm">{evento.descripcion}</p>
                            </div>

                            {/* Acciones */}
                            <div className="mt-2 flex justify-center gap-4 text-gray-600 dark:text-gray-300 relative">
                                <Button
                                    variant='outline'
                                    size='sm'
                                    startIcon={<FaEye />}
                                >
                                    Ver detalles
                                </Button>
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
