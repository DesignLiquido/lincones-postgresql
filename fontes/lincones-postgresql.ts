import * as dotenv from 'dotenv';

import { Tradutor } from "./tradutor";
import { AvaliadorSintatico } from "./comum/fontes/avaliador-sintatico";
import { Lexador } from "./comum/fontes/lexador";
import { ClientePostgreSQL } from "./infraestrutura/cliente-postgresql";
import { RetornoComando } from "./infraestrutura";
import { Comando, TecnologiaLinconesInterface } from './comum/fontes';
import { RetornoComandoInterface } from './comum/fontes/interfaces/retorno-comando-interface';
import { ConfiguracaoConexaoPostgreSQL } from './interfaces';

dotenv.config()

export class LinconesPostgreSQL implements TecnologiaLinconesInterface {
    lexador: Lexador;
    avaliadorSintatico: AvaliadorSintatico;
    tradutor: Tradutor;
    clientePostgreSQL: ClientePostgreSQL;

    constructor(configuracao?: ConfiguracaoConexaoPostgreSQL) {
        this.lexador = new Lexador();
        this.avaliadorSintatico = new AvaliadorSintatico();
        this.tradutor = new Tradutor();
        this.clientePostgreSQL = new ClientePostgreSQL(configuracao);
    }

    async iniciar(_caminho: string): Promise<void> {
        await this.clientePostgreSQL.abrir();
    }

    async executarComando(comando: Comando): Promise<RetornoComandoInterface[]> {
        return await this.executarInterno([comando], comando.parametros);
    }

    async executar(_: any, sentencaLincones: string, parametros: any[] = []): Promise<RetornoComandoInterface[]> {
        const parametrosNaoNulos = parametros || [];
        const resultadoLexador = this.lexador.mapear([sentencaLincones]);
        const resultadoAvaliacaoSintatica = this.avaliadorSintatico.analisar(resultadoLexador);

        if (resultadoAvaliacaoSintatica.erros.length > 0) {
            throw new Error(`Erros encontrados na avaliação de comandos: ${resultadoAvaliacaoSintatica.erros.reduce((mensagens, erro) => mensagens += erro.message + '; ', '')}.`);
        }

        return await this.executarInterno(resultadoAvaliacaoSintatica.comandos, parametrosNaoNulos);
    }

    async executarInterno(comandos: Comando[], parametros: any[]): Promise<RetornoComandoInterface[]> {
        if (comandos.length <= 0) {
            return [];
        }

        const retornosComandos: RetornoComando[] = [];

        for (const comando of comandos) {
            const resultadoTraducao = this.tradutor.traduzir([comando]);
            // TODO: Parâmetros
            const resultadoExecucao = await this.clientePostgreSQL.executarComando(resultadoTraducao);
            const retorno = new RetornoComando(resultadoExecucao);
            retornosComandos.push(retorno)
        }

        return retornosComandos;
    }

    

    /* async executar(_: any, comando: string): Promise<RetornoComando> {
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
    } */
}