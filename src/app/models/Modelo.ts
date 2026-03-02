

// codigo gerado automaticamente pelo mentor transacao 1878

import {Mentor}  from '../models/Mentor'
import { servico } from '../models/Servico';


function replaceAll(palavra,de, para){
		var str = palavra;
		var pos = str.indexOf(de);
		while (pos > -1){
			str = str.replace(de, para);
			pos = str.indexOf(de);
		}
		return (str);
}

	export class formatadoLista{
		public de:number;
		public para :String;
		constructor(de:number,para:String){
			this.de = de;
			this.para = para;
		}
	}
	export class ionicClasseBase{
		public ionicIndiceRepositorio: number;
		public ionicFlagConcluido: boolean
		public ionicFlagNovo: boolean
		public base64: string
		public idApp: string
		public nomeApp: string
		public temValorB(nome:String){
			if(this[nome + ""] == null || this[nome + ""] == '') return false;
			if(this[nome+'FormatadoLista'] != null && this[nome+'FormatadoLista'][this[nome + '']-0] != null) return true;
			if(this[nome + ''] == 0) return false;
			return true;
		}
		public temValor(nome:String){
			if(this.temValorB(nome)) return '&#9989;';
			else return '&#10060;';
		}
	}

export class EntregasBeneficiosDiversos extends ionicClasseBase {
public static mentorNomeClasse = 'br.com.assistenciaSocial.beans.EntregasBeneficiosDiversos';

	static criaColecao(lista: any){
		if(lista!=null){
			var retorno = new Array();
			for(let x = 0;x<lista.length;x++)
				retorno.push(new EntregasBeneficiosDiversos(lista[x]));
			return retorno;
		}
	}

		public codigo : number = 0 ;
		public codigo_ : String ;
		get codigoSimNao(){ if (this.codigo == 1) return true; else return false;}
		set codigoSimNao(flag){ if (flag) this.codigo = 1; else this.codigo = 0;}
		get codigoFormatado(): String {
			return (this.codigo_)
		}
		set codigoFormatado(valor: String) {
			this.codigo_ =  (valor);
			if(replaceAll(valor," ","") != "")
				this.codigo =  Mentor.stringToMoeda(valor);
		}

		public dataCriacao : Date = null ;
		public dataCriacao_ : String ;
		get dataCriacaoFormatado(): String {
			if(typeof(this.dataCriacao) != 'undefined' && this.dataCriacao != null  )
			return Mentor.dateToString(this.dataCriacao);
			else
				return  '' ;
		}
		set dataCriacaoFormatado(valor: String) {
			this.dataCriacao_ =  valor;
			if(replaceAll(this.dataCriacao_,"_","").length ==10)
				this.dataCriacao =  Mentor.stringToDate(valor);
		}
		get dataCriacaoFormatadoIso(): String {
			return  Mentor.dateToStringIso(this.dataCriacao)
		}
		set dataCriacaoFormatadoIso(valor: String) {
			this.dataCriacao =  Mentor.stringToDateIso(valor);
			this.dataCriacao_ =  Mentor.dateToString(this.dataCriacao);
		}

		public dataAlteracao : Date = null ;
		public dataAlteracao_ : String ;
		get dataAlteracaoFormatado(): String {
			if(typeof(this.dataAlteracao) != 'undefined' && this.dataAlteracao != null  )
			return Mentor.dateToString(this.dataAlteracao);
			else
				return  '' ;
		}
		set dataAlteracaoFormatado(valor: String) {
			this.dataAlteracao_ =  valor;
			if(replaceAll(this.dataAlteracao_,"_","").length ==10)
				this.dataAlteracao =  Mentor.stringToDate(valor);
		}
		get dataAlteracaoFormatadoIso(): String {
			return  Mentor.dateToStringIso(this.dataAlteracao)
		}
		set dataAlteracaoFormatadoIso(valor: String) {
			this.dataAlteracao =  Mentor.stringToDateIso(valor);
			this.dataAlteracao_ =  Mentor.dateToString(this.dataAlteracao);
		}

