"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import "flatpickr/dist/themes/light.css";
import { useEffect, useState } from "react";

import TableInscriptions from "@/components/tables/TableInscriptions";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateSmall } from "@/utils/common";
import { FaFileDownload } from "react-icons/fa";
import Button from "@/components/ui/button/Button";
import fetchAPI from "@/api/fetchAPI";
import endpoints from "@/api/endpoints";
import ExcelJS from 'exceljs';


interface Persona {
  idPersona: number;
  nombres: string;
  cedula: string;
  correo: string;
  telefono: string;
  fecha: string;
}

export default function TransactionsRed() {


  //alert
  const [visibleAlert, setVisibleAlert] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")
  //
  const [openModalDetalles, setOpenModalDetalles] = useState(false)
  //  
  const [dataPersona, setDataPersona] = useState<Persona[]>([])
  const [codigoEvento, setCodigoEvento] = useState(0)


  const getInscritos = async () => {
    try {
      const response = await fetchAPI(endpoints.getAllPersonasInscritasByEvento + "?codigoEvento=" + codigoEvento, "GET")
      if (response.status == 1) {
        setDataPersona(response.data)
      } else {
        setVisibleAlert(true)
        setTitle("Error")
        setMessage(response.message)
        setVariant("error")
      }
    } catch (error) {
      console.log("ERROR", error)
      setTimeout(() => setVisibleAlert(false), 3000);
    }
  }

  const handleExportListCorresToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('DataSheet')

      // Agregar encabezados de columna
      worksheet.addRow([
        'cedula',
        'nombres',
        'correo',
        'telefono',
        'fechaInscripcion'
      ])

      // Agregar info adicional
      dataPersona.forEach(row => {
        worksheet.addRow([
          row.cedula,
          row.nombres,
          row.correo,
          row.telefono,
          formatDateSmall(row.fecha)
        ])
      })

      const buffer = await workbook.xlsx.writeBuffer()

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'inscritos.xlsx'
      a.click()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.log("ERROR:", error)
    }
  }


  useEffect(() => {
    if (codigoEvento != 0)
      getInscritos()
  }, [codigoEvento])


  return (
    <div>
      <Alert
        title={title}
        message={message}
        variant={variant}
        isVisible={visibleAlert}
        sx="top-22 right-5 w-100"
      />

      <PageBreadcrumb pageTitle="Eventos con participantes" />
      <div className="space-y-6">
        <ComponentCard title="" desc="Filtra los eventos y gestiona sus aforos">

          <TableInscriptions
            setVisibleAlert={setVisibleAlert}
            setTitle={setTitle}
            setMessage={setMessage}
            setVariant={setVariant}

            setOpenModalDetalles={setOpenModalDetalles}
            setCodigoEvento={setCodigoEvento}
          />
        </ComponentCard>


        {/*  */}
        {/* MODAL INSCRITOS */}
        {/*  */}
        <Modal
          isOpen={openModalDetalles}
          onClose={() => {
            setOpenModalDetalles(false)
          }}
          showCloseButton={false}
          className="max-w-[907px] w-full max-h-[95vh] overflow-hidden flex flex-col p-4 lg:p-6"
        >
          <div className="overflow-y-auto pr-2 space-y-8">

            <div className="relative">
              <div className="flex items-center gap-2">
                <Button onClick={() => handleExportListCorresToExcel()}
                  variant="outline"
                  endIcon={<FaFileDownload />}
                >
                  <span>Descargar</span>
                </Button>
              </div>
            </div>

            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Cédula
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nombres completos
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Correo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Teléfono
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fecha de inscripción
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {dataPersona.map((x, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {x.cedula}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {x.nombres}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {x.correo}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {x.telefono}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDateSmall(x.fecha)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>
        </Modal>

        {/*  */}
        {/* END MODAL INSCRITOS */}
        {/*  */}





      </div>
    </div>
  );
}
