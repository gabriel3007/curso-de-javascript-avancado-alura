class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia');

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto');
    }

    importaNegociacoes(){
        NegociacaoService.obterNegociacoesDaSemana((err, negociacoes) => {
            if(err){
                this._mensagem.texto = err;
                return;
            }
            negociacoes.forEach(n => this._listaNegociacoes.adiciona(n));
            this._mensagem.texto = 'Negociações importadas com sucesso';
        });    
    }
    
    adiciona(event) {
        event.preventDefault();
        let negociacao = this._criaNegociacao();
        NegociacaoService.enviaNegociacao(negociacao, err => {
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