		public dataPagamento : Date = null ;
		public dataPagamento_ : String ;
		get dataPagamentoFormatado(): String {
			if(typeof(this.dataPagamento) != 'undefined' && this.dataPagamento != null  )
			return Mentor.dateToString(this.dataPagamento);
			else
				return  '' ;
		}
		set dataPagamentoFormatado(valor: String) {
			this.dataPagamento_ =  valor;
			if(replaceAll(this.dataPagamento_,"_","").length ==10)
				this.dataPagamento =  Mentor.stringToDate(valor);
		}
		get dataPagamentoFormatadoIso(): String {
			return  Mentor.dateToStringIso(this.dataPagamento)
		}
		set dataPagamentoFormatadoIso(valor: String) {
			this.dataPagamento =  Mentor.stringToDateIso(valor);
			this.dataPagamento_ =  Mentor.dateToString(this.dataPagamento);
		}

		public taxa : number = 0 ;
		public taxa_ : String ;
		get taxaSimNao(){ if (this.taxa == 1) return true; else return false;}
		set taxaSimNao(flag){ if (flag) this.taxa = 1; else this.taxa = 0;}
		get taxaFormatado(): String {
			return (this.taxa_)
		}
		set taxaFormatado(valor: String) {
			this.taxa_ =  (valor);
			if(replaceAll(valor," ","") != "")
				this.taxa =  Mentor.stringToMoeda(valor);
		}

		public flagEntregue : number = 0 ;
		public flagEntregue_ : String ;
		get flagEntregueSimNao(){ if (this.flagEntregue == 1) return true; else return false;}
		set flagEntregueSimNao(flag){ if (flag) this.flagEntregue = 1; else this.flagEntregue = 0;}
		public flagEntregueFormatadoLista : formatadoLista[] = new Array();
		get flagEntregueFormatado(){  return Mentor.formatadoLista(this.flagEntregueFormatadoLista,this.flagEntregue);}

