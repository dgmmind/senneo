import { MessageRepository } from '../../domain/repositories/MessageRepository.js';

export class BaileysMessageRepository extends MessageRepository {
    constructor(baileyClient) {
        super();
        this.baileyClient = baileyClient;
    }

    async sendMessage(message) {
        try {
            const phoneNumber = message.getFormattedPhone();
            
            // Crear mensaje único solo con ID corto
            const id = this.generateShortId();
            
            const uniqueMessage = `${message.text}\n\nID: ${id}`;
            
            await this.baileyClient.client.sendMessage(phoneNumber, { text: uniqueMessage });
            console.log("Mensaje enviado exitosamente a", phoneNumber);
            console.log("🆔 ID único:", id);
            return true;
        } catch (error) {
            console.log("Error al enviar mensaje:", error);
            throw new Error(`Error al enviar mensaje: ${error.message}`);
        }
    }

    async isConnected() {
        return this.baileyClient.client && this.baileyClient.connectionStatus === "open";
    }

    // Generar ID largo con letras mayúsculas y números
    generateShortId() {
        const chars = 'ABCDEFGHIKLMNORSTUVWXYZ0123456789'; // Sin G,J,P,Q,Y,L que suben/bajan
        let id = '';
        for (let i = 0; i < 17; i++) { // Aumentado a 17 caracteres
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
} 