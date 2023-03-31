import { Tradutor } from "../comum/fontes/tradutor";
import { AvaliadorSintatico } from "../comum/fontes/avaliador-sintatico";
import { Lexador } from "./lexador";
import { ClientePostgreSQL } from "./infraestrutura/cliente-postgresql";
import { RetornoComando } from "./infraestrutura";

import * as dotenv from 'dotenv'
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

    async executar(comando: string): Promise<RetornoComando> {
        const resultadoLexador = this.lexador.mapear([comando]);
        const resultadoAvaliacaoSintatica = this.avaliadorSintatico.analisar(resultadoLexador);
        const resultadoTraducao = this.tradutor.traduzir(resultadoAvaliacaoSintatica.comandos);

        if (resultadoAvaliacaoSintatica.comandos.length <= 0) {
            return new RetornoComando(null);
        }

        const resultadoExecucao = await this.clientePostgreSQL.executarComando(resultadoTraducao);
        const retorno = new RetornoComando(resultadoExecucao);

        return retorno;
    }
}