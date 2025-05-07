"use client";

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Spinner } from '@/components/common/Spinner';
import ListEventos from '@/components/eventos/ListEventos';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { ChevronDownIcon, PlusIcon } from '@/icons';
import "flatpickr/dist/themes/light.css";
import { useState } from 'react';

export default function page() {


    //alert
    const [visibleAlert, setVisibleAlert] = useState(false)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")
    //
    const [loading, setLoading] = useState(false)
    //
    const [openModalCrearEvento, setOpenModalCrearEvento] = useState(true)

    const [tituloEvento, setTituloEvento] = useState("");
    const [fechaInicioEvento, setFechaInicioEvento] = useState("");
    const [fechaFinalEvento, setFechaFinalEvento] = useState("");
    const [codigoCategoria, setCodigoCategoria] = useState(0);
    const [descripcion, setDescripcion] = useState("");
    const [cantidadAforo, setCantidadAforo] = useState(0);



    const options = [
        { value: 1, label: "Evento deportivo" },
        { value: 2, label: "Evento educativo" },
        { value: 3, label: "Evento de certificación" },
    ];

    const handleSelectChange = (value: string) => {
        setCodigoCategoria(Number(value));
    };

    const guardarEvento = async () => {
        try {
            const request = {
                nombre: tituloEvento,
                fechaInicio: fechaInicioEvento,
                fechaFin: fechaFinalEvento,
                descripcion: descripcion,
                idCategoria: codigoCategoria,
                cantidadAforo: cantidadAforo
            }

            console.log("BODY: ", JSON.stringify(request, null, 2))
        } catch (error) {
            console.log("ERROR ", error)
        }
    }


    return (
        <div>
            <Alert
                title={title}
                message={message}
                variant={variant}
                isVisible={visibleAlert}
                sx="top-22 right-5 w-100"
            />
            <Spinner
                activate={loading}
                sx="w-full h-full fixed top-0 left-0 blue-bg-chas-op " />

            <ComponentCard title="">
                <Button endIcon={<PlusIcon />} size='sm' className='bg-uees' onClick={() => setOpenModalCrearEvento(true)}>Crear evento</Button>

                <ListEventos
                    setLoading={setLoading}
                    date={""}
                    setVisibleAlert={setVisibleAlert}
                    setTitle={setTitle}
                    setMessage={setMessage}
                    setVariant={setVariant}
                />
            </ComponentCard>

            {/*  */}
            {/* MODAL CREAR EVENTO */}
            {/*  */}
            <Modal
                isOpen={openModalCrearEvento}
                onClose={() => setOpenModalCrearEvento(false)}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            Añadir evento
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Planifica tu próximo gran momento: programa o edita un evento para mantenerte al día.
                        </p>
                    </div>
                    <div className="mt-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Nombre del evento
                            </label>
                            <input
                                id="event-title"
                                type="text"
                                value={tituloEvento}
                                onChange={(e) => setTituloEvento(e.target.value)}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        <div className="mt-2">
                            <div className="flex gap-4"> {/* Contenedor flex para alinear en fila */}

                                {/* Start Date */}
                                <div className="w-1/2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Fecha de inicio
                                    </label>
                                    <input
                                        id="event-start-date"
                                        type="date"
                                        value={fechaInicioEvento}
                                        onChange={(e) => setFechaInicioEvento(e.target.value)}
                                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="w-1/2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Fecha final
                                    </label>
                                    <input
                                        id="event-end-date"
                                        type="date"
                                        value={fechaFinalEvento}
                                        onChange={(e) => setFechaFinalEvento(e.target.value)}
                                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="mt-2">
                            <Label>Seleccione la categoría</Label>
                            <div className="relative">
                                <Select
                                    options={options}
                                    placeholder="Seleccione una opción"
                                    onChange={handleSelectChange}
                                    className="dark:bg-dark-900"
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Label>Descripción</Label>
                            <TextArea
                                value={descripcion}
                                onChange={(value) => setDescripcion(value)}
                                rows={3}
                            />
                        </div>

                        <div className="mt-2">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Cantidad de aforo
                            </label>
                            <input
                                id="event-title"
                                type="number"
                                value={cantidadAforo}
                                onChange={(e) => setCantidadAforo(Number(e.target.value))}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>



                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button
                            onClick={() => setOpenModalCrearEvento(false)}
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={() => guardarEvento()}
                            type="button"
                            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-uees px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>



        </div>
    )
}
