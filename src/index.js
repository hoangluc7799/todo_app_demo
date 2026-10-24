require('dotenv').config();

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const db = require('./config/db');
const route = require('./routes');

global.crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối Database
db.connect();

// Middleware
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

// Routes
route(app);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});