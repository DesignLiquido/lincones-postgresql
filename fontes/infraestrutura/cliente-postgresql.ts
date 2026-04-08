import { Client, QueryResult } from 'pg';
import { ConfiguracaoConexaoPostgreSQL } from '../interfaces';

export class ClientePostgreSQL {
    instanciaBancoDeDados: Client;
    origemDados: {
        host: string;
        port: number;
        database: string;
        user?: string;
        password?: string;
    };
    
    constructor(configuracao?: ConfiguracaoConexaoPostgreSQL) {
        let enderecoHost = configuracao?.host ?? process.env.ENDERECO ?? 'localhost';
        let nomeBanco = configuracao?.banco ?? process.env.NOME_BASE_DADOS ?? '';
        let porta = configuracao?.porta ?? Number(process.env.PORTA || 5432);

        if (!configuracao?.host && configuracao?.caminho) {
            const [parteHost, parteBanco] = configuracao.caminho.split('/');
            const [hostSemPorta, partePorta] = parteHost.split(':');

            enderecoHost = hostSemPorta || enderecoHost;
            nomeBanco = parteBanco ?? nomeBanco;

            if (partePorta) {
                const portaConvertida = Number(partePorta);
                if (!isNaN(portaConvertida)) {
                    porta = portaConvertida;
                }
            }
        }

        this.origemDados = {
            host: enderecoHost,
            port: porta,
            database: nomeBanco,
            user: configuracao?.usuario ?? process.env.USUARIO,
            password: configuracao?.senha ?? process.env.SENHA
        };

        this.instanciaBancoDeDados = new Client(this.origemDados);
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
