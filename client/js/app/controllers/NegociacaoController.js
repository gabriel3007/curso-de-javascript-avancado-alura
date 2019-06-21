class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._negociacaoService = new NegociacaoService();

        this._ordemAtual = '';

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto');
    }

    importaNegociacoes(){
        this._negociacaoService.obterNegociacoes()
            .then(negociacoes =>{
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações obtidas com sucesso';
            })
            .catch(err => this._mensagem.texto = err);
    }
    
    adiciona(event) {
        event.preventDefault();
        let negociacao = this._criaNegociacao();
        this._negociacaoService.enviaNegociacao(negociacao, err => {
            if(err){
                this._mensagem.texto = err;
                // Servidor não está recebendo o request
                //return;
            }
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = 'Negociação adicionada com sucesso';        
            this._limpaFormulario();   
        } );
    }

    apaga() {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociação apagadas com sucesso';
    }

    ordena(coluna){
        if(this._ordemAtual == coluna){
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    _criaNegociacao() {
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);    
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
}