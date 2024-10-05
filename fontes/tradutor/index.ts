import { Coluna } from '../comum/fontes/construtos';
import {
    Alterar,
    Atualizar,
    Comando,
    Criar,
    Excluir,
    Inserir,
    Selecionar
} from '../comum/fontes/comandos';
import { Simbolo } from '../comum/fontes/lexador/simbolo';

import tiposDeSimbolos from '../comum/fontes/tipos-de-simbolos';
import { Restricao } from '../comum/fontes/construtos/restricao';

export class Tradutor {
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

    traduzirComandoAtualizar(comandoAtualizar: Atualizar) {
        let resultado = 'UPDATE ';
        resultado += `${comandoAtualizar.tabela}\nSET `;

        for (const valorAtualizacao of comandoAtualizar.colunasEValores) {
            if (valorAtualizacao.direita.tipo === tiposDeSimbolos.TEXTO) {
                resultado += `${valorAtualizacao.esquerda.lexema} = '${valorAtualizacao.direita.lexema}', `;
                continue;
            }
            if (
                [tiposDeSimbolos.VERDADEIRO, tiposDeSimbolos.FALSO].includes(
                    valorAtualizacao.direita.tipo
                )
            ) {
                resultado += `${
                    valorAtualizacao.esquerda.lexema
                } = ${this.traduzirOperador(valorAtualizacao.direita.tipo)}, `;
                continue;
            }
            resultado += `${valorAtualizacao.esquerda.lexema} = ${valorAtualizacao.direita.lexema}, `;
        }

        resultado = resultado.slice(0, -2);

        if (comandoAtualizar.condicoes.length > 0) {
            resultado += `\nWHERE `;

            for (const condicao of comandoAtualizar.condicoes) {
                resultado += `${
                    condicao.esquerda.lexema
                } ${this.traduzirOperador(condicao.operador)} ${
                    condicao.direita
                } AND `;
            }

            resultado = resultado.slice(0, -5);
        }

        return resultado;
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

    traduzirComandoExcluir(comandoExcluir: Excluir) {
        let resultado = 'DELETE FROM ';
        resultado += `${comandoExcluir.tabela} `;

        resultado = resultado.slice(0, -1);

        if (comandoExcluir.condicoes.length > 0) {
            resultado += `\nWHERE `;

            for (const condicao of comandoExcluir.condicoes) {
                resultado += `${
                    condicao.esquerda.lexema
                } ${this.traduzirOperador(condicao.operador)} ${
                    condicao.direita
                } AND `;
            }

            resultado = resultado.slice(0, -5);
        }

        return resultado;
    }

    traduzirComandoInserir(comandoInserir: Inserir) {
        let resultado = 'INSERT INTO ';
        resultado += `${comandoInserir.tabela} (`;

        for (const coluna of comandoInserir.colunas) {
            resultado += `${coluna}, `;
        }

        resultado = resultado.slice(0, -2);
        resultado += `)\nVALUES (`;

        for (const valor of comandoInserir.valores) {
            if (typeof valor.literal === 'string') {
                resultado += `"${valor.literal}", `;
                continue;
            } else if (
                [tiposDeSimbolos.VERDADEIRO, tiposDeSimbolos.FALSO].includes(
                    valor.tipo
                )
            ) {
                resultado += `${this.traduzirOperador(valor.tipo)}, `;
                continue;
            } else {
                resultado += `${valor.literal}, `;
            }
        }

        resultado = resultado.slice(0, -2);
        resultado += `)`;

        return resultado;
    }

    traduzirComandoSelecionar(comandoSelecionar: Selecionar) {
        let resultado = 'SELECT ';

        // Colunas
        if (comandoSelecionar.tudo) {
            resultado += '*';
        } else {
            for (const coluna of comandoSelecionar.colunas) {
                resultado += coluna + ', ';
            }

            resultado = resultado.slice(0, -2);
        }

        resultado += `\nFROM ${comandoSelecionar.tabela}`;

        // Condições
        if (comandoSelecionar.condicoes.length > 0) {
            resultado += '\n WHERE ';
            for (const condicao of comandoSelecionar.condicoes) {
                resultado += `${
                    condicao.esquerda.lexema
                } ${this.traduzirOperador(condicao.operador)} ${
                    condicao.direita
                } AND `;
            }
            resultado = resultado.slice(0, -5);
        }

        return resultado;
    }

    private logicaManipulacaoColunas(elemento: Coluna | Restricao) {
        if (elemento instanceof Coluna) {
            let formatacaoColuna = `COLUMN ${elemento.nomeColuna} ${this.traduzirTipoDeDados(elemento.tipo)}`;
            if (elemento.tipo === 'TEXTO') {
                formatacaoColuna += `(${elemento.tamanho.lexema})`;
            }

            formatacaoColuna += ` `;
            return formatacaoColuna;
        }

        if (elemento instanceof Restricao) {
            let formatacaoRestricao = `CONSTRAINT ${elemento.nome} ${this.traduzirTipoDeRestricao(elemento.tipo)} (`;
            for (const coluna of elemento.colunas) {
                formatacaoRestricao += coluna + ', ';
            }

            formatacaoRestricao = formatacaoRestricao.slice(0, -2);
            formatacaoRestricao += `) REFERENCES ${elemento.tabelaReferenciada} (`;
            for (const colunaReferenciada of elemento.colunasReferenciadas) {
                formatacaoRestricao += colunaReferenciada + ', ';
            }

            formatacaoRestricao = formatacaoRestricao.slice(0, -2);
            formatacaoRestricao += `) `;
            return formatacaoRestricao;
        }
    }

    private traduzirTipoEntidade(tipoEntidade: string) {
        switch (tipoEntidade.toUpperCase()) {
            case 'TABELA':
                return 'TABLE';
            case 'VISÃO':
            case 'VISAO':
                return 'VIEW';
        }
    }

    //ALTER TABLE produtos ADD COLUMN descricao text(200)
    traduzirComandoAlterar(comandoAlterar: Alterar): string {
        let resultado = `ALTER ${this.traduzirTipoEntidade(comandoAlterar.tipoEntidade)} ${comandoAlterar.nomeEntidade} `;

        for (const operacao of comandoAlterar.operacoes) {
            switch (operacao.tipo) {
                case 'ADICIONAR':
                    resultado += `ADD ${this.logicaManipulacaoColunas(
                        operacao.elemento
                    )}`;
                    break;
                case 'ALTERAR':
                    break;
                case 'EXCLUIR':
                    break;
                case 'RENOMEAR':
                    break;
            }
        }

        return resultado; //ALTER TABLE produtos ADD COLUMN descricao text(200)
    }

    dicionarioComandos = {
        Alterar: this.traduzirComandoAlterar.bind(this),
        Atualizar: this.traduzirComandoAtualizar.bind(this),
        Criar: this.traduzirComandoCriar.bind(this),
        Excluir: this.traduzirComandoExcluir.bind(this),
        Inserir: this.traduzirComandoInserir.bind(this),
        Selecionar: this.traduzirComandoSelecionar.bind(this)
    };

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
