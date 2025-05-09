"use client";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Spinner } from "@/components/common/Spinner";
import ListEventosEstudiante from "@/components/eventos/ListEventosEstudiante";
import Alert from "@/components/ui/alert/Alert";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { formatDateSmall } from "@/utils/common";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBookBookmark } from "react-icons/fa6";


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

export default function Home() {

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
  const [openModalInscripcion, setOpenModalInscripcion] = useState(false);



  const { user } = useAuth()

  const getAllEventos = async () => {
    setLoading(true)
    try {
      setDataEventos([])
      const response = await fetchAPI(endpoints.getAllEventosDisponibles + '?codigoUsuario=' + user?.idUsuario, 'GET')
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

  const inscribirEnEvento = async () => {
    try {
      const request = {
        idEvento: eventoSelected?.idEvento,
        idUsuario: user?.idUsuario,
        estado: 1,
        fecha: new Date()
      }

      console.log(JSON.stringify(request, null, 2))
      const response = await fetchAPI(endpoints.saveInscripcion, 'POST', request)
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
      setLoading(false);
      setOpenModalInscripcion(false)
      setTimeout(() => setVisibleAlert(false), 3000);
    }
  }



  useEffect(() => {
    getAllEventos()
  }, [])

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
            Eventos disponibles
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Aquí podrás explorar los eventos publicados por la universidad. Utiliza los paneles y cuadrículas para navegar entre las opciones disponibles.
            Consulta el panel principal y otras secciones para conocer más detalles e inscribirte en las actividades que sean de tu interés.
          </p>
        </div>


        <ListEventosEstudiante
          setEventoSelected={setEventoSelected}
          setOpenModalInscripcion={setOpenModalInscripcion}
          eventos={dataEventos}

        />

        {/*  */}
        {/* MODAL INSCRIPCION */}
        {/*  */}
        <Modal
          isOpen={openModalInscripcion}
          onClose={() => setOpenModalInscripcion(false)}
          showCloseButton={false}
          className="max-w-[907px] p-4 lg:p-10"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Imagen a la izquierda */}
            <div className="w-full lg:w-1/2">
              <Image
                className="w-full h-64 object-cover rounded-md"
                src="/images/banners/evento1.png"
                alt="Banner del evento"
                width={300}
                height={200}
              />
            </div>

            {/* Información a la derecha */}
            <div className="w-full lg:w-1/2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {/* Atributos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold">Nombre:</p>
                  <p>{eventoSelected?.nombre}</p>
                </div>
                <div>
                  <p className="font-semibold">Categoría:</p>
                  <p>{eventoSelected?.nombreCategoria}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha Inicio:</p>
                  <p>{formatDateSmall(eventoSelected?.fechaInicio ?? "")}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha Fin:</p>
                  <p>{formatDateSmall(eventoSelected?.fechaFin ?? "")}</p>
                </div>
                <div>
                  <p className="font-semibold">Aforo:</p>
                  <p>{eventoSelected?.cantidadAforo}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado:</p>
                  <Badge size="sm" color={
                    eventoSelected?.estado === 1 ? 'success' :
                      eventoSelected?.estado === 2 ? 'info' :
                        'error'
                  }>
                    {eventoSelected?.estado === 1 ? 'Activo' : eventoSelected?.estado === 2 ? 'Suspendido' : 'Cerrado'}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">Inscritos:</p>
                  <p>{eventoSelected?.inscritos}</p>
                </div>
                <div>
                  <p className="font-semibold">Cupos disponibles:</p>
                  <p>{(eventoSelected?.cantidadAforo ?? 0) - (eventoSelected?.inscritos ?? 0)}</p>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <p className="font-semibold mb-1">Descripción:</p>
                <p className="text-justify text-gray-800 dark:text-white">{eventoSelected?.descripcion}</p>
              </div>

              {/* Botón */}
              <div className="flex justify-end gap-2">
                <Button
                  className="bg-gray-300 hover:bg-gray-500"
                  size='sm'
                  onClick={() => setOpenModalInscripcion(false)}
                >
                  Cerrar
                </Button>
                <Button
                  size='sm'
                  onClick={() => inscribirEnEvento()}
                  className="bg-success-500 hover:bg-success-800"
                  startIcon={<FaBookBookmark />}
                >
                  Inscribirme
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/*  */}
        {/* END MODAL INSCRIPCION */}
        {/*  */}




      </div>
    </div>
  );
}
