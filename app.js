import {
    makeWASocket,
    useMultiFileAuthState,
    Browsers,
    DisconnectReason
} from "baileys";

import PINO from "pino";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importar la arquitectura limpia
import { SendMessageUseCase } from "./src/application/use-cases/SendMessageUseCase.js";
import { BaileysMessageRepository } from "./src/infrastructure/repositories/BaileysMessageRepository.js";
import { MessageController } from "./src/infrastructure/controllers/MessageController.js";
import { createMessageRoutes } from "./src/infrastructure/routes/messageRoutes.js";
import { AuthService } from "./src/infrastructure/services/AuthService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BaileyClient {
    constructor() {
        this.DIR_SESSION = `Sessions/auth`;
        this.connectionStatus = "close";
        this.authService = new AuthService(this.DIR_SESSION);
    }
    
    async connect() {
        try {
            // Verificar si ya está autenticado
            const isAuthenticated = await this.authService.checkAuthStatus();
            
            if (isAuthenticated) {
                console.log("🔐 Sesión encontrada, cargando autenticación...");
            } else {
                console.log("🔐 No hay sesión activa, necesitas escanear el QR");
            }

            const { state, saveCreds } = await useMultiFileAuthState(this.DIR_SESSION);
            this.client = makeWASocket({
                auth: state,
                browser: Browsers.windows("Desktop"),
                syncFullHistory: false,
                logger: PINO({ level: "error" }),
            });

            this.client.ev.on("creds.update", saveCreds);
            this.client.ev.on("connection.update", this.handleConnectionUpdate);
        } catch (error) {
            console.log("Ha ocurrido un error", error);
        }
    }

    handleConnectionUpdate = async (update) => {
        try {
            const { connection, lastDisconnect, qr } = update;
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            // Usar el servicio de autenticación para manejar el QR
            await this.authService.handleConnectionUpdate(update);

            if (connection === "close") {
                this.connectionStatus = "close";
                if (statusCode !== DisconnectReason.loggedOut) {
                    await this.connect();
                }

                if (statusCode === DisconnectReason.loggedOut) {
                    console.log("Reiniciar bailey");
                    await this.connect();
                }
            }

            if (connection === "open") {
                console.log("Bailey conectado...");
                this.connectionStatus = "open";
                
                // Enviar mensaje automáticamente al iniciar
                //await this.sendInitialMessage();
            }
        } catch (error) {
            console.log("Ha ocurrido un error, reinicie o verifique su conexión a internet");
        }
    }

    async sendInitialMessage() {
        try {
            const phoneNumber = "50495698991@s.whatsapp.net";
            const id = this.generateShortId();
            
            const message = `Hola, este es un mensaje automático enviado al iniciar la aplicación.\n\nID: ${id}`;
            
            await this.client.sendMessage(phoneNumber, { text: message });
            console.log("Mensaje inicial enviado exitosamente a", phoneNumber);
            console.log("🆔 ID único:", id);
        } catch (error) {
            console.log("Error al enviar mensaje inicial:", error);
        }
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

// Configurar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos de node_modules para librerías del frontend
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Crear instancia de BaileyClient
const bailey = new BaileyClient();

// Configurar la arquitectura limpia
const messageRepository = new BaileysMessageRepository(bailey);
const sendMessageUseCase = new SendMessageUseCase(messageRepository);
const messageController = new MessageController(sendMessageUseCase);

// Configurar rutas
app.use('/api', createMessageRoutes(messageController, bailey.authService));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de autenticación
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Ruta de autenticación (alternativa)
app.get('/auth.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📱 Interfaz web disponible en http://localhost:${PORT}`);
});

// Conectar Bailey
bailey.connect().then(() => {
    console.log("✅ Bailey iniciado correctamente");
}).catch((error) => {
    console.log("❌ Error al iniciar Bailey:", error);
});