		public beneficioDiversos : BeneficiosDiversos ;
		public usuarioCriacao : Funcionarios ;
		public usuarioAlteracao : Funcionarios ;

public listaAtributosKodefy: Array<string> ='codigo#dataCriacao#dataAlteracao#dataPagamento#taxa#flagEntregue#'.split('#');
		constructor(objeto:any){
		super();
		if(objeto != null && objeto != 'null'){
if(typeof(objeto.ionicFlagNovo) == 'undefined') this.ionicFlagNovo = false; else this.ionicFlagNovo = objeto.ionicFlagNovo;
this.idApp = objeto.idApp;
this.nomeApp = objeto.nomeApp;
			 this.codigo = objeto.codigo;
			 this.codigo_ = Mentor.intToString(this.codigo);
				 if(typeof(objeto.dataCriacao_) != 'undefined') { try{ 
 this.dataCriacao_ = objeto.dataCriacao_ ;
			 this.dataCriacao = Mentor.stringToDate(objeto.dataCriacao_) ;
			 this.dataCriacaoFormatado = (objeto.dataCriacao_) ;
} catch(err){alert(err); 
 throw err;} 
 }
else{
			 this.dataCriacao = Mentor.stringToDate(objeto.dataCriacaoFormatado) ;
			 this.dataCriacao_ = (objeto.dataCriacaoFormatado) ;}
				 if(typeof(objeto.dataAlteracao_) != 'undefined') { try{ 
 this.dataAlteracao_ = objeto.dataAlteracao_ ;
			 this.dataAlteracao = Mentor.stringToDate(objeto.dataAlteracao_) ;
			 this.dataAlteracaoFormatado = (objeto.dataAlteracao_) ;
} catch(err){alert(err); 
 throw err;} 
 }
else{
			 this.dataAlteracao = Mentor.stringToDate(objeto.dataAlteracaoFormatado) ;
			 this.dataAlteracao_ = (objeto.dataAlteracaoFormatado) ;}
				 if(typeof(objeto.dataPagamento_) != 'undefined') { try{ 
 this.dataPagamento_ = objeto.dataPagamento_ ;
			 this.dataPagamento = Mentor.stringToDate(objeto.dataPagamento_) ;
			 this.dataPagamentoFormatado = (objeto.dataPagamento_) ;
} catch(err){alert(err); 
 throw err;} 
 }
else{
			 this.dataPagamento = Mentor.stringToDate(objeto.dataPagamentoFormatado) ;
			 this.dataPagamento_ = (objeto.dataPagamentoFormatado) ;}
			 this.taxa = objeto.taxa;
			 this.taxa_ = Mentor.intToString(this.taxa);
			 this.flagEntregue = objeto.flagEntregue;
			 this.flagEntregue_ = Mentor.intToString(this.flagEntregue);

			if(objeto.beneficioDiversos != null)
				this.beneficioDiversos = new BeneficiosDiversos(objeto.beneficioDiversos);

			if(objeto.usuarioCriacao != null)
				this.usuarioCriacao = new Funcionarios(objeto.usuarioCriacao);

			if(objeto.usuarioAlteracao != null)
				this.usuarioAlteracao = new Funcionarios(objeto.usuarioAlteracao);

		}
		else{
		if((objeto) == 'null'){
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';
			 this.dataCriacao = new Date();
			 this.dataCriacao_ = (this.dataCriacaoFormatado) ;
			 this.dataAlteracao = new Date();
			 this.dataAlteracao_ = (this.dataAlteracaoFormatado) ;
			 this.dataPagamento = new Date();
			 this.dataPagamento_ = (this.dataPagamentoFormatado) ;
			 this.taxa = 0;
			 this.taxa_ = '0,00';
			 this.flagEntregue = 0;
			 this.flagEntregue_ = '0';
				{var contexto : any = servico.contexto;
				this.usuarioCriacao = contexto["usuarioLogado"];}
				{var contexto : any = servico.contexto;
				this.usuarioAlteracao = contexto["usuarioLogado"];}

			}else{
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';
			 this.dataCriacao = new Date();
			 this.dataCriacao_ = (this.dataCriacaoFormatado) ;
			 this.dataAlteracao = new Date();
			 this.dataAlteracao_ = (this.dataAlteracaoFormatado) ;
			 this.dataPagamento = new Date();
			 this.dataPagamento_ = (this.dataPagamentoFormatado) ;
			 this.taxa = 0;
			 this.taxa_ = '0,00';
			 this.flagEntregue = 0;
			 this.flagEntregue_ = '0';
				this.beneficioDiversos = new BeneficiosDiversos('null');
				{var contexto : any = servico.contexto;
				this.usuarioCriacao = contexto["usuarioLogado"];}
				{var contexto : any = servico.contexto;
				this.usuarioAlteracao = contexto["usuarioLogado"];}

		}
			}

			this.flagEntregueFormatadoLista.push(new formatadoLista(0,"Não"));
			this.flagEntregueFormatadoLista.push(new formatadoLista(1,"Sim"));

		}

}

export class BeneficiosDiversos extends ionicClasseBase {
public static mentorNomeClasse = 'br.com.assistenciaSocial.beans.BeneficiosDiversos';

	static criaColecao(lista: any){
		if(lista!=null){
			var retorno = new Array();
			for(let x = 0;x<lista.length;x++)
				retorno.push(new BeneficiosDiversos(lista[x]));
			return retorno;
		}
	}

		public codigo : number = 0 ;
		public codigo_ : String ;
		get codigoSimNao(){ if (this.codigo == 1) return true; else return false;}
		set codigoSimNao(flag){ if (flag) this.codigo = 1; else this.codigo = 0;}
		get codigoFormatado(): String {
			return (this.codigo_)
		}
		set codigoFormatado(valor: String) {
			this.codigo_ =  (valor);
			if(replaceAll(valor," ","") != "")
				this.codigo =  Mentor.stringToMoeda(valor);
		}

