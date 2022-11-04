const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// Load env vars
dotenv.config({ path: './config/.env' });


// Connect to database
connectDB();
const app = express();

app.use(cors())


// Route files
const auth = require('./routes/Auth');


// Body parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

//app.use(logger)



// Mount routers
app.use('/auth', auth);


const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running on port ${PORT}`)
    );

