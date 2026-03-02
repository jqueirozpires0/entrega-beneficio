function replaceAll(palavra, de, para) {
  var str = palavra;
  var pos = str.indexOf(de);
  while (pos > -1) {
    str = str.replace(de, para);
    pos = str.indexOf(de);
  }
  return str;
}

function f(p: number) {
  return String.fromCharCode(p);
}

var keyStrBase64 =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var keyStrUriSafe =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';

declare var escape: any;
export class Mentor {
  static urlConexao: String;

  static mostraSql: boolean;

  static UrlRequest: String =
    'https://treinamento.conectasuas.com.br/assistenciaSocial/';

  // static UrlRequest:string =  "http://10.10.0.21:8080/netGasV2";

  static formataData(dt: Date) {
    if (typeof dt === 'string') dt = new Date(dt);
    var retorno = '';
    retorno = dt.getDate() + '';
    if (dt.getDate() < 10) retorno = '0' + retorno;
    retorno = retorno + '/';
    var mes = dt.getMonth() + 1;
    if (mes < 10) retorno = retorno + '0';
    retorno = retorno + mes + '/' + dt.getFullYear();

    return retorno;
  }

  static formatadoLista(lista, valor) {
    try {
      for (var x = 0; x < lista.length; x++)
        if (lista[x].de == valor) return lista[x].para;
      return '';
    } catch (e) {
      return '';
    }
  }
  static executaVisao(visao, parametros) {
    return this.executaVisaoModulo(null, visao, parametros);
  }
  static executaVisaoModulo(modulo, visao, parametros) {
    var lpar = parametros;
    if (lpar == null) lpar = '';
    if (modulo != null) lpar = lpar + '&moduloMentor=' + modulo;
    if (visao == null) return;
    else lpar = lpar + '&visaoMentor=' + visao;

    var data = Mentor.bind(lpar, 'rodaVisaoOtimizada', 'POST');

    return eval('(' + data + ')');
  }

  static bind2() {
    var parametros =
      'varlogi=03718941406&varsenha=Velton250380&visaoMentor=1171';
    var murl = 'http://66.147.225.75:8080/assistenciaSocial/rodaVisaoOtimizada';
    var metodo = 'POST';
    var url = murl;
    var http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType) {
      http_request.overrideMimeType('text/html; charset=ISO-8859-1');
    }

    if (!http_request) {
      alert('N�o foi pos�vel inicializar o objeto XMLHTTP neste browser');
      return false;
    }

    parametros = parametros + '&codigoAleatorio=' + Math.random() * 10000;

    if (metodo == 'GET')
      http_request.open(metodo, url + '?' + parametros, false);
    else http_request.open(metodo, url, false);

