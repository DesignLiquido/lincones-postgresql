// import * as caminho from 'node:path';
import { Client } from 'pg'

export interface IConfiguracaoPostgreSQL {
    user: string
    host: string
    database: string
    password: string
    port: number
}

export class ClientePostgreSQL {
    instanciaBancoDeDados: Client;
    readonly caminhoRaiz: string;
    origemDados: string;

    constructor(origemDados: IConfiguracaoPostgreSQL = null) {
        this.caminhoRaiz = process.cwd();
        this.origemDados = null;

        if (origemDados) {
            this.instanciaBancoDeDados = new Client({
                user: origemDados.user,
                host: origemDados.host,
                database: origemDados.database,
                password: origemDados.password,
                port: origemDados.port,
            })
        } else {
            //Fins de testes @Samuel
            this.instanciaBancoDeDados = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'postgres',
                password: '123456',
                port: 5432
            })
        }
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
