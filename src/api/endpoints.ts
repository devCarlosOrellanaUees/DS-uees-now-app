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
    
    //PAGE EVENTOS
    saveEvento: `${URL_CONTEXT_APP}/api/evento/save`,
    getAllEventos: `${URL_CONTEXT_APP}/api/evento/all`,






    //PAGE TRANSACTIONS
    getTransaccionesInst: `${URL_CONTEXT_APP}/private/transaction/listTransactions`,

    //PAGE CONCILIACIONES
    getConciliationsByStatus: `${URL_CONTEXT_APP}/private/conciliation/listConciliationsByStatus`,
    getDetailConciliationByCutOffDate: `${URL_CONTEXT_APP}/private/conciliation/getDetailConciliationByCutOffDate`,
    //


};

export default endpoints;