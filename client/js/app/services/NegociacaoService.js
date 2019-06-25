class NegociacaoService{

    constructor(){
        this._HttpService = new  HttpService();
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação');
            });
    }

    lista(){
        return ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações');
            })
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(con => new NegociacaoDao(con))
            .then(dao => dao.apagaTodos())
            .catch(erro => {
               console.log(erro);
               throw new Error('Não foi possível apagar as negociações');
            })
    }

    importa(listaAtual){
        return  this._obterNegociacoes()
            .then(negociacoes => negociacoes.filter(negociacao => 
                !listaAtual.some(negociacaoExistente => 
                   negociacao.equals(negociacaoExistente)))
            ).catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível importar as negociações');
            })
    }

    _obterNegociacoes(){
        return Promise.all([
            this._obterNegociacoesDaSemana(),
            this._obterNegociacoesDaSemanaAnterior(),
            this._obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {
            let negociacoes = periodos.reduce((dados, periodo) => dados.concat(periodo), []);
            return negociacoes;
        }).catch( err => {
            throw new Error(err);
        })
    }

    _obterNegociacoesDaSemana(){
        return new Promise((resolve, reject) => {
            this._HttpService.get('negociacoes/semana')
                .then(
                    negociacoes => {
                        resolve(negociacoes.map(model =>
                             new Negociacao(new Date(model.data), model.quantidade, model.valor)))
                    }
                )
                .catch(() => 
                    reject('Não foi possível obter as negociações da semana')
                );
         });
    }

    _obterNegociacoesDaSemanaAnterior(){
        return new Promise((resolve, reject) => {
            this._HttpService.get('negociacoes/anterior')
                .then(negociacoes => {
                    resolve(negociacoes.map(model => 
                        new Negociacao(new Date(model.data), model.quantidade, model.valor)))
                    }
                )
                .catch(() => {
                    reject('Não foi possível obter as negociações da semana retrasada');
                })
        });
    }

    _obterNegociacoesDaSemanaRetrasada(){
        return new Promise((resolve, reject) => {
            this._HttpService.get('negociacoes/semana')
                .then(
                    negociacoes => {
                        resolve(negociacoes.map(model =>
                             new Negociacao(new Date(model.data), model.quantidade, model.valor)));
                    }
                )
                .catch(() =>{
                    reject('Não foi possível obter as negociações da semana retrasada');
                } );
        });
    }

    enviaNegociacao(negociacao, callback){
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/negociacoes", true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = () => {
            if(xhr.readyState ==  4){
                if(xhr.status == 200){
                    callback(null)
                } else { 
                    callback('Não foi possível enviar a negociação');
                }
            }
        }
        xhr.send(JSON.stringify(negociacao));
    }
}