"use client";

import endpoints from "@/api/endpoints";
import fetchAPI from "@/api/fetchAPI";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spinner } from "../common/Spinner";
import Select from "../form/Select";
import Alert from "../ui/alert/Alert";


interface ResponseDataLogin {
  status: number,
  message: string
  data: any
}

export default function SignInForm() {

  const router = useRouter();
  //
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoadSesion, setIsLoadSesion] = useState(false);
  const [error, setError] = useState(false);

  //Alert
  const [visibleAlert, setVisibleAlert] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success")

  //credenciales
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  //Token
  const { setToken } = useAuth();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setVisibleAlert(true);
      setTitle("Atención");
      setMessage("Se requiere completar todos los campos");
      setVariant("info");
      setTimeout(() => setVisibleAlert(false), 3000);
      return;
    }

    setIsLoadSesion(true);

    try {
      const response: ResponseDataLogin = await fetchAPI(endpoints.login, 'POST', {
        user: email,
        password: password
      });

      // Guardar el token en sessionStorage
      /* sessionStorage.setItem("authToken", response.token);
      setToken(response.token); */
      if (response.status == 1) {

        router.replace('/home');
      } else {
        setVisibleAlert(true);
        setTitle("Error");
        setMessage(response.message);
        setVariant("warning");
        setTimeout(() => {
          setVisibleAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setVisibleAlert(true);
      setTitle("Error");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado");
      setVariant("error");
      setTimeout(() => {
        setVisibleAlert(false);
      }, 3000);
    } finally {
      setIsLoadSesion(false);
    }
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };


  return (
    <>
      <Alert
        title={title}
        message={message}
        variant={variant}
        isVisible={visibleAlert}
        sx="top-10 right-5 w-100"
      />

      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Bienvenido a UEES NOW
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Noticias, eventos y actividades, aquí encontraras todas las actividades universitarias en las que puedes participar.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmitLogin}>
                <div className="space-y-4" >
                  <div>
                    <Label>Email <span className="text-error-500">*</span>{" "}</Label>
                    <Input
                      type="text"
                      defaultValue={email}
                      error={error}
                      success={!error}
                      placeholder="usuario123"
                      onChange={handleEmailChange}
                      hint={error ? "Ingrese un correo electrónico correcto." : ""}
                    />
                  </div>
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        defaultValue={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Mantener sesión
                      </span>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      ¿Olvidó su contraseña?
                    </Link>
                  </div>
                  <div>
                    {
                      isLoadSesion ?
                        <Spinner
                          activate={isLoadSesion}
                          sx=""
                        />
                        :
                        <>
                          <Button className="w-full bg-uees" size="sm" >Ingresar</Button>
                        </>
                    }
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
