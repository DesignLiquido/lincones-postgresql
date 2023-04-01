# lincones-postgresql

Biblioteca de LinConEs para JavaScript usando PostgreSQL.

Especificação em https://github.com/DesignLiquido/LinConEs.

## Documentação de referência para novas implementações

- https://node-postgres.com

## Modo de uso

Para usar no seu computador, [você deve ter antes o Node.js instalado em seu ambiente](https://dicasdejavascript.com.br/instalacao-do-nodejs-e-npm-no-windows-passo-a-passo).

Com o Node.js instalado, execute o seguinte comando em um prompt de comando (Terminal, PowerShell ou `cmd` no Windows, Terminal ou `bash` em Mac e Linux):

```
npm install -g @designliquido/lincones-postgresql
```

### Execução

Para executar no modo console, adicione na raiz do seu projeto um arquivo `.env` com o seguinte:

```
ENDERECO='localhost'
PORTA=5432
USUARIO='root'
SENHA='minhasenha#123'
NOME_BASE_DADOS='meu_banco_de_dados'
```

`PORTA` é opcional. Se não definida, a biblioteca usa a porta padrão, 5432.

Utilize o comando `lincones-postgresql` para iniciar.

Pressione `Ctrl` + `c` para sair.

## Observação

Se você tem interesse em contribuir com o desenvolvimento do projeto, logo após fazer o clone e atualizar os pacotes com `yarn`, lembre-se de executar o seguinte comando:

```
git submodule update --init --recursive --remote
```

Com isso, você sincroniza com a versão mais recente de [lincones-js](https://github.com/DesignLiquido/lincones-js), que é o projeto base para lincones-postgresql.