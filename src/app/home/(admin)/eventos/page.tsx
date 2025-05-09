"use client";

import endpoints from '@/api/endpoints';
import fetchAPI from '@/api/fetchAPI';
import ComponentCard from '@/components/common/ComponentCard';
import { Spinner } from '@/components/common/Spinner';
import ListEventos from '@/components/eventos/ListEventos';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { CalenderIcon, ChevronDownIcon, PlusIcon } from '@/icons';
import { convertirAFormatoISO } from '@/utils/common';
import { Spanish } from 'flatpickr/dist/l10n/es';
import "flatpickr/dist/themes/light.css";
import { useEffect, useState } from 'react';
import Flatpickr from "react-flatpickr";

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

export default function page() {


    //alert
    const [visibleAlert, setVisibleAlert] = useState(false)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")
    //
    const [loading, setLoading] = useState(false)
    //
    const [openModalCrearEvento, setOpenModalCrearEvento] = useState(false)
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [openConfirmationActivacion, setOpenConfirmationActivacion] = useState<boolean>(false);
    const [openConfirmationCerrar, setOpenConfirmationCerrar] = useState<boolean>(false);
    //
    const [idEvento, setIdEvento] = useState(0);
    const [tituloEvento, setTituloEvento] = useState("");
    const [fechaInicioEvento, setFechaInicioEvento] = useState("");
    const [fechaFinalEvento, setFechaFinalEvento] = useState("");
    const [codigoCategoria, setCodigoCategoria] = useState(1);
    const [descripcion, setDescripcion] = useState("");
    const [cantidadAforo, setCantidadAforo] = useState(0);
    const [inscritos, setInscritos] = useState(0);
    //
    const [dataEventos, setDataEventos] = useState([]);
    //
    const [estadoEvento, setEstadoEvento] = useState(1);
    //
    const [eventoSelected, setEventoSelect] = useState<Evento>();



    const options = [
        { value: 1, label: "Evento deportivo" },
        { value: 2, label: "Evento educativo" },
        { value: 3, label: "Evento de certificación" },
    ];

    const optionsEstadoEvento = [
        { value: 1, label: "Activos" },
        { value: 2, label: "Suspendidos" },
        { value: 3, label: "Cerrados" },
    ];

    const handleSelectChange = (value: string) => {
        setCodigoCategoria(Number(value));
    };

    const handleSelectChangeEventos = (value: string) => {
        setEstadoEvento(Number(value));
    };

    const guardarEvento = async () => {
        try {
            const request = {
                idEvento: (idEvento == 0 ? null : idEvento),
                nombre: tituloEvento,
                fechaInicio: convertirAFormatoISO(new Date(fechaInicioEvento)),
                fechaFin: convertirAFormatoISO(new Date(fechaFinalEvento)),
                descripcion: descripcion,
                idCategoria: codigoCategoria,
                cantidadAforo: cantidadAforo,
                estado: eventoSelected?.estado || 1,
                banner: "foto.png",
                inscritos: inscritos
            }

            console.log("BODY: ", JSON.stringify(request, null, 2))
            const response = await fetchAPI(endpoints.saveEvento, 'POST', request)
            setVisibleAlert(true)
            setLoading(true)

            if (response.status == 1) {
                getAllEventos()
                setTitle("Correcto")
                setMessage(response.message)
                setVariant("success")
            } else {
                setTitle("Error")
                setMessage(response.message)
                setVariant("error")
            }
        } catch (error) {
            console.log("ERROR ", error)
        } finally {
            setEventoSelect(undefined)
            setLoading(false);
            setOpenModalCrearEvento(false)
            limpiarCampos()
            setTimeout(() => setVisibleAlert(false), 3000);
        }
    }

    const getAllEventos = async () => {
        setLoading(true)
        try {
            setDataEventos([])
            const response = await fetchAPI(endpoints.getAllEventos + '?estado=' + (estadoEvento ? estadoEvento : 1), 'GET')
            //console.log(JSON.stringify(response, null, 2))
            if (response.status == 1) {
                setDataEventos(response.data)
            } else {
                setDataEventos([])
                setVisibleAlert(true)
                setTitle("Error")
                setMessage(response.message)
                setVariant("error")
            }
        } catch (error) {
            console.log("ERROR", error)
        } finally {

            setLoading(false);
            setTimeout(() => setVisibleAlert(false), 3000);
        }
    }

    const suspenderEvento = async () => {
        try {
            const request = {
                idEvento: (idEvento),
                nombre: tituloEvento,
                fechaInicio: convertirAFormatoISO(new Date(fechaInicioEvento)),
                fechaFin: convertirAFormatoISO(new Date(fechaFinalEvento)),
                descripcion: descripcion,
                idCategoria: codigoCategoria,
                cantidadAforo: cantidadAforo,
                estado: 2,
                banner: "foto.png"
            }
            const response = await fetchAPI(endpoints.saveEvento, 'POST', request)
            //console.log("BODY: ", JSON.stringify(response, null, 2))
            setVisibleAlert(true)
            setLoading(true)

            if (response.status == 1) {
                getAllEventos()
                setTitle("Correcto")
                setMessage("Evento suspendido correctamente")
                setVariant("success")
            } else {
                setTitle("Error")
                setMessage(response.message)
                setVariant("error")
            }
        } catch (error) {
            console.log("ERROR ", error)
        } finally {
            setEventoSelect(undefined)
            setLoading(false);
            setOpenConfirmation(false)
            setTimeout(() => setVisibleAlert(false), 3000);
        }
    }

    const activarEvento = async () => {
        try {
            const request = {
                idEvento: (idEvento),
                nombre: tituloEvento,
                fechaInicio: convertirAFormatoISO(new Date(fechaInicioEvento)),
                fechaFin: convertirAFormatoISO(new Date(fechaFinalEvento)),
                descripcion: descripcion,
                idCategoria: codigoCategoria,
                cantidadAforo: cantidadAforo,
                estado: 1,
                banner: "foto.png"
            }

            const response = await fetchAPI(endpoints.saveEvento, 'POST', request)
            //console.log("BODY: ", JSON.stringify(response, null, 2))
            setVisibleAlert(true)
            setLoading(true)

            if (response.status == 1) {
                getAllEventos()
                setTitle("Correcto")
                setMessage("Evento activado correctamente")
                setVariant("success")
            } else {
                setTitle("Error")
                setMessage(response.message)
                setVariant("error")
            }
        } catch (error) {
            console.log("ERROR ", error)
        } finally {
            setEventoSelect(undefined)
            setLoading(false);
            setOpenConfirmationActivacion(false)
            setTimeout(() => setVisibleAlert(false), 3000);
        }
    }

    const cerrarEvento = async () => {
        try {
            const request = {
                idEvento: idEvento,
                nombre: tituloEvento,
                fechaInicio: convertirAFormatoISO(new Date(fechaInicioEvento)),
                fechaFin: convertirAFormatoISO(new Date(fechaFinalEvento)),
                descripcion: descripcion,
                idCategoria: codigoCategoria,
                cantidadAforo: cantidadAforo,
                estado: 3,
                banner: "foto.png"
            }

            const response = await fetchAPI(endpoints.saveEvento, 'POST', request)
            //console.log("BODY: ", JSON.stringify(response, null, 2))
            setVisibleAlert(true)
            setLoading(true)

            if (response.status == 1) {
                getAllEventos()
                setTitle("Correcto")
                setMessage("Evento cerrado")
                setVariant("success")
            } else {
                setTitle("Error")
                setMessage(response.message)
                setVariant("error")
            }
        } catch (error) {
            console.log("ERROR ", error)
        } finally {
            setEventoSelect(undefined)
            setLoading(false);
            setOpenConfirmationCerrar(false)
            setTimeout(() => setVisibleAlert(false), 3000);
        }
    }

    const limpiarCampos = () => {
        setIdEvento(0)
        setTituloEvento("")
        setFechaInicioEvento("")
        setFechaFinalEvento("")
        setCodigoCategoria(1)
        setDescripcion("")
        setCantidadAforo(0)
        setInscritos(0)
    }

    useEffect(() => {
        getAllEventos()
    }, [estadoEvento])



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
                <div className='flex gap-2'>
                    <Button endIcon={<PlusIcon />} size='sm' className='bg-uees' onClick={() => setOpenModalCrearEvento(true)}>Crear evento</Button>

                    <div className="relative">
                        <Select
                            options={optionsEstadoEvento}
                            placeholder="Filtre los eventos"
                            onChange={handleSelectChangeEventos}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>

                <ListEventos
                    eventos={dataEventos}
                    setOpenModalCrearEvento={setOpenModalCrearEvento}
                    setOpenConfirmation={setOpenConfirmation}
                    setOpenConfirmationActivacion={setOpenConfirmationActivacion}
                    setOpenConfirmationCerrar={setOpenConfirmationCerrar}

                    setIdEvento={setIdEvento}
                    setTituloEvento={setTituloEvento}
                    setFechaInicioEvento={setFechaInicioEvento}
                    setFechaFinalEvento={setFechaFinalEvento}
                    setCodigoCategoria={setCodigoCategoria}
                    setDescripcion={setDescripcion}
                    setCantidadAforo={setCantidadAforo}
                    setInscritos={setInscritos}

                    setEventoSelect={setEventoSelect}
                />

            </ComponentCard>


            {/*  */}
            {/* MODAL CREAR EVENTO */}
            {/*  */}
            <Modal
                isOpen={openModalCrearEvento}
                onClose={() => {
                    limpiarCampos()
                    setOpenModalCrearEvento(false)
                }}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            Añadir / Editar evento
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
                            <div className="flex gap-4">

                                {/* Start Date */}
                                <div className="w-1/2">
                                    <div className="flex justify-start space-x-4">
                                        <div className="relative">
                                            <Label htmlFor="startDate">Fecha inicio</Label>
                                            <div className="w-70 flatpickr-wrapper">
                                                <Flatpickr
                                                    className="w-70 py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md h-11 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                    placeholder="Seleccione una fecha"
                                                    options={{
                                                        locale: Spanish,
                                                        enableTime: true,
                                                        enableSeconds: true,
                                                        time_24hr: true,
                                                        dateFormat: "d-m-Y H:i:s",
                                                    }}
                                                    value={fechaInicioEvento}
                                                    onChange={(selectedDates) => {
                                                        if (selectedDates.length > 0) {
                                                            setFechaInicioEvento(selectedDates[0].toISOString()); // Convierte a string en formato ISO
                                                        }
                                                    }}

                                                />
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <CalenderIcon />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="w-1/2">
                                    <div className="flex justify-start space-x-4">
                                        <div className="relative">
                                            <Label htmlFor="startDate">Fecha final</Label>
                                            <div className="w-70 flatpickr-wrapper">
                                                <Flatpickr
                                                    className="w-70 py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md h-11 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                    placeholder="Seleccione una fecha"
                                                    options={{
                                                        locale: Spanish,
                                                        enableTime: true,
                                                        enableSeconds: true,
                                                        time_24hr: true,
                                                        dateFormat: "d-m-Y H:i:s",
                                                    }}
                                                    value={fechaFinalEvento}
                                                    onChange={(selectedDates) => {
                                                        if (selectedDates.length > 0) {
                                                            setFechaFinalEvento(selectedDates[0].toISOString()); // Convierte a string en formato ISO
                                                        }
                                                    }}
                                                />
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <CalenderIcon />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Label>Seleccione la categoría</Label>
                            <div className="relative">
                                <Select
                                    options={options}
                                    defaultValue={codigoCategoria}
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
                            onClick={() => {
                                limpiarCampos()
                                setOpenModalCrearEvento(false)
                            }}
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


            {/*  */}
            {/* MODAL CONFIMACION DE SUSPENCION */}
            {/*  */}
            <Modal
                isOpen={openConfirmation}
                onClose={() => setOpenConfirmation(false)}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
                <div className="text-center">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        ¿Está seguro?
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Desea suspender el evento: {tituloEvento}
                    </p>
                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={() => setOpenConfirmation(false)}>
                            Cerrar
                        </Button>
                        <Button size="sm" onClick={() => { suspenderEvento() }}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </Modal>
            {/*  */}
            {/* END MODAL CONFIRMATION SUSPENCION */}
            {/*  */}

            {/*  */}
            {/* MODAL CONFIMACION DE ACTIVACION */}
            {/*  */}
            <Modal
                isOpen={openConfirmationActivacion}
                onClose={() => setOpenConfirmationActivacion(false)}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
                <div className="text-center">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        Activar evento
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {tituloEvento}
                    </p>
                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={() => setOpenConfirmationActivacion(false)}>
                            Cerrar
                        </Button>
                        <Button size="sm" onClick={() => { activarEvento() }}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </Modal>
            {/*  */}
            {/* END MODAL CONFIRMATION AVTIVACION */}
            {/*  */}

            {/*  */}
            {/* MODAL CONFIMACION DE CIERRE */}
            {/*  */}
            <Modal
                isOpen={openConfirmationCerrar}
                onClose={() => setOpenConfirmationCerrar(false)}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
                <div className="text-center">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        ¿Está seguro?
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Desea cerrar el evento : {tituloEvento}
                    </p>
                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={() => setOpenConfirmationCerrar(false)}>
                            Cerrar
                        </Button>
                        <Button size="sm" onClick={() => { cerrarEvento() }}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </Modal>
            {/*  */}
            {/* END MODAL CONFIRMATION CIERRE */}
            {/*  */}



        </div>
    )
}
