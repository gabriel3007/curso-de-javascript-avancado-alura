var ConnectionFactory = (function () {
const stores = ['negociacoes'];
const  version = 4;
const  dbName = 'aluraframe';
let con = null;
let close = null;

return class ConnectionFactory {

    constructor() {

        throw new Error('Não é possível criar instâncias de ConnectionFactory');
    }

    static getConnection(){

        return new Promise((resolve, reject) => {

            let openRequest = window.indexedDB.open(dbName,version);

            openRequest.onupgradeneeded = e => {
                if(!con){
                    con = e.target.result;
                    close = con.close.bind(con);
                    con.close = function(){
                        throw new Error('Você não pode fechar diretamente a conexão');
                    }
                }
                resolve(con); 
            };

            openRequest.onsuccess = e => {    
                resolve(e.target.result);
            };

            openRequest.onerror = e => {    
                console.log(e.target.error);
                reject(e.target.error.name);
            };
        });
    }

    static closeConnection(){
        if(con){
            close();
            con = null;
        }
    }

    static _createStores(con){
        stores.forEach(store => {
            if(con.objectStoreNames.contains(store)) 
                con.deleteObjectStore(store);
            con.createObjectStore(store, { autoIncrement: true });
        });
    }
}}) ();