		public dataAlteracao : Date = null ;
		public dataAlteracao_ : String ;
		get dataAlteracaoFormatado(): String {
			if(typeof(this.dataAlteracao) != 'undefined' && this.dataAlteracao != null  )
			return Mentor.dateToString(this.dataAlteracao);
			else
				return  '' ;
		}
		set dataAlteracaoFormatado(valor: String) {
			this.dataAlteracao_ =  valor;
			if(replaceAll(this.dataAlteracao_,"_","").length ==10)
				this.dataAlteracao =  Mentor.stringToDate(valor);
		}
		get dataAlteracaoFormatadoIso(): String {
			return  Mentor.dateToStringIso(this.dataAlteracao)
		}
		set dataAlteracaoFormatadoIso(valor: String) {
			this.dataAlteracao =  Mentor.stringToDateIso(valor);
			this.dataAlteracao_ =  Mentor.dateToString(this.dataAlteracao);
		}

		public situacao : number = 0 ;
		public situacao_ : String ;
		get situacaoSimNao(){ if (this.situacao == 1) return true; else return false;}
		set situacaoSimNao(flag){ if (flag) this.situacao = 1; else this.situacao = 0;}
		public situacaoFormatadoLista : formatadoLista[] = new Array();
		get situacaoFormatado(){  return Mentor.formatadoLista(this.situacaoFormatadoLista,this.situacao);}

		public arquivos : ArquivoBeneficio[] ;

public listaAtributosKodefy: Array<string> ='codigo#dataAlteracao#situacao#'.split('#');
		constructor(objeto:any){
		super();
		if(objeto != null && objeto != 'null'){
if(typeof(objeto.ionicFlagNovo) == 'undefined') this.ionicFlagNovo = false; else this.ionicFlagNovo = objeto.ionicFlagNovo;
this.idApp = objeto.idApp;
this.nomeApp = objeto.nomeApp;
			 this.codigo = objeto.codigo;
			 this.codigo_ = Mentor.intToString(this.codigo);
				 if(typeof(objeto.dataAlteracao_) != 'undefined') { try{ 
 this.dataAlteracao_ = objeto.dataAlteracao_ ;
			 this.dataAlteracao = Mentor.stringToDate(objeto.dataAlteracao_) ;
			 this.dataAlteracaoFormatado = (objeto.dataAlteracao_) ;
} catch(err){alert(err); 
 throw err;} 
 }
else{
			 this.dataAlteracao = Mentor.stringToDate(objeto.dataAlteracaoFormatado) ;
			 this.dataAlteracao_ = (objeto.dataAlteracaoFormatado) ;}
			 this.situacao = objeto.situacao;
			 this.situacao_ = Mentor.intToString(this.situacao);
				this.arquivos = new Array();

			if(objeto.arquivos != null){
				for(let x:number = 0;x<objeto.arquivos.length;x++)
				this.arquivos.push(new ArquivoBeneficio(objeto.arquivos[x]))
			}

		}
		else{
		if((objeto) == 'null'){
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';
			 this.dataAlteracao = new Date();
			 this.dataAlteracao_ = (this.dataAlteracaoFormatado) ;
			 this.situacao = 0;
			 this.situacao_ = '0';

			}else{
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';
			 this.dataAlteracao = new Date();
			 this.dataAlteracao_ = (this.dataAlteracaoFormatado) ;
			 this.situacao = 0;
			 this.situacao_ = '0';

		}
			}

			this.situacaoFormatadoLista.push(new formatadoLista(1,"Ativo / Em Uso"));
			this.situacaoFormatadoLista.push(new formatadoLista(2,"Bloqueado"));
			this.situacaoFormatadoLista.push(new formatadoLista(3,"Cancelado"));
			this.situacaoFormatadoLista.push(new formatadoLista(4,"Cancelado para Substituição"));
			this.situacaoFormatadoLista.push(new formatadoLista(5,"Não Informado"));
			this.situacaoFormatadoLista.push(new formatadoLista(6,"Recusado"));
			this.situacaoFormatadoLista.push(new formatadoLista(7,"Desligado"));
			this.situacaoFormatadoLista.push(new formatadoLista(8,"Entregue"));

		}

}


