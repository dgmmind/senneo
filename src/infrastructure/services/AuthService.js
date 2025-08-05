import { useMultiFileAuthState } from "baileys";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

export class AuthService {
    constructor(sessionDir = "Sessions/auth") {
        this.sessionDir = sessionDir;
        this.isAuthenticated = false;
        this.qrShown = false;
        this.currentQR = null; // Almacenar el QR actual
    }

    async checkAuthStatus() {
        try {
            // Verificar si existen archivos de sesión
            const sessionFiles = await this.getSessionFiles();
            return sessionFiles.length > 0;
        } catch (error) {
            console.log("Error verificando estado de autenticación:", error);
            return false;
        }
    }

    async getSessionFiles() {
        try {
            if (!fs.existsSync(this.sessionDir)) {
                return [];
            }
            
            const files = fs.readdirSync(this.sessionDir);
            return files.filter(file => 
                file.endsWith('.json') || 
                file.endsWith('.creds') || 
                file.includes('session')
            );
        } catch (error) {
            return [];
        }
    }

    async handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;

        // Almacenar y mostrar QR solo si no se ha mostrado antes y existe
        if (qr && !this.qrShown) {
            this.currentQR = qr; // Almacenar el QR para la API
            console.log("\n🔐 ESCANEA EL CÓDIGO QR PARA AUTENTICARTE:");
            console.log("=".repeat(50));
            qrcode.generate(qr, { small: true });
            console.log("=".repeat(50));
            this.qrShown = true;
        }

        if (connection === "open") {
            this.isAuthenticated = true;
            this.qrShown = false; // Reset para futuras reconexiones
            this.currentQR = null; // Limpiar QR cuando se conecta
            console.log("✅ WhatsApp autenticado exitosamente!");
        }

        if (connection === "close") {
            this.isAuthenticated = false;
            console.log("❌ Conexión cerrada, intentando reconectar...");
        }
    }

    // Método para obtener el QR actual
    getCurrentQR() {
        return this.currentQR;
    }

    async clearSession() {
        try {
            if (fs.existsSync(this.sessionDir)) {
                const files = await this.getSessionFiles();
                for (const file of files) {
                    fs.unlinkSync(path.join(this.sessionDir, file));
                }
                console.log("🗑️ Sesión eliminada exitosamente");
                return true;
            }
        } catch (error) {
            console.log("Error eliminando sesión:", error);
            return false;
        }
    }

    getAuthState() {
        return {
            isAuthenticated: this.isAuthenticated,
            qrShown: this.qrShown,
            sessionDir: this.sessionDir,
            hasQR: this.currentQR !== null
        };
    }
} 