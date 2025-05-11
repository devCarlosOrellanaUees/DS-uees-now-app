"use client";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import { useAuth } from "@/context/AuthContext";
import { ArrowDownIcon, ArrowUpIcon, UserCircleIcon } from "@/icons";

import { useEffect, useState } from "react";
import { FaArrowRightToCity, FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Spinner } from "../common/Spinner";
import Badge from "../ui/badge/Badge";


export const MetricsTransactions = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>();
  //
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {

      const response = await fetchAPI(endpoints.getAllIndicadores, 'GET')
      setData(response.data)
    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">


      <div className="flex-1 min-w-[250px] w-full h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
        {isLoading ? (
          <Spinner activate={true} sx="h-33" />
        ) : (
          <>
            <div className={'flex items-center justify-center w-12 h-12 rounded-xl bg-success-200'}>
              <FaArrowTrendUp size={28} className="text-success-900" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">Eventos publicados</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Uees Now Eventos
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {data?.eventos || 0}
                </h4>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CREDITOS */}
      <div className="flex-1 min-w-[250px] w-full h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
        {isLoading ? (
          <Spinner activate={true} sx="h-33" />
        ) : (
          <>
            <div className={'flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500'}>
              <UserCircleIcon size={28} className="text-warning-25" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">Personas</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Personas registradas en el sistema
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {data?.personas || 0}
                </h4>
              </div>
            </div>
          </>
        )}
      </div>

      {/* NETOS */}
      <div className="flex-1 min-w-[250px] w-full h-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
        {isLoading ? (
          <Spinner activate={true} sx="h-33" />
        ) : (
          <>
            <div className={'flex items-center justify-center w-12 h-12 rounded-xl bg-gray-200'}>
              <FaArrowRightToCity size={28} className="text-primary-800" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">Opiniones</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Opiniones regitradas
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {data?.opiniones || 0}
                </h4>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
