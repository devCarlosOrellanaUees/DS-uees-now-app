// Formatea una fecha en formato 2025-03-03T02:01:31.658Z
// Retornar la fecha en formato dd-mm-yyyy hh:mm:ss
export const formatDateSmall = (dateString: string) => {
    const date = new Date(dateString);

    // Extraer día, mes y año
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Extraer hora, minutos y segundos
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// Función para convertir fecha tipo "27/1/2025 16:14" a formato "2025-01-27T16:14:00"
export const formatDateTime = (dateStr: string): string => {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-").map((part) => part.padStart(2, "0"));
    return `${year}-${month}-${day}T${timePart || "00:00"}`;
}

function padZero(n: any) {
    return n.toString().padStart(2, '0');
}

export const convertirAFormatoISO = (fecha: Date): string => {
    const year = fecha.getFullYear();
    const month = padZero(fecha.getMonth() + 1); // ¡Asegúrate de sumar +1 aquí!
    const day = padZero(fecha.getDate());

    const hours = padZero(fecha.getHours());
    const minutes = padZero(fecha.getMinutes());
    const seconds = padZero(fecha.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

