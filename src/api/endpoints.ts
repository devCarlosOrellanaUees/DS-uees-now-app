// Configuración de ambiente
const isLocal = true;
const isProd = false;

const URL = isLocal ? process.env.NEXT_PUBLIC_URL_BACKEND_LOCAL :
    isProd ? process.env.NEXT_PUBLIC_URL_BACKEND_PROD :
        process.env.NEXT_PUBLIC_URL_BACKEND_DEV;

const URL_CONTEXT_APP = `${URL}${process.env.NEXT_PUBLIC_CONTEXT_APP}`;

const endpoints = {
    JWTRefresh: `${URL_CONTEXT_APP}/token/refresh`,

    //PAGE LOIGN
    login: `${URL_CONTEXT_APP}/api/usuario/login`,


    //PAGE EVENTOS ROL ADMIN
    saveEvento: `${URL_CONTEXT_APP}/api/evento/save`,
    getAllEventos: `${URL_CONTEXT_APP}/api/evento/all`,
    getAllEventosMes: `${URL_CONTEXT_APP}/api/evento/mes`,
    getAllIndicadores: `${URL_CONTEXT_APP}/api/evento/indicadores`,


    //PAGE INSCRIPCIONES ROL ADMIN
    getAllEventosConInscritos: `${URL_CONTEXT_APP}/api/evento/inscritos/all`,
    getAllPersonasInscritasByEvento: `${URL_CONTEXT_APP}/api/inscripcion/usuarios/inscritos`,




    //PAGE EVENTOS ROL ESTUDIANTE
    getAllEventosDisponibles: `${URL_CONTEXT_APP}/api/evento/disponibles/usuario`,
    getAllEventosInscritos: `${URL_CONTEXT_APP}/api/evento/inscritos/usuario`,
    saveInscripcion: `${URL_CONTEXT_APP}/api/inscripcion/save`,
    saveComentario: `${URL_CONTEXT_APP}/api/comentario/save`,
    getAllComentarios: `${URL_CONTEXT_APP}/api/comentario/all`,






    //PAGE TRANSACTIONS
    getTransaccionesInst: `${URL_CONTEXT_APP}/private/transaction/listTransactions`,

    //PAGE CONCILIACIONES
    getConciliationsByStatus: `${URL_CONTEXT_APP}/private/conciliation/listConciliationsByStatus`,
    getDetailConciliationByCutOffDate: `${URL_CONTEXT_APP}/private/conciliation/getDetailConciliationByCutOffDate`,
    //


};

export default endpoints;