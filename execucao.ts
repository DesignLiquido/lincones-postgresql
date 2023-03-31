import * as leituraLinhas from 'readline';

import { LinconesPostgreSQL } from "./fontes/lincones-postgresql";

const lincones = new LinconesPostgreSQL();
lincones.clientePostgreSQL.abrir().then(() => {
    const interfaceLeitura = leituraLinhas.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '\nlincones> ',
    });
    
    interfaceLeitura.prompt();
    interfaceLeitura.on('line', (linha: string) => {
        lincones.executar(linha).then(resultado => {
            if (resultado.linhasRetornadas.length > 0) {
                console.table(resultado.linhasRetornadas);
            }
            
            if (resultado.mensagemExecucao){
                console.log(resultado.mensagemExecucao);
            }

            if (resultado.ultimoId) {
                console.log(`ID retornado pela operação: ${resultado.ultimoId}`);
            }

            return Promise.resolve();
        }).then(() => {
            interfaceLeitura.prompt();
        }).catch((erro) => {
            console.error(erro);
        });
    });
});
