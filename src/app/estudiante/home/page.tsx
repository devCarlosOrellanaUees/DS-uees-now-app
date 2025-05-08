"use client";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Spinner } from "@/components/common/Spinner";
import ListEventosEstudiante from "@/components/eventos/ListEventosEstudiante";
import Alert from "@/components/ui/alert/Alert";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";


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
  //
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
          eventos={dataEventos}

        />




      </div>
    </div>
  );
}
