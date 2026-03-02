

//npm i text-mask-addons --save
//https://github.com/text-mask/text-mask/tree/master/addons/#readme

export class servico {

    static enviaDados: boolean = false;
    static usuarioLogado: any = null;
    static imagem: String = null;
    static nome: String = null;

    static dataUltimoAcessoApp : Date = null;

    static cras = null;

    static municipio: String = null;

    static temMensagemNova: boolean = false;

    static historico: any = null;

    static unidade: any = null;

    static mensagens: any = null;

    // padrao

    static raiz : any;

    static tipoDocumento: number;
    
    static contexto: any = new Object();

    static mascaras: any = {
        cpf: [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/],
        data: [/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/],
        cep: [/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/],
        celular: ['(',/\d/,/\d/,')',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
        
    }
    
}