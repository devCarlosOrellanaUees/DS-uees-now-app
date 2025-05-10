"use client";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Spinner } from "@/components/common/Spinner";
import ListEventosEstudiante from "@/components/eventos/ListEventosEstudiante";
import ListEventosInscritos from "@/components/eventos/ListEventosInscritos";
import Alert from "@/components/ui/alert/Alert";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { formatDateSmall } from "@/utils/common";
import Image from "next/image";
import { useEffect, useState } from "react";


interface Evento {
    idEvento: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string | null;
    idCategoria: number;
    nombreCategoria: string;
    cantidadAforo: number;
    inscritos: number;
    estado: number;
    banner: string;
}

interface Comentario {
    autor: string;
    texto: string;
    fecha: string;
}

export default function EventosInscritos() {

    //alert
    const [visibleAlert, setVisibleAlert] = useState(false)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")
    //
    const [loading, setLoading] = useState(false)
    //
    const [dataEventos, setDataEventos] = useState([]);
    const [eventoSelected, setEventoSelected] = useState<Evento>();
    //
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    //
    const [openModalDetalles, setOpenModalDetalles] = useState(false);
    //
    const { user } = useAuth()

    const getAllEventos = async () => {
        setLoading(true)
        try {
            setDataEventos([])
            const response = await fetchAPI(endpoints.getAllEventosInscritos + '?codigoUsuario=' + user?.user.idUsuario, 'GET')
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

    const getAllComentarios = async () => {
        setLoading(true)
        try {
            const response = await fetchAPI(endpoints.getAllComentarios + '?codigoEvento=' + eventoSelected?.idEvento, 'GET')
            if (response.status == 1) {
                setComentarios(response.data)
            } else {
                setComentarios([])
            }
        } catch (error) {
            console.log("ERROR", error)
        } finally {
            setLoading(false);
        }
    }

    const saveComentario = async () => {
        try {
            const request = {
                comentario: nuevoComentario,
                idEvento: eventoSelected?.idEvento,
                fecha: new Date(),
                idusuario: user?.user.idUsuario
            }
            const response = await fetchAPI(endpoints.saveComentario, 'POST', request)
            if (response.status == 1) {
                getAllComentarios()
                setNuevoComentario("")
            }
        } catch (error) {
            console.log("ERROR", error)
        }
    }


    useEffect(() => {
        getAllEventos()
    }, [])

    useEffect(() => {
        if (openModalDetalles) getAllComentarios();
    }, [openModalDetalles])

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


            <PageBreadcrumb pageTitle="Eventos Uees Now" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full mb-4">
                    <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        Mis eventos inscritos
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Aquí podrás explorar los eventos publicados por la universidad. Utiliza los paneles y cuadrículas para navegar entre las opciones disponibles.
                        Consulta el panel principal y otras secciones para conocer más detalles e inscribirte en las actividades que sean de tu interés.
                    </p>
                </div>


                <ListEventosInscritos
                    eventos={dataEventos}
                    setEventoSelected={setEventoSelected}
                    setOpenModalDetalles={setOpenModalDetalles}

                />

                {/*  */}
                {/* MODAL DETALLES */}
                {/*  */}
                <Modal
                    isOpen={openModalDetalles}
                    onClose={() => {
                        setNuevoComentario("")
                        setOpenModalDetalles(false)
                    }}
                    showCloseButton={false}
                    className="max-w-[907px] w-full max-h-[95vh] overflow-hidden flex flex-col p-4 lg:p-6"
                >
                    {/* Contenido scrollable */}
                    <div className="overflow-y-auto pr-2 space-y-8">
                        {/* Encabezado: Imagen + Detalles */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Imagen */}
                            <div className="w-full lg:w-1/2">
                                <Image
                                    className="w-full h-64 object-cover rounded-md"
                                    src="/images/banners/evento1.png"
                                    alt="Banner del evento"
                                    width={300}
                                    height={200}
                                />
                            </div>

                            {/* Detalles */}
                            <div className="w-full lg:w-1/2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div><p className="font-semibold">Nombre:</p><p>{eventoSelected?.nombre}</p></div>
                                    <div><p className="font-semibold">Categoría:</p><p>{eventoSelected?.nombreCategoria}</p></div>
                                    <div><p className="font-semibold">Fecha Inicio:</p><p>{formatDateSmall(eventoSelected?.fechaInicio ?? "")}</p></div>
                                    <div><p className="font-semibold">Fecha Fin:</p><p>{formatDateSmall(eventoSelected?.fechaFin ?? "")}</p></div>
                                    <div><p className="font-semibold">Aforo:</p><p>{eventoSelected?.cantidadAforo}</p></div>
                                    <div><p className="font-semibold">Estado:</p>
                                        <Badge size="sm"
                                            color={
                                                eventoSelected?.estado === 1
                                                    ? 'success'
                                                    : eventoSelected?.estado === 2
                                                        ? 'info'
                                                        : 'error'
                                            }
                                        >
                                            {eventoSelected?.estado === 1
                                                ? 'Activo'
                                                : eventoSelected?.estado === 2
                                                    ? 'Suspendido'
                                                    : 'Cerrado'}
                                        </Badge>
                                    </div>
                                    <div><p className="font-semibold">Inscritos:</p><p>{eventoSelected?.inscritos}</p></div>
                                    <div><p className="font-semibold">Cupos disponibles:</p><p>{(eventoSelected?.cantidadAforo ?? 0) - (eventoSelected?.inscritos ?? 0)}</p></div>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <p className="font-semibold mb-1">Descripción:</p>
                                    <p className="text-justify text-gray-800 dark:text-white">
                                        {eventoSelected?.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sección de comentarios */}
                        <div>
                            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                Comentarios
                            </p>

                            {/* Lista de comentarios con scroll interno */}
                            <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                                {comentarios?.map((comentario, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                            {comentario.autor?.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Texto del comentario */}
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-sm  text-gray-700 dark:text-gray-400">{comentario.autor}</p>
                                                <span className="text-xs text-gray-500">
                                                    {formatDateSmall(comentario.fecha)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                                {comentario.texto}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input de nuevo comentario */}
                            <div className="mt-6">
                                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Escribe un comentario</p>
                                <input
                                    id="event-title"
                                    type="text"
                                    value={nuevoComentario}
                                    onChange={(e) => setNuevoComentario(e.target.value)}
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        size="sm"
                                        disabled={!nuevoComentario.trim()}
                                        onClick={() => saveComentario()}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/*  */}
                {/* END MODAL DETALLES */}
                {/*  */}



            </div>
        </div>
    );
}
