"use client";

import endpoints from '@/api/endpoints';
import fetchAPI from '@/api/fetchAPI';
import { useAuth } from '@/context/AuthContext';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa6';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';
import CardEvento from './CardEvento';

interface ConciliationData {
    institutionCode: number;
    cutOffDate: string;
    conciliationDate: string;
    transactionCount: number;
    transactionError: number;
    transactionOk: number;
    pending: number;
    reconciled: number;
    statusConciliation: number;
}

interface ListConciliationsProps {
    setLoading: Dispatch<SetStateAction<boolean>>;
    date: string;
    setVisibleAlert: Dispatch<SetStateAction<boolean>>;
    setTitle: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setVariant: Dispatch<SetStateAction<"success" | "error" | "warning" | "info">>
}


export default function ListEventos({
    setLoading,
    date,
    setVisibleAlert,
    setTitle,
    setMessage,
    setVariant
}: ListConciliationsProps) {

    const [conciliationSelected, setConciliationSelected] = useState<ConciliationData>();
    //
    const [data, setData] = useState<ConciliationData[]>([]);
    const [dataDetails, setDataDetails] = useState<any[]>([]);
    //
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [openResolutionConciliations, setOpenResolutionConciliations] = useState<boolean>(false);
    const [openResultConciliations, setOpenResultConciliations] = useState<boolean>(false);
    //
    const [isConciliationOk, setIsConciliationOk] = useState<boolean>(false);
    const [transactionCount, setTransactionCount] = useState<number>(0);
    const [pending, setPending] = useState<number>(0);
    const [transactionOk, setTransactionOk] = useState<number>(0);
    const [transactionError, setTransactionError] = useState<number>(0);
    //
    const { userData } = useAuth();

    const fetchDataConciliations = async () => {
        try {
            setLoading(true)

            const requestBody = {
                institutionCode: userData?.institutionCode,
                initialDate: date,//yyyy-mm-dd
                status: 0 // Visualiza conciliaciones pendientes (0) y conciliaciones por resolver (1)
            }
            const response = await fetchAPI(endpoints.getConciliationsByStatus, 'POST', requestBody);
            const responseData: ConciliationData[] = response;

            if (Array.isArray(responseData) && responseData.length === 0) {
                setData([])
                setVisibleAlert(true)
                setTitle("Correcto")
                setMessage("No hay conciliaciones pendientes")
                setVariant("info")
                return
            }
            setData(responseData)
            //
            setVisibleAlert(true)
            setTitle("Correcto")
            setMessage("Se han obtenido las conciliaciones pendientes")
            setVariant("success")
        } catch (error) {
            console.log("ERROR", error)
            setVisibleAlert(true)
            setTitle("Error")
            setMessage("Error al obtener conciliaciones")
            setVariant("error")
            setOpenConfirmation(false);
        } finally {
            setTimeout(() => setVisibleAlert(false), 3000);
            setLoading(false)
        }
    }

    const fetchDataDetailsConciliation = async () => {
        try {
            setLoading(true)
            const requestBody = {
                institutionCode: userData?.institutionCode,
                cutOffDate: conciliationSelected?.cutOffDate, // yyyy-mm-dd
                stateFilter: 0 // Visualiza conciliaciones pendientes (0) y conciliaciones por resolver (1)
            }

            const response = await fetchAPI(endpoints.getDetailConciliationByCutOffDate, 'POST', requestBody);
            const responseData: any = response;
            setDataDetails(responseData)
        } catch (error) {
            console.log("ERROR", error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (date) {
            fetchDataConciliations();
        }
    }, [date])

    useEffect(() => {
        //Ejecuta solo cuando abre el modal de resolución de conciliaciones
        if (openResolutionConciliations) {
            fetchDataDetailsConciliation();
        }
    }, [openResolutionConciliations])

    return (
        <div>
            {/*  {data.map((x, index) => (
                <CardConciliation
                    key={index}
                    //
                    setOpenConfirmation={setOpenConfirmation}
                    dataConciliation={x}
                    setConciliationSelected={setConciliationSelected}
                    setOpenResolutionConciliations={setOpenResolutionConciliations}
                    //
                    title={x.statusConciliation === 0 ? "Pendiente de conciliar" : "Resolviendo pendientes de conciliación"}
                    variant={x.statusConciliation === 0 ? "info" : "warning"}
                    cutOffDate={x.cutOffDate}
                    conciliationDate={x.conciliationDate}
                    transactionCount={x.transactionCount}
                    transactionError={x.transactionError}
                    transactionOk={x.transactionOk}
                    pending={x.pending}
                    reconciled={x.reconciled}
                    statusConciliation={x.statusConciliation}
                />
            ))} */}

            <CardEvento
                variant="success"
                title=""
                setOpenConfirmation={() => true}
            />

            {/*   {data.length === 0 && (
                <div className="flex justify-center items-center h-90">
                    <h1 className="text-gray-500">No hay eventos</h1>
                </div>
            )} */}


            {/*  */}
            {/* MODAL CONFIRMATION CONCILIATION */}
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
                        Los cambios que realice no se pueden deshacer. ¿Está seguro de que desea continuar?
                    </p>
                    <p className="text-sm leading-6 text-gray-900 dark:text-gray-400">
                        Fecha de corte: {conciliationSelected?.cutOffDate}
                    </p>

                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={() => setOpenConfirmation(false)}>
                            Cerrar
                        </Button>
                        <Button size="sm" onClick={() => alert("Ejecutar confirmación")}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </Modal>
            {/*  */}
            {/* END MODAL CONFIRMATION CONCILIATION */}
            {/*  */}


            {/*  */}
            {/* MODAL RESULT OF CONCILIATION */}
            {/*  */}
            <Modal
                isOpen={openResultConciliations}
                onClose={() => {
                    setOpenResultConciliations(false)
                }}
                className="max-w-[600px] p-5 lg:p-10"
            >
                <div className="text-center">
                    <div className="relative flex items-center justify-center z-1 mb-7">
                        {isConciliationOk ? <>
                            <svg
                                className="fill-success-50 dark:fill-success-500/15"
                                width="90"
                                height="90"
                                viewBox="0 0 90 90"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                                    fill=""
                                    fillOpacity=""
                                />
                            </svg>

                            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                                <svg
                                    className="fill-success-600 dark:fill-success-500"
                                    width="38"
                                    height="38"
                                    viewBox="0 0 38 38"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                                        fill=""
                                    />
                                </svg>
                            </span>
                        </> :
                            <>
                                <svg
                                    className="fill-error-50 dark:fill-error-500/15"
                                    width="90"
                                    height="90"
                                    viewBox="0 0 90 90"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                                        fill=""
                                        fillOpacity=""
                                    />
                                </svg>

                                <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                                    <svg
                                        className="fill-error-600 dark:fill-error-500"
                                        width="38"
                                        height="38"
                                        viewBox="0 0 38 38"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                                            fill=""
                                        />
                                    </svg>
                                </span>
                            </>
                        }

                    </div>
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        {isConciliationOk
                            ? '¡Conciliación ejecutada con éxito!'
                            : '¡Conciliación ejecutada con errores!'
                        }
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {isConciliationOk
                            ? `No se encontraron errores en las transacciones, puede revisar el detalle de las transacciones
                            en el historial de conciliaciones con la fecha de corte: ${conciliationSelected?.cutOffDate}.`
                            : `Se encontraron transacciones con error al ejecutar la conciliación, 
                            puede revisar el detalle de las transacciones con la fecha de corte: ${conciliationSelected?.cutOffDate}.`
                        }
                    </p>
                    <div className="lg:grid lg:grid-cols-2 gap-4 w-full mb-5 flex items-center justify-center p-4">
                        <div>
                            <div className="flex mb-3 mt-2">
                                <FaBars className="text-blue-light-500" />
                                <p className="ml-2 text-sm text-gray-600 dark:text-white/70">
                                    Total de transacciones: <span className="font-bold">{transactionCount}</span>
                                </p>
                            </div>
                            <div className="flex">
                                <FaInfoCircle className="text-warning-500" />
                                <p className="ml-2 text-sm text-gray-600 dark:text-white/70">
                                    Pendientes de corregir: <span className="font-bold">{pending}</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex mb-3 mt-2">
                                <FaCheckCircle className="text-success-500" />

                                <p className="ml-2 text-sm text-gray-600 dark:text-white/70">
                                    Transacciones correctas: <span className="font-bold">{transactionOk}</span>
                                </p>
                            </div>
                            <div className="flex">
                                <FaTimesCircle className="text-error-500" />
                                <p className="ml-2 text-sm text-gray-600 dark:text-white/70">
                                    Transacciones con error: <span className="font-bold">{transactionError}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full gap-3 mt-7">
                        <button
                            onClick={() => setOpenResultConciliations(false)}
                            type="button"
                            className={`flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg
                                ${isConciliationOk ? `bg-success-500 shadow-theme-xs hover:bg-success-600` : `bg-error-500 shadow-theme-xs hover:bg-error-600`}
                                 sm:w-auto`}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </Modal>
            {/*  */}
            {/* END MODAL RESULT OF CONCILIATION */}
            {/*  */}
        </div>
    )
}