export class ArquivoBeneficio extends ionicClasseBase {
public static mentorNomeClasse = 'br.com.assistenciaSocial.beans.ArquivoBeneficio';

	static criaColecao(lista: any){
		if(lista!=null){
			var retorno = new Array();
			for(let x = 0;x<lista.length;x++)
				retorno.push(new ArquivoBeneficio(lista[x]));
			return retorno;
		}
	}

		public codigo : number = 0 ;
		public codigo_ : String ;
		get codigoSimNao(){ if (this.codigo == 1) return true; else return false;}
		set codigoSimNao(flag){ if (flag) this.codigo = 1; else this.codigo = 0;}
		get codigoFormatado(): String {
			return (this.codigo_)
		}
		set codigoFormatado(valor: String) {
			this.codigo_ =  (valor);
			if(replaceAll(valor," ","") != "")
				this.codigo =  Mentor.stringToMoeda(valor);
		}

		public extensao : String = '' ;
		public extensao_ : String ;

		public descricao : String = '' ;
		public descricao_ : String ;

		public flagUpoload : number = 0 ;
		public flagUpoload_ : String ;

public listaAtributosKodefy: Array<string> ='codigo#extensao#descricao#flagUpoload#'.split('#');
		constructor(objeto:any){
		super();
		if(objeto != null && objeto != 'null'){
if(typeof(objeto.ionicFlagNovo) == 'undefined') this.ionicFlagNovo = false; else this.ionicFlagNovo = objeto.ionicFlagNovo;
this.idApp = objeto.idApp;
this.nomeApp = objeto.nomeApp;
			 this.codigo = objeto.codigo;
			 this.codigo_ = Mentor.intToString(this.codigo);
			 this.extensao = objeto.extensao;
			 this.descricao = objeto.descricao;
			 this.flagUpoload = objeto.flagUpoload;

		}
		else{
		if((objeto) == 'null'){
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';

			}else{
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';

		}
			}


		}

}


export class UnidadeAdministrativa extends ionicClasseBase {
public static mentorNomeClasse = 'br.com.acesso.beans.UnidadeAdministrativa';

	static criaColecao(lista: any){
		if(lista!=null){
			var retorno = new Array();
			for(let x = 0;x<lista.length;x++)
				retorno.push(new UnidadeAdministrativa(lista[x]));
			return retorno;
		}
	}

		public codigo : number = 0 ;
		public codigo_ : String ;
		get codigoSimNao(){ if (this.codigo == 1) return true; else return false;}
		set codigoSimNao(flag){ if (flag) this.codigo = 1; else this.codigo = 0;}
		get codigoFormatado(): String {
			return (this.codigo_)
		}
		set codigoFormatado(valor: String) {
			this.codigo_ =  (valor);
			if(replaceAll(valor," ","") != "")
				this.codigo =  Mentor.stringToMoeda(valor);
		}

		public nome : String = '' ;
		public nome_ : String ;

public listaAtributosKodefy: Array<string> ='codigo#nome#'.split('#');
		constructor(objeto:any){
		super();
		if(objeto != null && objeto != 'null'){
if(typeof(objeto.ionicFlagNovo) == 'undefined') this.ionicFlagNovo = false; else this.ionicFlagNovo = objeto.ionicFlagNovo;
this.idApp = objeto.idApp;
this.nomeApp = objeto.nomeApp;
			 this.codigo = objeto.codigo;
			 this.codigo_ = Mentor.intToString(this.codigo);
			 this.nome = objeto.nome;

		}
		else{
		if((objeto) == 'null'){
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';

			}else{
this.ionicFlagNovo = true;
			 this.codigo = 0;
			 this.codigo_ = '0';

		}
			}


		}

}



export class licencaMunicipioSistema extends ionicClasseBase {
	public static mentorNomeClasse =
	  'br.com.assistenciaSocial.app.licencaMunicipioSistema';
  
	static criaColecao(lista: any) {
	  if (lista != null) {
		var retorno = new Array();
		for (let x = 0; x < lista.length; x++)
		  retorno.push(new licencaMunicipioSistema(lista[x]));
		return retorno;
	  }
	}
  
