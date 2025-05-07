import endpoints from "./endpoints"

export default async function fetchAPI(url, method = 'GET', bodyParam) {
  let err, data
  const arrayErrores = mensajes()
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    // CONFIGURAR OBTENCION DE TOKEN DE SESION
    if (url.includes('/private/')) {
      const sessionParams = sessionStorage.getItem('authToken');
      if (sessionParams) {
        headers.Authorization = `Bearer ${sessionParams}`;
      } else {
        //TODO: REDIRECCIONAR A LOGIN
        console.log("Token no encontrado para endpoint privado.");
      }
    }
    //

    const body = bodyParam ? JSON.stringify(bodyParam) : null

    const res = await fetch(url, {
      method,
      headers,
      body
    })

    data = await res.json()

    if (res.status < 200 || res.status >= 300) {
      if (
        res.status === 403 &&
        sessionParams.token &&
        !url.includes(endpoints.JWTRefresh)
      ) {

        const tokenData = await fetchAPI(
          endpoints.JWTRefresh,
          'POST',
          null,
          sessionParams.tokenRefresh,
          null
        )
        const newData = await fetchAPI(
          url,
          method,
          bodyParam,
          tokenData.token,
          tokenData.tokenRefresh
        )
        newData.newToken = tokenData.token
        newData.newTokenRefresh = tokenData.tokenRefresh

        return newData
      }

      err = new Error(
        data.message === null
          ? `Unexpected Error (${url})`
          : data.message.replace(/<br>/g, '. ').replace(/<br\/>/g, '. ')
      )

      err.res = res
      err.status = res.status
      let estado
      if (url.includes(endpoints.JWTRefresh) && res.status === 403) {
        estado = -100
      } else {
        estado = data.status === null ? res.status : data.status
      }
      err.code = estado
    }

  } catch (error) {
    if (error.code === -100) {
      err = new Error('Su sesión ha expirado')
      err.code = 'expired_session'
      err.res = null
      err.status = null
    } else {

      let mensajeError = ''
      if (error.message) {

        arrayErrores.forEach(element => {
          if (error.message.includes(element.message) || error.message === element.message) {
            mensajeError = element.mensaje
          }
        })

      } else {
        mensajeError = arrayErrores[0].mensaje
      }
      err = new Error(mensajeError === '' ? error.message : mensajeError)
      err.code = 'network_error'
      err.res = null
      err.status = null
    }
  }
  if (!err) {
    return data
  }
  throw err
}

//* ****** MENSAJES DE ERROR
const mensajes = () => {
  const arrayErrores = [
    {
      message: 'Network request failed',
      mensaje: 'Error de la red, por favor verifique la conexión'
    },
    {
      message: 'Unexpected token',
      mensaje: 'Se produjo un error al realizar la operación'
    },
    {
      message: 'Unrecognized token',
      mensaje:
        'Se produjo un error al realizar la operación, verifique la conexión'
    },
    {
      message: 'JSON parse error',
      mensaje:
        'Se produjo un error al realizar la operación, verifique la conexión'
    },
    {
      message: 'Unexpected end of JSON input',
      mensaje: 'Error de la red, por favor verifique la conexión'
    },
    {
      message: 'Failed to fetch',
      mensaje: 'Error de la red, por favor verifique la conexión'
    }
  ]
  return arrayErrores
}