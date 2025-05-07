"use client";

import { FaBuildingCircleCheck } from "react-icons/fa6";

export default function Dashboard() {


  return (
    <div className="grid grid-cols-12 gap-12 md:gap-12">

      <div className="w-full col-span-12">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-3 md:gap-4">

          {/* CARD EVENTOS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer"
            onClick={() => alert("redirigir a pantalla")}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {/* <GroupIcon className="text-gray-800 size-6 dark:text-white/90" /> */}
              <FaBuildingCircleCheck size={28} className="text-gray-800 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">
                  PUBLICAR EVENTOS
                </h4>
                <span className="text-sm  text-gray-500 dark:text-gray-400 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. A nesciunt inventore ipsa consequatur et impedit, quas esse in autem? Harum fugiat illum ullam blanditiis iure earum vero magnam laudantium odit.
                </span>

              </div>
            </div>
          </div>
          {/*  */}
          {/* CARD EVENTOS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer"
            onClick={() => alert("redirigir a pantalla")}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {/* <GroupIcon className="text-gray-800 size-6 dark:text-white/90" /> */}
              <FaBuildingCircleCheck size={28} className="text-gray-800 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">
                  PUBLICAR EVENTOS
                </h4>
                <span className="text-sm  text-gray-500 dark:text-gray-400 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. A nesciunt inventore ipsa consequatur et impedit, quas esse in autem? Harum fugiat illum ullam blanditiis iure earum vero magnam laudantium odit.
                </span>

              </div>
            </div>
          </div>
          {/*  */}
          {/* CARD EVENTOS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer"
            onClick={() => alert("redirigir a pantalla")}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {/* <GroupIcon className="text-gray-800 size-6 dark:text-white/90" /> */}
              <FaBuildingCircleCheck size={28} className="text-gray-800 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <h4 className="text-sm text-gray-700 font-semibold dark:text-gray-400">
                  PUBLICAR EVENTOS
                </h4>
                <span className="text-sm  text-gray-500 dark:text-gray-400 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. A nesciunt inventore ipsa consequatur et impedit, quas esse in autem? Harum fugiat illum ullam blanditiis iure earum vero magnam laudantium odit.
                </span>

              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
}
