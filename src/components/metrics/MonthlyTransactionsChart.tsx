"use client";
import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import { useAuth } from "@/context/AuthContext";
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Spinner } from "../common/Spinner";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTransactionsChart() {

  const { user } = useAuth();

  const options: ApexOptions = {
    colors: ['#465fff'],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenYear, setIsOpenYear] = useState(false);
  //
  const [data, setData] = useState([]);
  //

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAPI(endpoints.getAllEventosMes, 'GET')
      setData(response)
    } catch (error) {
      console.log("ERROR:", error)
    } finally {
      setIsLoading(false);
    }
  }

  const series = [
    {
      name: "Transacciones",
      data
    },
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);


  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Eventos mensuales
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            {
              isLoading ?
                <Spinner
                  activate={true}
                  sx="h-50"
                />
                :
                <ReactApexChart
                  options={options}
                  series={series}
                  type="bar"
                  height={180}
                />
            }
          </div>
        </div>
      </div>
    </>
  );
}
