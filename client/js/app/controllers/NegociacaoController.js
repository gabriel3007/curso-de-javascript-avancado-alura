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

        ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.listaTodos())
            .then(negociacoes => {
                negociacoes.forEach(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao);
                });
            }).catch(err => this._mensagem.texto = err);
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
        ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.adiciona(negociacao))
            .then(() => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociação adicionada com sucesso';        
                this._limpaFormulario();})
            .catch(err => this._mensagem.texto = err);
    }

    apaga() {
        ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.apagaTodos())
            .then(msg => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = msg;
            }).catch(err => this._mensagem.texto = err);
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
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value));    
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
}