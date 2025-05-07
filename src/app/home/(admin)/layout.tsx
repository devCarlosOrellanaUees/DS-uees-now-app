"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";


  //TODO: VALIDAR TOKEN DE SESION, SI NO EXISTE REDIRIGIR A LOGIN

  return (
      <div className="min-h-screen xl:flex">
        {/* SIDEBAR */}
        <AppSidebar />
        <Backdrop />

        {/* MAIN */}
        <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>
          {/* HEADER */}
          <AppHeader />

          {/* CONTENIDO */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
  );
}
