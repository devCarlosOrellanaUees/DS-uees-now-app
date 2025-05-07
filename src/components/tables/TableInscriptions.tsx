"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { FaFileDownload, FaSearch } from "react-icons/fa";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import { Spinner } from "../common/Spinner";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Pagination from "./Pagination";

import { useAuth } from "@/context/AuthContext";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import ExcelJS from 'exceljs';
import Badge from "../ui/badge/Badge";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";


interface Transaction {
  uuid: string,
  cutOffNumber: string,
  cutOffDate: string,
  transactionDate: string,
  accountTypeId: string,
  accountNumber: string,
  transactionValue: string,
  movementCode: string,
  transactionType: string,
  institutionCode: number,
  serviceCod: number,
  transactionStatus: number,
  reverseMovementCode: string
}

interface ResponseData {
  data: {
    transaction: Transaction[],
    total: number,
    totalPages: number,
    currentPage: number,
    currentCount: number
  }
}

interface BasicTableOneProps {
  setVisibleAlert: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setVariant: Dispatch<SetStateAction<"success" | "error" | "warning" | "info">>
}

export default function TableInscriptions({
  setVisibleAlert,
  setTitle,
  setMessage,
  setVariant,
}: BasicTableOneProps) {

  const [isOpenDownload, setIsOpenDownload] = useState(false);
  //pagination
  const [totalRegistros, setTotalRgistros] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [ofset, setOfset] = useState(1);

  //data api
  const [data, setData] = useState<Transaction[]>([]);
  //
  const [isLoading, setIsLoading] = useState(false);
  //
  const { userData } = useAuth();

  const handlePageChangePage = (page: number) => {
    setOfset(page);
  };

  const handlePageChangeNext = (page: number) => {
    setOfset(page + 1);
  };

  function toggleDropdown() {
    setIsOpenDownload(!isOpenDownload);
  }

  function closeDropdown() {
    setIsOpenDownload(false);
  }

  const handlePageChangePrevious = (page: number) => {
    setOfset(page - 1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setVisibleAlert(true)
    try {


      const response = await fetchAPI(endpoints.getTransaccionesInst, 'POST', {})

      const responseData: ResponseData = response;
      if (responseData.data.transaction.length == 0) {
        setTitle("Sin registros")
        setMessage("No se encotraron registros en el rango de fechas seleccionado")
        setVariant("info")
        setData([])
        return
      }

      setData(responseData.data.transaction)
      setTotalRgistros(responseData.data.total)
      setTotalPages(responseData.data.totalPages)
      setCurrentCount(responseData.data.currentCount)

      setTitle("Transacciones")
      setMessage("Registros encontrandos correctamente")
      setVariant("success")

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

      const response = await fetchAPI(endpoints.getTransaccionesInst, 'POST', {})

      const responseData: ResponseData = response;

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('DataSheet')

      // Agregar encabezados de columna
      worksheet.addRow([
        'UUID',
        'cutOffNumber',
        'cutOffDate',
        'transactionDate',
        'accountTypeId',
        'accountNumber',
        'transactionValue',
        'movementCode',
        'transactionType',
        'institutionCode',
        'serviceCod',
        'transactionStatus',
        'reverseMovementCode'
      ])

      // Agregar info adicional
      responseData.data.transaction.forEach(row => {
        worksheet.addRow([
          row.uuid,
          row.cutOffNumber,
          row.cutOffDate,
          row.transactionDate,
          row.accountTypeId,
          row.accountNumber,
          row.transactionValue,
          row.movementCode,
          row.transactionType === "C" ? "CREDITO" : row.transactionType === "D" ? "DEBITO" : row.transactionType,
          row.institutionCode,
          row.serviceCod,
          row.transactionStatus,
          row.reverseMovementCode
        ])
      })

      const buffer = await workbook.xlsx.writeBuffer()

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'TransaccionesRedChas.xlsx'
      a.click()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setIsLoading(false);
    }
  }

  const handleExportListCorresToCSV = async () => {
    setIsLoading(true);

    try {
      const requestBody = {
        institutioncode: userData?.institutionCode,
        startDate: '',
        finishDate: '',
        limit: totalRegistros,
        offset: 1
      }
      const response = await fetchAPI(endpoints.getTransaccionesInst, 'POST', requestBody)

      const responseData: ResponseData = response;

      // Encabezados
      const headers = [
        'UUID',
        'cutOffNumber',
        'cutOffDate',
        'transactionDate',
        'accountTypeId',
        'accountNumber',
        'transactionValue',
        'movementCode',
        'transactionType',
        'institutionCode',
        'serviceCod',
        'transactionStatus',
        'reverseMovementCode'
      ]

      const csvRows = []
      csvRows.push(headers.join(','))

      responseData.data.transaction.forEach(row => {
        const values = [
          row.uuid,
          row.cutOffNumber,
          row.cutOffDate,
          row.transactionDate,
          row.accountTypeId,
          row.accountNumber,
          row.transactionValue,
          row.movementCode,
          row.transactionType === "C" ? "CREDITO" : row.transactionType === "D" ? "DEBITO" : row.transactionType,
          row.institutionCode,
          row.serviceCod,
          row.transactionStatus,
          row.reverseMovementCode
        ]

        // Escapar comillas y comas si es necesario
        const escaped = values.map(val =>
          typeof val === 'string'
            ? `"${val.replace(/"/g, '""')}"`
            : val !== null && val !== undefined
              ? val
              : ''
        )

        csvRows.push(escaped.join(','))
      })

      const csvContent = csvRows.join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'TransaccionesRedChas.csv'
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (data.length != 0)
      fetchData();
  }, [ofset]);

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
                    <Button onClick={toggleDropdown} className="dropdown-toggle"
                      variant="outline">
                      <FaFileDownload />
                      <span>Descargar</span>
                    </Button>
                    <Dropdown
                      isOpen={isOpenDownload}
                      onClose={closeDropdown}
                      className="absolute right-full mr-2 top-0 w-40 z-50"
                    >
                      <DropdownItem onItemClick={handleExportListCorresToExcel}>
                        Excel
                      </DropdownItem>
                      <DropdownItem onItemClick={handleExportListCorresToCSV}>
                        CSV
                      </DropdownItem>
                    </Dropdown>
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
                    className="max-w-[120px] px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Código de corte
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fecha de corte
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fecha de transacción
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Institución
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Número de cuenta
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Monto
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tipo de transacción
                  </TableCell>

                </TableRow>
              </TableHeader>

              {/* Table Body */}

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    123
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    206/04/20225 16:25:30
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    206/04/20225 16:25:30
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Evento
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    123456
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    $15
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      endIcon={<ArrowUpIcon />}
                      color={"success"}
                    >
                      ACTIVO
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    123
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    206/04/20225 16:25:30
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    206/04/20225 16:25:30
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Evento
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    123456
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    $15
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      endIcon={<ArrowDownIcon />}
                      color={"error"}
                    >
                      ACTIVO
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>




              {/* {data.length > 0 ? (
                <>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {data.map((x, i) => (
                      <TableRow key={i}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.cutOffNumber}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDateSmall(x.cutOffDate)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDateSmall(x.transactionDate)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.institutionCode == 4 ? "COAC Jardín Azuayo" : ""}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {x.accountNumber}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          $ {x.transactionValue}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            endIcon={x.transactionType === "C" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            color={
                              x.transactionType === "C"
                                ? "success"
                                : x.transactionType === "D"
                                  ? "error"
                                  : "error"
                            }
                          >
                            {x.transactionType === "C" ? "CRÉDITO" : "DÉBITO"}
                          </Badge>
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
              } */}
            </Table>

            {data.length > 0 ?
              <Pagination
                limit={currentCount}
                totalRegistros={totalRegistros}
                currentPage={ofset}
                totalPages={totalPages}
                onPageChangePage={(e) => handlePageChangePage(e)}
                onPageChangePrevious={() => handlePageChangePrevious(ofset)}
                onPageChangeNext={() => handlePageChangeNext(ofset)}
              />
              :
              null
            }
          </div>
        </div>
      </div>
    </>
  );
}