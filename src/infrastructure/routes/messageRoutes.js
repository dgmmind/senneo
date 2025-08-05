import express from 'express';

export function createMessageRoutes(messageController, authService) {
    const router = express.Router();

    // Ruta para enviar mensaje
    router.post('/send', async (req, res) => {
        await messageController.sendMessage(req, res);
    });

    // Ruta para obtener el estado de conexión
    router.get('/status', async (req, res) => {
        await messageController.getStatus(req, res);
    });

    // Ruta para obtener el QR code
    router.get('/auth/qr', async (req, res) => {
        try {
            const qr = authService.getCurrentQR();
            const authState = authService.getAuthState();
            
            if (qr) {
                res.json({
                    success: true,
                    qr: qr,
                    hasQR: true,
                    isAuthenticated: authState.isAuthenticated
                });
            } else {
                res.json({
                    success: true,
                    qr: null,
                    hasQR: false,
                    isAuthenticated: authState.isAuthenticated
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener QR code',
                error: error.message
            });
        }
    });

    // Ruta para limpiar sesión
    router.post('/auth/clear', async (req, res) => {
        try {
            const success = await authService.clearSession();
            if (success) {
                res.json({
                    success: true,
                    message: 'Sesión eliminada exitosamente. Reinicia la aplicación para escanear QR nuevamente.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar la sesión'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    });

    // Ruta para obtener estado de autenticación
    router.get('/auth/status', async (req, res) => {
        try {
            const authState = authService.getAuthState();
            const hasSession = await authService.checkAuthStatus();
            
            res.json({
                success: true,
                isAuthenticated: authState.isAuthenticated,
                hasSession: hasSession,
                qrShown: authState.qrShown
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener estado de autenticación',
                error: error.message
            });
        }
    });

    return router;
} 