import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
    id: string;
    user: string;
    email: string;
    name: string;
    institution_id: string;
    institution_name: string;
    exp: number;
    iat: number;
    institutionCode: number;
    initialDate: string;
    lastConciliationDate: string;
    avatar: string;
    primaryColor: string;
    secondaryColor: string;
}

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
    const [day, month, year] = datePart.split("/").map((part) => part.padStart(2, "0"));
    return `${year}-${month}-${day}T${timePart || "00:00"}`;
}






//Decodifica el token JWT y verifica su validez
export class TokenUtils {
    static getUserData(token: string | null): DecodedToken | null {
        if (!token) return null;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                return null;
            }
            return decoded;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    }
}