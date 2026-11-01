require('dotenv').config();

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express');

const db = require('./config/db');
const route = require('./routers');

global.crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// View Engine
app.engine('handlebars', engine({
    extname: '.handlebars',
    partialsDir: [
        path.join(__dirname, 'resource/views/partials'),
        path.join(__dirname, 'resource/views/partials/admin'),
        path.join(__dirname, 'resource/views/partials/user')
    ],
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        sum: (a, b) => a + b,
        eq: (a, b) => a === b,
        formatDate: (date) => {
            if (!date) return '';
        
            return new Date(date).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            });
        }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resource/views'));


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todos API',
      version: '1.0.0',
      description: 'API Quản lý Todos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
 apis: [
    path.resolve(__dirname, 'routers', 'task.js'),
    path.resolve(__dirname, 'routers', 'admin.js'),
    path.resolve(__dirname, 'routers', 'user.js'),
],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

console.log('Swagger paths:', Object.keys(swaggerDocs.paths || {}));
console.log('Swagger tags:', swaggerDocs.tags);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



// Routes
route(app);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});