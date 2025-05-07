import { FaImage, FaCog } from 'react-icons/fa';

interface Evento {
    banner: string;
    nombre: string;
    idCategoria: string;
    fechaInicio: string;
    fechaFin: string;
    cantidadAforo: number;
    estado: number;
    descripcion: string;
}

const CardEvento = ({ evento }: { evento: Evento }) => {
    return (
        <div className="max-w-md bg-white dark:bg-gray-900 rounded-[18px] shadow-md overflow-hidden border border-gray-300 dark:border-gray-700">
            {/* Banner */}
            <img
                src={evento.banner}
                alt="Banner del evento"
                className="w-full h-48 object-cover"
            />

            {/* Detalles */}
            <div className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                        <p className="font-semibold">Nombre:</p>
                        <p>{evento.nombre}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Categoría:</p>
                        <p>{evento.idCategoria}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Fecha Inicio:</p>
                        <p>{evento.fechaInicio}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Fecha Fin:</p>
                        <p>{evento.fechaFin}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Aforo:</p>
                        <p>{evento.cantidadAforo}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Estado:</p>
                        <p>{evento.estado === 1 ? 'Activo' : 'Inactivo'}</p>
                    </div>
                </div>

                {/* Descripción */}
                <div className="mt-4 text-sm text-gray-800 dark:text-white">
                    <p className="font-semibold mb-1">Descripción:</p>
                    <p className="text-justify">{evento.descripcion}</p>
                </div>

                {/* Acciones */}
                <div className="mt-4 flex justify-end gap-4 text-gray-600 dark:text-gray-300">
                    <button title="Actualizar banner" className="hover:text-blue-500">
                        <FaImage size={18} />
                    </button>
                    <button title="Opciones del evento" className="hover:text-red-500">
                        <FaCog size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardEvento;
