import {
    Comando
} from '../comum/fontes/comandos';
import {
    RetornoAvaliadorSintatico,
    RetornoLexador
} from '../comum/fontes/interfaces/retornos';
import { AvaliadorSintaticoBase } from '../comum/fontes/avaliador-sintatico/avaliador-sintatico-base';

export class AvaliadorSintatico extends AvaliadorSintaticoBase {
    public analisar(retornoLexador: RetornoLexador): RetornoAvaliadorSintatico {
        this.erros = [];
        this.atual = 0;
        this.bloco = 0;
        this.simbolos = retornoLexador?.simbolos || [];

        const declaracoes: Comando[] = [];
        while (!this.estaNoFinal()) {
            declaracoes.push(this.declaracao());
        }

        return {
            comandos: declaracoes,
            erros: this.erros
        } as RetornoAvaliadorSintatico;
    }
}
