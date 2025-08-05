export class MessageController {
    constructor(sendMessageUseCase) {
        this.sendMessageUseCase = sendMessageUseCase;
    }

    async sendMessage(req, res) {
        try {
            const { phone, text } = req.body;

            if (!phone || !text) {
                return res.status(400).json({
                    success: false,
                    message: 'El número de teléfono y el mensaje son requeridos'
                });
            }

            const result = await this.sendMessageUseCase.execute(phone, text);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    async getStatus(req, res) {
        try {
            const isConnected = await this.sendMessageUseCase.messageRepository.isConnected();
            return res.status(200).json({
                success: true,
                connected: isConnected,
                message: isConnected ? 'Cliente conectado' : 'Cliente desconectado'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el estado',
                error: error.message
            });
        }
    }
} 