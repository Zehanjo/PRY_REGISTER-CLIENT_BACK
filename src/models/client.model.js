class ClientModel {
    constructor(element){
        this.name = element.name,
        this.lastname = element.lastname,
        this.mail = element.mail,
        this.phone = element.phone,
        this.dni_ruc = element.dni_ruc ?? 'null',
        this.address = element.address
    }
}

module.exports = ClientModel;