	public codigo: number;
	public codigo_: String;
	get codigoSimNao() {
	  if (this.codigo == 1) return true;
	  else return false;
	}
	set codigoSimNao(flag) {
	  if (flag) this.codigo = 1;
	  else this.codigo = 0;
	}
	get codigoFormatado(): String {
	  return this.codigo_;
	}
	set codigoFormatado(valor: String) {
	  this.codigo_ = valor;
	  if (replaceAll(valor, ' ', '') != '')
		this.codigo = Mentor.stringToMoeda(valor);
	}
  
	public nomeMunicipio: String;
	public nomeMunicipio_: String;
  
	public sistema: number;
	public sistema_: String;
	get sistemaSimNao() {
	  if (this.sistema == 1) return true;
	  else return false;
	}
	set sistemaSimNao(flag) {
	  if (flag) this.sistema = 1;
	  else this.sistema = 0;
	}
	public sistemaFormatadoLista: formatadoLista[] = new Array();
	get sistemaFormatado() {
	  return Mentor.formatadoLista(this.sistemaFormatadoLista, this.sistema);
	}
  
	public nomeCliente: String;
	public nomeCliente_: String;
  
	public logo: String;
	public logo_: String;
  
	public dataUltimaVersao: Date;
	public dataUltimaVersao_: String;
	get dataUltimaVersaoFormatado(): String {
	  if (
		typeof this.dataUltimaVersao != 'undefined' &&
		this.dataUltimaVersao != null
	  )
		return Mentor.dateToString(this.dataUltimaVersao);
	  else return '';
	}
	set dataUltimaVersaoFormatado(valor: String) {
	  this.dataUltimaVersao_ = valor;
	  if (replaceAll(this.dataUltimaVersao_, '_', '').length == 10)
		this.dataUltimaVersao = Mentor.stringToDate(valor);
	}
	get dataUltimaVersaoFormatadoIso(): String {
	  return Mentor.dateToStringIso(this.dataUltimaVersao);
	}
	set dataUltimaVersaoFormatadoIso(valor: String) {
	  this.dataUltimaVersao = Mentor.stringToDateIso(valor);
	  this.dataUltimaVersao_ = Mentor.dateToString(this.dataUltimaVersao);
	}
  
	public url: String;
	public url_: String;
  
	public urlUltimaAlteracao: String;
	public urlUltimaAlteracao_: String;
  
	public urlServidor: String;
	public urlServidor_: String;
	public estado: Estado;
  
