export class MessageRepository {
    async sendMessage(message) {
        throw new Error('sendMessage method must be implemented');
    }

    async isConnected() {
        throw new Error('isConnected method must be implemented');
    }
} 