    http_request.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded; charset=ISO-8859-1'
    );
    //  http_request.setRequestHeader("Content-length", parametros.length);
    //  http_request.setRequestHeader("Connection", "close");
    var palavra = '»»»»» ' + parametros + ' ' + new Date();

    if (metodo == 'GET') http_request.send('');
    else http_request.send(parametros);

    return http_request.responseText;
  }

  static bind(parametros, murl, metodo) {
    try {
      // var UrlRequest = "/escolar/";
      // //  if(!(window.location.hostname === "localhost"))
      // //UrlRequest = "http://66.147.225.75:8080/:8080/tfd/";
      // UrlRequest = "http://66.147.225.75:8080/assistenciaSocial/";

      // Mentor.UrlRequest = Mentor.UrlRequest.replace("8080","8082");

      // var aUrl = Mentor.UrlRequest.split(":8082");

      // Mentor.UrlRequest = "http://10.10.0.25:8082" + aUrl[1];

      //alert(Mentor.UrlRequest);

      if (Mentor.mostraSql) parametros = parametros + '&mwExibeSql=1';

      if (murl.indexOf('http') == -1 && !murl.startsWith('/'))
        var url = Mentor.UrlRequest + murl;
      //var url = this.UrlRequest + murl;
      else url = Mentor.UrlRequest + murl;
      var http_request = new XMLHttpRequest();
      if (http_request.overrideMimeType) {
        http_request.overrideMimeType('text/html; charset=UTF-8'); // mudar para utf-8
      }

      if (!http_request) {
        alert('N�o foi pos�vel inicializar o objeto XMLHTTP neste browser');
        return false;
      }

      parametros = parametros + '&codigoAleatorio=' + Math.random() * 10000;

      if (metodo == 'GET')
        http_request.open(metodo, url + '?' + parametros, true);
      else http_request.open(metodo, url, false);

      http_request.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded; charset=ISO-8859-1'
      );
      //  http_request.setRequestHeader("Content-length", parametros.length);
      //  http_request.setRequestHeader("Connection", "close");
      var palavra = '»»»»» ' + parametros + ' ' + new Date();

      //alert(url);

      if (metodo == 'GET') http_request.send('');
      else http_request.send(parametros);

      return http_request.responseText;

      //return http_request.responseText;
    } catch (error) {
      throw error;
    }
  }

  static bindBase(parametros, murl, metodo) {
    var url = murl;
    var http_request = new XMLHttpRequest();

    parametros = parametros + '&codigoAleatorio=' + Math.random() * 10000;

    if (metodo == 'GET')
      http_request.open(metodo, url + '?' + parametros, false);
    else http_request.open(metodo, url, false);

    http_request.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded; charset=ISO-8859-1'
    );

    if (metodo == 'GET') http_request.send('');
    else http_request.send(parametros);

    if (http_request.responseText == null)
      alert('status ' + http_request.statusText);

    return http_request.responseText;
  }
  static executaTransacao(transacao, parametros) {
    return Mentor.executaTransacaoModulo(null, transacao, parametros);
  }

  static executaTransacaoModulo(modulo, transacao, parametros) {
    let secret = '';

    //let UrlRequest =  "http://66.147.225.75:8080//tfd";

    var lpar = parametros;
    if (lpar == null) lpar = '';
    if (modulo != null) lpar = lpar + '&moduloMentor=' + modulo;
    if (transacao == null) return;
    else lpar = lpar + '&transacaoMentor=' + transacao;

    var data;
    try {
      console.log(lpar);
      //data = Mentor.bind(lpar,"http://10.10.0.21:8080/netGasV2/rodaTransacao","POST");
      data = Mentor.bind(lpar, 'rodaTransacao', 'POST');
    } catch (Err) {
      //	alert("problema ao rodar transacao ou eval " + Err);
      throw 'problema ao rodar transacao ou eval ' + Err;
    }

    try {
      if (data.substring(0, 7) == 'sucesso') {
        {
          return eval('(' + data.replace('sucesso', '') + ')');
        }
      } else {
        throw 'dey erro ' + data;

        // return -1;
      }
    } catch (Err) {
      //alert("problema ao rodar transacao ou eval " + Err);
      throw 'problema ao rodar transacao ou eval ' + Err;
    }
  }

  static cifrar(random) {
    var numeros = '0123456789';
    var numeroSessao = '';

    var numero = random + '';
    numero = numero.replace(/-/g, '');

    var valores = numero.split('');

    for (var i = 0; i < valores.length; i++) {
      var index = numeros.indexOf(valores[i]) + 3;
      if (numeros.length <= index) {
        index = index - numeros.length;
      }

      var v = numeros.charCodeAt(index);
      var valor = v - 0;
      valor =
        (valor * parseInt(valores[0]) * parseInt(valores[3])) /
        parseInt(valores[valores.length - 1]);

      valor = Math.floor(valor);

      numeroSessao = numeroSessao + valor;
    }

    return numeroSessao;
  }

  static strigToDateIso(dataString: String) {
    return new Date(Date.parse(dataString + ''));
  }

  static stringToDateIso(dataString: String) {
    return new Date(Date.parse(dataString + ''));
  }

  static dateToStringIso(data: Date) {
    try {
      if (data != null) return data.toISOString();
      else return null;
    } catch (err) {
      return null;
    }
  }

  static stringToDate(dataString: String) {
    //RECEBER STRING NO FORMATO DD/MM/YYYY
    try {
      if (dataString.indexOf('-') > 0) {
      } else {
        var parts = dataString.split('/');
        var mydate = new Date(
          parseInt(parts[2]),
          parseInt(parts[1]) - 1,
          parseInt(parts[0])
        );

        return mydate;
      }
    } catch (e) {
      console.log(e);
    }
  }

  static dateToString(data: Date) {
    //RECEBER DATE

    if (typeof data === 'string') data = new Date(data);
    try {
      if (data != null) {
        var dia = data.getDate();
        var mes = data.getMonth() + 1;
        var ano = data.getFullYear();

        var sdia = dia + '';
        var smes = mes + '';

        if (dia < 10) {
          sdia = '0' + sdia;
        }
        if (mes < 10) {
          smes = '0' + smes;
        }

        var dataFormatada = sdia + '/' + smes + '/' + ano;

        return dataFormatada;
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  static stringToMoeda(moedaString: String) {
    // RECEBER STRING VALOR NO FORMATO "2.000,00"
    try {
      var valor = replaceAll(replaceAll(moedaString, '.', ''), ',', '.');
      return parseFloat(valor);
    } catch (e) {
      console.log(e);
    }
  }

  static moedaToString(valor: number) {
    try {
      return valor.toLocaleString('pt-br', { minimumFractionDigits: 2 });
      // let val = valor.toString().replace(/\D/g,"");
      // val = val.toString().replace(/(\d)(\d{8})$/,"$1.$2");
      // val = val.toString().replace(/(\d)(\d{5})$/,"$1.$2");
      // val = val.toString().replace(/(\d)(\d{2})$/,"$1,$2");

      // return val;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  static intToString(valor: number) {
    try {
      return valor.toLocaleString('pt-br', { minimumFractionDigits: 0 });
      // let val = valor.toString().replace(/\D/g,"");
      // val = val.toString().replace(/(\d)(\d{8})$/,"$1.$2");
      // val = val.toString().replace(/(\d)(\d{5})$/,"$1.$2");
      // val = val.toString().replace(/(\d)(\d{2})$/,"$1,$2");

      // return val;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  static criaCgiFromSpan(_280) {
    var campos = null;

    if (_280['mygridDetail'] != null) {
      campos = new Array();
      for (var x = 0; x < _280['mygridDetail'].length; x++) {
        campos = campos.concat(_280['mygridDetail'][x].campos);
        campos.push(_280['mygridDetail'][x].campoAcao);
      }
    }

    var camposForm = new Array();
    var lcamposform = _280.getElementsByTagName('INPUT');

    for (let y = 0; y < lcamposform.length; y++) {
      camposForm.push(lcamposform[y]);
    }

    lcamposform = _280.getElementsByTagName('TEXTAREA');

    for (let y = 0; y < lcamposform.length; y++) {
      camposForm.push(lcamposform[y]);
    }

    lcamposform = _280.getElementsByTagName('SELECT');

    for (let y = 0; y < lcamposform.length; y++) {
      camposForm.push(lcamposform[y]);
    }

    _280.elements = camposForm;

    var _284 = [];
    for (var i = 0; i < _280.elements.length; i++) {
      var elm = _280.elements[i];
      var name = escape(elm.name);

      if (
        name != null &&
        (campos == null || Mentor.achaCampoCampos(name, campos))
      ) {
        var type = elm.type.toLowerCase();
        if (type == 'select-multiple') {
          var qtSelMultipleSelected = 0;
          for (var j = 0; j < elm.options.length; j++) {
            if (elm.options[j].selected) {
              if (qtSelMultipleSelected == 0) {
                _284.push(name + '=' + elm.options[j].value);
              } else
                _284[_284.length - 1] =
                  _284[_284.length - 1] + (', ' + elm.options[j].value);

              qtSelMultipleSelected++;
            }
          }
        } else {
          if (type == 'radio' || type == 'checkbox') {
            if (elm.checked) {
              if (elm.value == 'on') elm.value = '1';
              _284.push(name + '=' + escape(elm.value));
            } else {
              if (type == 'checkbox') {
                _284.push(name + '=');
              }
            }
          } else {
            _284.push(name + '=' + escape(elm.value));
          }
        }
      }
    }

    let palavra = _284.join('&') + '&';

    return palavra;
  }

  static achaCampoCampos(nome, arr) {
    for (var x = 0; x < arr.length; x++) if (nome == arr[x]) return true;
    return false;
  }

  static rodaVisaoFromForm(id, visao) {
    let param = Mentor.criaCgiFromSpan(document.getElementById(id));
    return Mentor.executaVisao(visao, param);
  }

  static rodaTransacaoFromForm(id, transacao) {
    let param = Mentor.criaCgiFromSpan(document.getElementById(id));
    return Mentor.executaTransacao(transacao, param);
  }

  static replacer(key: string, value) {
    if (key.indexOf('Formatado') > 1) return undefined;
    else return value;
  }

  static rodaTransacaoFromObjeto(
    transacao,
    nomeCampo,
    objetos,
    trataRetorno: boolean
  ) {
    //this.UrlRequest = "http://10.10.0.36:8081/assistenciaSocial/";

    var palavra = JSON.stringify(objetos, Mentor.replacer);

    if (typeof trataRetorno != 'undefined' && !trataRetorno)
      nomeCampo = 'mentorIgnoraRetorno=1&' + nomeCampo;

    return Mentor.executaTransacaoModulo(
      null,
      transacao,
      nomeCampo + '=' + palavra + ''
    );
  }

  // codigo zip

  public baseReverseDic = {};

  public getBaseValue(alphabet, character) {
    if (!this.baseReverseDic[alphabet]) {
      this.baseReverseDic[alphabet] = {};
      for (var i = 0; i < alphabet.length; i++) {
        this.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return this.baseReverseDic[alphabet][character];
  }

  public _decompress(length, resetValue, getNextValue) {
    var dictionary = [],
      next,
      enlargeIn = 4,
      dictSize = 4,
      numBits = 3,
      entry = '',
      result = [],
      i,
      w,
      bits,
      resb,
      maxpower,
      power,
      c,
      data = { val: getNextValue(0), position: resetValue, index: 1 };

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch ((next = bits)) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        c = f(bits);
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        c = f(bits);
        break;
      case 2:
        return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return '';
      }

      bits = 0;
      maxpower = Math.pow(2, numBits);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch ((c = bits)) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
    }
  }

  public decompress(compressed) {
    if (compressed == null) return '';
    if (compressed == '') return null;
    return this._decompress(compressed.length, 32768, function (index) {
      return compressed.charCodeAt(index);
    });
  }

  public _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    var i,
      value,
      context_dictionary = {},
      context_dictionaryToCreate = {},
      context_c = '',
      context_wc = '',
      context_w = '',
      context_enlargeIn = 2, // Compensate for the first entry which should not count
      context_dictSize = 3,
      context_numBits = 2,
      context_data = [],
      context_data_val = 0,
      context_data_position = 0,
      ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (
        !Object.prototype.hasOwnProperty.call(context_dictionary, context_c)
      ) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (
        Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)
      ) {
        context_w = context_wc;
      } else {
        if (
          Object.prototype.hasOwnProperty.call(
            context_dictionaryToCreate,
            context_w
          )
        ) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== '') {
      if (
        Object.prototype.hasOwnProperty.call(
          context_dictionaryToCreate,
          context_w
        )
      ) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i = 0; i < context_numBits; i++) {
      context_data_val = (context_data_val << 1) | (value & 1);
      if (context_data_position == bitsPerChar - 1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = context_data_val << 1;
      if (context_data_position == bitsPerChar - 1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      } else context_data_position++;
    }
    return context_data.join('');
  }

  public compressToBase64(input) {
    if (input == null) return '';
    var res = this._compress(input, 6, function (a) {
      return keyStrBase64.charAt(a);
    });
    switch (
      res.length % 4 // To produce valid Base64
    ) {
      default: // When could this happen ?
      case 0:
        return res;
      case 1:
        return res + '===';
      case 2:
        return res + '==';
      case 3:
        return res + '=';
    }
  }

  public decompressFromBase64(input) {
    if (input == null) return '';
    if (input == '') return null;
    return this._decompress(input.length, 32, function (index) {
      return this.getBaseValue(keyStrBase64, input.charAt(index));
    });
  }

  public compressToUTF16(input) {
    if (input == null) return '';
    return (
      this._compress(input, 15, function (a) {
        if (f(a + 32) == '&') return '&';
        return f(a + 32);
      }) + ' '
    );
  }

  public decompressFromUTF16(compressed) {
    if (compressed == null) return '';
    if (compressed == '') return null;
    return this._decompress(compressed.length, 16384, function (index) {
      return compressed.charCodeAt(index) - 32;
    });
  }

  //compress into uint8array (UCS-2 big endian format)
  public compressToUint8Array(uncompressed) {
    var compressed = this.compress(uncompressed);
    var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

    for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i * 2] = current_value >>> 8;
      buf[i * 2 + 1] = current_value % 256;
    }
    return buf;
  }

  //decompress from uint8array (UCS-2 big endian format)
  public decompressFromUint8Array(compressed) {
    if (compressed === null || compressed === undefined) {
      return this.decompress(compressed);
    } else {
      var buf = new Array(compressed.length / 2); // 2 bytes per character
      for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
        buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
      }

      var result = [];
      buf.forEach(function (c) {
        result.push(f(c));
      });
      return this.decompress(result.join(''));
    }
  }

  //compress into a string that is already URI encoded
  public compressToEncodedURIComponent(input) {
    if (input == null) return '';
    return this._compress(input, 6, function (a) {
      return keyStrUriSafe.charAt(a);
    });
  }

  //decompress from an output of compressToEncodedURIComponent
  public decompressFromEncodedURIComponent(input) {
    if (input == null) return '';
    if (input == '') return null;
    input = input.replace(/ /g, '+');
    return this._decompress(input.length, 32, function (index) {
      return this.getBaseValue(keyStrUriSafe, input.charAt(index));
    });
  }

  public compress(uncompressed) {
    return this._compress(uncompressed, 16, function (a) {
      return f(a);
    });
  }
}
