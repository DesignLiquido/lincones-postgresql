import { DefinicaoPropriedade } from '@designliquido/delprops';

/**
 * Propriedades de configuração para uma fonte de dados PostgreSQL
 * (`liquido.dados.<nome>.*`).
 */
const dados: DefinicaoPropriedade[] = [
    {
        nome: 'tecnologia',
        tipo: 'texto',
        detalhe: 'Tecnologia de banco de dados.',
        valoresPermitidos: ['postgres'],
    },
    {
        nome: 'host',
        tipo: 'texto',
        detalhe: 'Endereço do servidor PostgreSQL.',
    },
    {
        nome: 'porta',
        tipo: 'numero',
        detalhe: 'Porta do servidor PostgreSQL (padrão: 5432).',
    },
    {
        nome: 'usuario',
        tipo: 'texto',
        detalhe: 'Nome de usuário para conexão.',
    },
    {
        nome: 'senha',
        tipo: 'texto',
        detalhe: 'Senha para conexão.',
    },
    {
        nome: 'banco',
        tipo: 'texto',
        detalhe: 'Nome do banco de dados.',
    },
    {
        nome: 'ssl',
        tipo: 'logico',
        detalhe: 'Habilita conexão SSL.',
    },
];

export default dados;
