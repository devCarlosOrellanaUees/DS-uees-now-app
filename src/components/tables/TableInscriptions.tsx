"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "../ui/table";

import { FaFileDownload, FaSearch } from "react-icons/fa";

import { Spinner } from "../common/Spinner";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { formatDateSmall } from "@/utils/common";
import ExcelJS from 'exceljs';
import Badge from "../ui/badge/Badge";


interface Eventos {
  codigoEvento: number,
  nombre: string,
  fechaInicio: string,
  fechaFin: string,
  aforo: number,
  inscritos: number,
  estado: number,
  categoria: string,
}

interface BasicTableOneProps {
  setVisibleAlert: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setVariant: Dispatch<SetStateAction<"success" | "error" | "warning" | "info">>
  setOpenModalDetalles: Dispatch<SetStateAction<boolean>>;
  setCodigoEvento: Dispatch<SetStateAction<number>>;
}

export default function TableInscriptions({
  setVisibleAlert,
  setTitle,
  setMessage,
  setVariant,
  setOpenModalDetalles,
  setCodigoEvento
}: BasicTableOneProps) {

  //data api
  const [data, setData] = useState<Eventos[]>([]);
  //
  const [isLoading, setIsLoading] = useState(false);
  //

  const fetchData = async () => {
    setIsLoading(true);
    try {

      const response = await fetchAPI(endpoints.getAllEventosConInscritos, "GET");

      //console.log(JSON.stringify(response, null, 2))
      if (response.status == 1) {
        setData(response.data)
      } else {
        setVisibleAlert(true)
        setTitle("Sin inscripciones");
        setMessage("No se encontraron eventons con inscritos");
        setVariant("info");
      }
    } catch (error) {
      console.log("ERROR:", error)
      setTitle("Error");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado");
      setVariant("error");

    } finally {
      setIsLoading(false);
      setTimeout(() => setVisibleAlert(false), 3000);
    }
  }

  const handleExportListCorresToExcel = async () => {

    setIsLoading(true);

    try {

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('DataSheet')

      // Agregar encabezados de columna
      worksheet.addRow([
        'codigo',
        'nombre',
        'fechaInicio',
        'fechaFin',
        'aforo',
        'inscritos',
        'categoria',
        'estado'
      ])

      // Agregar info adicional
      data.forEach(row => {
        worksheet.addRow([
          row.codigoEvento,
          row.nombre,
          row.fechaInicio,
          row.fechaFin,
          row.aforo,
          row.inscritos,
          row.categoria,
          row.estado == 1 ? 'ACTIVO' : 'SUSPENDIDO'
        ])
      })

      const buffer = await workbook.xlsx.writeBuffer()

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'eventos.xlsx'
      a.click()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Spinner
        activate={isLoading}
        sx="w-full h-full fixed top-0 left-0 blue-bg-chas-op " />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {/*  */}
            {/*  */}
            <div className="flex items-center justify-between p-3 dark:border-white/[0.05]">
              <div className="w-70 relative">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  onChange={(e) => console.log(e.target.value)}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <FaSearch onClickCapture={() => console.log("Buscando...")} />
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                {/* Filtros u otros botones a la izquierda */}
                <div className="flex items-center gap-4">
                  {/* Acá tus filtros */}
                </div>

                {/* Botón de exportar a la derecha */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleExportListCorresToExcel()} className="dropdown-toggle"
                      variant="outline">
                      <FaFileDownload />
                      <span>Descargar</span>
                    </Button>
                  </div>
                </div>

              </div>

            </div>
            {/*  */}
            {/*  */}
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Código de evento
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fecha inicio
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fecha Fin
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Aforo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Inscritos
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Categoría
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Estado
                  </TableCell>
                </TableRow>
              </TableHeader>

              {data.length > 0 ? (
                <>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {data.map((x, i) => (
                      <TableRow key={i}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.codigoEvento}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.nombre}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDateSmall(x.fechaInicio)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDateSmall(x.fechaFin)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.aforo}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.inscritos}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.categoria}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            endIcon={x.estado === 1 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            color={
                              x.estado === 1
                                ? "success"
                                : "error"
                            }
                          >
                            {x.estado === 1 ? "Activo" : "Suspendido"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 dark:text-gray-400">
                          <Button
                            className="bg-success-500 hover:bg-success-800"
                            size="sm"
                            onClick={() => {
                              setOpenModalDetalles(true)
                              setCodigoEvento(x.codigoEvento)
                            }}
                          >
                            Ver inscritos
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) :
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  <TableRow>
                    <TableCell className="px-4 py-3 text-gray-400 text-start text-theme-sm dark:text-gray-400">
                      No hay registros para mostrar
                    </TableCell>
                  </TableRow>
                </TableBody>
              }
            </Table>

          </div>
        </div>
      </div>
    </>
  );
}