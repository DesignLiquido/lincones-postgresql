// import * as caminho from 'node:path';
import { Client } from 'pg'

export class ClientePostgreSQL {
    instanciaBancoDeDados: Client;
    readonly caminhoRaiz: string;
    origemDados: string;

    constructor() {
        this.caminhoRaiz = process.cwd();
        this.origemDados = null;

        this.instanciaBancoDeDados = new Client({
            user: process.env.USER,
            host: process.env.HOST,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            port: Number(process.env.PORT)
        })
    }

    public async abrir() {
        await this.instanciaBancoDeDados.connect()
        console.log('Conectado ao banco de dados PostgreSQL.');
    }

    public async executarComando(comando: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.instanciaBancoDeDados.query(comando, (erro, resultado) => {
                if (erro) {
                    return reject(erro.stack);
                };
                resolve(resultado.rows)
            })
        })
    }
}
