"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import "flatpickr/dist/themes/light.css";
import { useState } from "react";

import TableInscriptions from "@/components/tables/TableInscriptions";
import Alert from "@/components/ui/alert/Alert";

export default function TransactionsRed() {


  //alert
  const [visibleAlert, setVisibleAlert] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")

  return (
    <div>
      <Alert
        title={title}
        message={message}
        variant={variant}
        isVisible={visibleAlert}
        sx="top-22 right-5 w-100"
      />

      <PageBreadcrumb pageTitle="Inscripciones registradas" />
      <div className="space-y-6">
        <ComponentCard title="" desc="Filtra a las personas inscritas al evento">

          <TableInscriptions
            setVisibleAlert={setVisibleAlert}
            setTitle={setTitle}
            setMessage={setMessage}
            setVariant={setVariant}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
