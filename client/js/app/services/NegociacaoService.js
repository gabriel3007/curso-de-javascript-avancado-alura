class NegociacaoService{

    static obterNegociacoesDaSemana(callback){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'negociacoes/semana');
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    callback(null, JSON.parse(xhr.responseText)
                        .map(model => new Negociacao(new Date(model.data), model.quantidade, model.valor)));
                } else {
                    console.log(xhr.responseText);
                    callback('Não foi possível obter as negociações da semana', null)
                }
            }
        }
        xhr.send();
    }

    static enviaNegociacao(negociacao, callback){
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