	constructor(objeto: any) {
	  super();
	  if (objeto != null) Mentor.mostraSql = objeto.flagExibeSql;
	  if (objeto != null && objeto != 'null') {
		if (typeof objeto.ionicFlagNovo == 'undefined')
		  this.ionicFlagNovo = false;
		else this.ionicFlagNovo = objeto.ionicFlagNovo;
		this.codigo = objeto.codigo;
		this.codigo_ = Mentor.intToString(this.codigo);
		this.nomeMunicipio = objeto.nomeMunicipio;
		this.sistema = objeto.sistema;
		this.sistema_ = Mentor.intToString(this.sistema);
		this.nomeCliente = objeto.nomeCliente;
		this.logo = objeto.logo;
		if (typeof objeto.dataUltimaVersao_ != 'undefined') {
		  try {
			this.dataUltimaVersao_ = objeto.dataUltimaVersao_;
			this.dataUltimaVersao = Mentor.stringToDate(objeto.dataUltimaVersao_);
			this.dataUltimaVersaoFormatado = objeto.dataUltimaVersao_;
		  } catch (err) {
			alert(err);
			throw err;
		  }
		} else {
		  this.dataUltimaVersao = Mentor.stringToDate(
			objeto.dataUltimaVersaoFormatado
		  );
		  this.dataUltimaVersao_ = objeto.dataUltimaVersaoFormatado;
		}
		this.url = objeto.url;
		this.urlUltimaAlteracao = objeto.urlUltimaAlteracao;
		this.urlServidor = objeto.urlServidor;
  
		if (objeto.estado != null) this.estado = new Estado(objeto.estado);
	  } else {
		if (objeto == 'null') {
		  this.ionicFlagNovo = true;
		  this.codigo = 0;
		  this.codigo_ = '0';
		  this.sistema = 0;
		  this.sistema_ = '0';
		  this.dataUltimaVersao = new Date();
		  this.dataUltimaVersao_ =
		  this.dataUltimaVersaoFormatado;
		} else {
		  this.ionicFlagNovo = true;
		  this.codigo = 0;
		  this.codigo_ = '0';
		  this.sistema = 0;
		  this.sistema_ = '0';
		  this.dataUltimaVersao = new Date();
		  this.dataUltimaVersao_ = this.dataUltimaVersaoFormatado;
		  this.estado = new Estado('null');
		}
	  }
  
	  this.sistemaFormatadoLista.push(new formatadoLista(1, 'assistenciaSocial'));
	  this.sistemaFormatadoLista.push(new formatadoLista(2, 'tfd'));
	  this.sistemaFormatadoLista.push(
		new formatadoLista(3, 'transporte escolar')
	  );
	  this.sistemaFormatadoLista.push(new formatadoLista(4, 'ouvidoria'));
	  this.sistemaFormatadoLista.push(new formatadoLista(5, 'gestao escolar'));
	  this.sistemaFormatadoLista.push(new formatadoLista(6, 'sic'));
	  this.sistemaFormatadoLista.push(new formatadoLista(7, 'transparencia'));
	  this.sistemaFormatadoLista.push(new formatadoLista(8, 'netDoc'));
	  this.sistemaFormatadoLista.push(new formatadoLista(9, 'diarioOficial'));
	}
  }

  export class Estado extends ionicClasseBase {
	static criaColecao(lista: any) {
	  if (lista != null) {
		var retorno = new Array();
		for (let x = 0; x < lista.length; x++) retorno.push(new Estado(lista[x]));
		return retorno;
	  }
	}
  
	public codigo: number;
	public codigo_: String;
	get codigoSimNao() {
	  if (this.codigo == 1) return true;
	  else return false;
	}
	set codigoSimNao(flag) {
	  if (flag) this.codigo = 1;
	  else this.codigo = 0;
	}
	get codigoFormatado(): String {
	  return this.codigo_;
	}
	set codigoFormatado(valor: String) {
	  this.codigo_ = valor;
	  if (replaceAll(valor, ' ', '') != '')
		this.codigo = Mentor.stringToMoeda(valor);
	}
  
	public descricao: String;
	public descricao_: String;
  
	constructor(objeto: any) {
	  super();
	  if (objeto != null) {
		if (typeof objeto.ionicFlagNovo == 'undefined')
		  this.ionicFlagNovo = false;
		else this.ionicFlagNovo = objeto.ionicFlagNovo;
		this.codigo = objeto.codigo;
		this.codigo_ = Mentor.intToString(this.codigo);
		this.descricao = objeto.descricao;
	  } else {
		if (typeof objeto == 'undefined') {
		  this.ionicFlagNovo = true;
		  this.codigo = 0;
		  this.codigo_ = '0';
		} else {
		  this.ionicFlagNovo = true;
		  this.codigo = 0;
		  this.codigo_ = '0';
		}
	  }
	}
  }

  export class Funcionarios extends ionicClasseBase {


	public codigo: number;
	get codigoFormatado(): String {
		return Mentor.moedaToString(this.codigo)
	}
	set codigoFormatado(valor: String) {
		this.codigo = Mentor.stringToMoeda(valor);
	}

	public logi: String;

	public nome: String;

	public senha: String;

	public image: String;


	constructor(objeto: any) {
		super();
		if (objeto != null) {

			this.codigo = objeto.codigo;
			this.logi = objeto.logi;
			this.nome = objeto.nome;
			this.senha = objeto.senha;
			this.image = objeto.image;

		

		}
		else {


		}


	}

}

