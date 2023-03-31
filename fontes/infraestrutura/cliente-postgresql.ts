import { Client, QueryResult } from 'pg'

export class ClientePostgreSQL {
    instanciaBancoDeDados: Client;
    
    constructor() {
        this.instanciaBancoDeDados = new Client({
            user: process.env.POSTGRES_USUARIO,
            host: process.env.POSTGRES_ENDERECO,
            database: process.env.POSTGRES_BASE_DADOS,
            password: process.env.POSTGRES_SENHA,
            port: Number(process.env.POSTGRES_PORTA)
        })
    }

    public async abrir(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.instanciaBancoDeDados.connect((erro) => {
                if (erro) {
                    return reject(erro.stack);
                };
                resolve('Conectado ao banco de dados PostgreSQL.')
            })
        })
    }
  
    public async executarComando(comando: string): Promise<QueryResult> {
        return new Promise((resolve, reject) => {
            this.instanciaBancoDeDados.query(comando, (erro, resultado) => {
                if (erro) {
                    return reject(erro.stack);
                };
                resolve(resultado)
            })
        })
    }
}
