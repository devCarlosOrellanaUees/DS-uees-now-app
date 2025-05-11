"use client";

import { MetricsTransactions } from "@/components/metrics/MetricsTransactions";
import MonthlyTransactionsChart from "@/components/metrics/MonthlyTransactionsChart";


export default function Dashboard() {


  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12 space-y-6 xl:col-span-12">
        <MetricsTransactions />
      </div>

      {/*     <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
      */}

      <div className="col-span-12 xl:col-span-12">
        <MonthlyTransactionsChart />
      </div>
    </div>
  );
}
