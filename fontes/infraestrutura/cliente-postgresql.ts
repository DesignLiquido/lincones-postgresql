import { Client, QueryResult } from 'pg'

export class ClientePostgreSQL {
    instanciaBancoDeDados: Client;
    
    constructor() {
        this.instanciaBancoDeDados = new Client({
            host: process.env.ENDERECO,
            port: Number(process.env.PORTA || 5432),
            database: process.env.NOME_BASE_DADOS,
            user: process.env.USUARIO,
            password: process.env.SENHA
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
