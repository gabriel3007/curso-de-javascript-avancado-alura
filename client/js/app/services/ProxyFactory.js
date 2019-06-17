class ProxyFactory{

    constructor(){
        throw new Error('Esta classe não pode ser instanciada');
    }

    static create(model, props, method) {
        return new Proxy(model, {
            get(target, prop, receiver){
                if(props.includes(prop) && ProxyFactory._isMethod(target[prop])){
                    return function(){
                        let retorno = Reflect.apply(target[prop], target, arguments);
                        method(target);
                        return retorno;
                    }
                }
                return Reflect.get(target, prop, receiver);
            }, 
            set(target, prop, value, receiver){
                let retorno = Reflect.set(target, prop, value, receiver);
                if(props.includes(prop)) method(target);
                return retorno;
            }
        });
    }

    static _isMethod(method){
        return typeof(method) == typeof(Function);
    }
}