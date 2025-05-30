import * as dotenv from 'dotenv';

import { Tradutor } from "./tradutor";
import { AvaliadorSintatico } from "./comum/fontes/avaliador-sintatico";
import { Lexador } from "./comum/fontes/lexador";
import { ClientePostgreSQL } from "./infraestrutura/cliente-postgresql";
import { RetornoComando } from "./infraestrutura";

dotenv.config()

export class LinconesPostgreSQL {
    lexador: Lexador;
    avaliadorSintatico: AvaliadorSintatico;
    tradutor: Tradutor;
    clientePostgreSQL: ClientePostgreSQL;

    constructor() {
        this.lexador = new Lexador();
        this.avaliadorSintatico = new AvaliadorSintatico();
        this.tradutor = new Tradutor();
        this.clientePostgreSQL = new ClientePostgreSQL();
    }

    async executar(_: any, comando: string): Promise<RetornoComando> {
        if(!comando) return new RetornoComando(null)

        const resultadoLexador = this.lexador.mapear([comando]);
        const resultadoAvaliacaoSintatica = this.avaliadorSintatico.analisar(resultadoLexador);

        if (resultadoAvaliacaoSintatica.erros.length > 0) {
            throw `O comando '${comando}' digitado não é válido, tente novamente.`
        }

        const resultadoTraducao = this.tradutor.traduzir(resultadoAvaliacaoSintatica.comandos);

        const resultadoExecucao = await this.clientePostgreSQL.executarComando(resultadoTraducao);
        const retorno = new RetornoComando(resultadoExecucao);

        return retorno;
    }
}