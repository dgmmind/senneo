export class Message {
    constructor(phone, text) {
        this.phone = phone;
        this.text = text;
        this.timestamp = new Date();
    }

    validate() {
        if (!this.phone || this.phone.trim() === '') {
            throw new Error('El número de teléfono es requerido');
        }
        if (!this.text || this.text.trim() === '') {
            throw new Error('El mensaje es requerido');
        }
        return true;
    }

    getFormattedPhone() {
        return this.phone.includes("@s.whatsapp.net") 
            ? this.phone 
            : `${this.phone}@s.whatsapp.net`;
    }
} 