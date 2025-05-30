import { Coluna } from '../comum/fontes/construtos';
import {
    Comando,
    Criar,
} from '../comum/fontes/comandos';
import { Simbolo } from '../comum/fontes/lexador/simbolo';
import { TradutorSqlAnsi } from '../comum/fontes/tradutor';

import tiposDeSimbolos from '../comum/fontes/tipos-de-simbolos';

export class Tradutor extends TradutorSqlAnsi {
    traduzirOperador(operador: string) {
        switch (operador) {
            case tiposDeSimbolos.IGUAL:
                return '=';
            case tiposDeSimbolos.VERDADEIRO:
                return true;
            case tiposDeSimbolos.FALSO:
                return false;
        }
    }

    protected traduzirTipoDeDados(tipo: string) {
        switch (tipo) {
            case 'INTEIRO':
                return 'INTEGER';
            case 'LOGICO':
                return 'BOOLEAN';
            case 'NUMERO':
                return 'INT';
            case 'TEXTO':
                return 'VARCHAR';
        }
    }

    protected traduzirTipoDeRestricao(tipo: string) {
        switch (tipo) {
            case 'CHAVE_PRIMARIA':
                return 'PRIMARY KEY';
            case 'CHAVE_ESTRANGEIRA':
                return 'FOREIGN KEY';
            case 'ÚNICA':
                return 'UNIQUE';
        }
    }

    traduzirColuna(coluna: Coluna) {
        let traduzir = '';
        if (coluna.chavePrimaria) traduzir += 'PRIMARY KEY ';
        if (tiposDeSimbolos.INTEIRO === coluna.tipo) {
            traduzir += `INTEGER `;
        } else if (tiposDeSimbolos.TEXTO === coluna.tipo) {
            const simbolo = coluna.tamanho as Simbolo;
            traduzir += `VARCHAR(${simbolo.literal}) `;
        } else if (tiposDeSimbolos.LOGICO === coluna.tipo)
            traduzir += 'BOOLEAN ';
        if (coluna.nulo) traduzir += 'NULL';
        else traduzir += 'NOT NULL';

        return traduzir;
    }

    traduzirComandoCriar(comandoCriar: Criar) {
        let resultado = `CREATE TABLE ${comandoCriar.nomeEntidade} (`;

        for (const coluna of comandoCriar.colunas) {
            resultado += `${coluna.nomeColuna} ${this.traduzirColuna(
                coluna
            )}, `;
        }

        resultado = resultado.slice(0, -2);
        resultado += ')';

        return resultado;
    }

    traduzir(comandos: Comando[]) {
        let resultado = '';

        for (const comando of comandos.filter((c) => c)) {
            resultado += `${this.dicionarioComandos[comando.constructor.name](
                comando
            )} \n`;
        }

        return resultado;
    }
}
