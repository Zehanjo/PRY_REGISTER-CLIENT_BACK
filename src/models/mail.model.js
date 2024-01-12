class MailModel {
    constructor(element){
        this.title = element.title,
        this.message = element.message,
        this.sentDate = element.sentDate
    }
}

module.exports = MailModel;