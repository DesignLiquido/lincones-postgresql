import { QueryResult } from 'pg'
import { RetornoComandoInterface } from '../comum/fontes/interfaces/retorno-comando-interface';

export class RetornoComando implements RetornoComandoInterface {
    linhasAfetadas: number = 0;
    linhasRetornadas: any[] = [];
    comandoExecutado: string;
    mensagemExecucao: string;
    ultimoId: any;
    tiposDeComandos : string[] = ['INSERT', 'UPDATE', 'DELETE'];

    constructor(resultadoExecucao: QueryResult) {
        if (!resultadoExecucao) {
            return;
        }

        if (resultadoExecucao.rowCount) {
            this.linhasAfetadas = resultadoExecucao.rowCount;
        }

        if (this.tiposDeComandos.includes(resultadoExecucao.command)) {
            this.comandoExecutado = resultadoExecucao.command;
            this.mensagemExecucao = `Ok (${this.linhasAfetadas} ${this.linhasAfetadas > 1 ? 'linhas afetadas' : 'linha afetada'})`;
            return;
        }

        if (resultadoExecucao.command === 'SELECT') {
            const linhas = resultadoExecucao.rows.length || 0
            this.linhasRetornadas = resultadoExecucao.rows;
            this.mensagemExecucao = `(${linhas} ${linhas > 1 ? 'linhas retornadas' : 'linha retornada'})`;
            return;
        }
    }
    
}