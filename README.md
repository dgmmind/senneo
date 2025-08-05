# Senneo - Enviador de Mensajes WhatsApp

Una aplicación web minimalista para enviar mensajes de WhatsApp usando Baileys JS con arquitectura limpia.

## 🚀 Características

- ✅ **Interfaz web minimalista** con diseño moderno
- ✅ **Soporte para emojis** con selector integrado
- ✅ **Arquitectura limpia** (Clean Architecture)
- ✅ **API REST** para envío de mensajes
- ✅ **Verificación de conexión** en tiempo real
- ✅ **Mensaje automático** al iniciar la aplicación
- ✅ **Contador de caracteres** en tiempo real

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/dgmmind/senneo.git
cd senneo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar la aplicación**
```bash
npm start
```

## 🎯 Uso

### Interfaz Web
1. Abre tu navegador y ve a `http://localhost:3000`
2. Escanea el código QR que aparece en la consola
3. Una vez conectado, podrás enviar mensajes desde la interfaz web

### API REST

#### Enviar mensaje
```bash
POST /api/send
Content-Type: application/json

{
  "phone": "50495698991",
  "text": "Hola! 👋"
}
```

#### Verificar estado de conexión
```bash
GET /api/status
```

## 🏗️ Arquitectura

La aplicación sigue los principios de **Clean Architecture**:

```
src/
├── domain/           # Entidades y reglas de negocio
│   ├── entities/     # Entidades del dominio
│   └── repositories/ # Interfaces de repositorios
├── application/      # Casos de uso
│   └── use-cases/    # Lógica de aplicación
└── infrastructure/   # Implementaciones externas
    ├── controllers/  # Controladores HTTP
    ├── repositories/ # Implementaciones de repositorios
    └── routes/       # Rutas de la API
```

## 📱 Funcionalidades

### Interfaz Web
- **Diseño minimalista** con gradientes modernos
- **Selector de emojis** integrado
- **Contador de caracteres** en tiempo real
- **Indicador de conexión** con estados visuales
- **Mensajes de feedback** para el usuario

### API
- **Envío de mensajes** vía HTTP
- **Verificación de estado** de conexión
- **Validación de datos** en el servidor
- **Manejo de errores** robusto

## 🔧 Configuración

### Variables de entorno
```bash
PORT=3000  # Puerto del servidor (opcional)
```

### Mensaje automático
El mensaje que se envía automáticamente al iniciar se puede modificar en `app.js`:

```javascript
const message = "Tu mensaje personalizado aquí";
```

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, Baileys
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Arquitectura**: Clean Architecture
- **Estilo**: Minimalista con gradientes modernos

## 📞 Soporte

Si tienes problemas o preguntas, abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando Clean Architecture**
