import { Message } from '../../domain/entities/Message.js';

export class SendMessageUseCase {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }

    async execute(phone, text) {
        try {
            // Crear y validar el mensaje
            const message = new Message(phone, text);
            message.validate();

            // Verificar si el cliente está conectado
            const isConnected = await this.messageRepository.isConnected();
            if (!isConnected) {
                throw new Error('El cliente de WhatsApp no está conectado');
            }

            // Enviar el mensaje
            const result = await this.messageRepository.sendMessage(message);
            
            return {
                success: true,
                message: 'Mensaje enviado exitosamente',
                data: {
                    phone: message.phone,
                    timestamp: message.timestamp
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }
} 