# Práctica 3 - CRUD Node.js con MySQL

Aplicación web fullstack para gestión de pacientes con operaciones CRUD completas.

## 🚀 Demo en vivo

### Aplicación Web Completa (Railway)
**[Ver aplicación web](https://crudnodejs-production-079d.up.railway.app/)**
- ✅ Interfaz visual con formularios
- ✅ Templates EJS
- ✅ CRUD completo visual
- ✅ Bootstrap styling

### API REST (Vercel)  
**[Ver API endpoints](https://tu-url-vercel.vercel.app/api/)**
- ✅ Endpoints JSON
- ✅ Serverless functions
- ✅ Mismo database que Railway

## 🛠 Tecnologías utilizadas
- **Backend**: Node.js + Express
- **Base de datos**: MySQL (compartida)
- **Frontend**: EJS + Bootstrap
- **API**: Serverless Functions
- **Despliegue**: Railway (Web App) + Vercel (API)

## ⚡ Funcionalidades

### En Railway (Interfaz Web):
- ✅ Página principal con lista de pacientes
- ✅ Formulario para agregar pacientes
- ✅ Editar pacientes existentes
- ✅ Eliminar pacientes
- ✅ Interfaz responsive

### En Vercel (API):
- ✅ `GET /api/` - Información de la API
- ✅ `GET /api/test` - Test de conexión
- ✅ `GET /api/init-pacientes` - Inicializar BD
- ✅ `GET /api/pacientes` - Listar pacientes (JSON)
- ✅ `POST /api/pacientes` - Crear paciente (JSON)

## 🚀 Uso

### Para usuarios finales:
**Usa Railway**: [https://crudnodejs-production-079d.up.railway.app/](https://crudnodejs-production-079d.up.railway.app/)

### Para desarrolladores (API):
**Usa Vercel**: [https://tu-url-vercel.vercel.app/api/](https://tu-url-vercel.vercel.app/api/)

## 🗄️ Base de datos
- **MySQL en Railway** (compartida entre ambas plataformas)
- **Tabla**: `pacientes`
- **Campos**: id, nombre, apellido, edad, talla, peso, sexo

## 👨‍💻 Desarrollado por
José Zavala - Web III

## 📱 Arquitectura
```
┌─────────────────┐    ┌─────────────────┐
│     Railway     │    │     Vercel      │
│   (Web Visual)  │    │   (API REST)    │
│                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │    EJS    │  │    │  │ Functions │  │
│  │ Templates │  │    │  │    JSON   │  │
│  └───────────┘  │    │  └───────────┘  │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
              ┌─────────────┐
              │   MySQL     │
              │  Database   │
              │ (Railway)   │
              └─────────────┘
```
