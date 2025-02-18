require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const puppeteer = require('puppeteer');
const {json} = require("express");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express()
const port = 3000

app.use(express.json({ limit: '10mb' }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const IMAGE_DIR = path.join(__dirname, 'images');
function saveImage(base64) {
    try {
        const buffer = Buffer.from(base64, 'base64');
        const fileName = `${crypto.randomUUID()}.png`;
        const filePath = path.join(IMAGE_DIR, fileName);

        fs.writeFileSync(filePath, buffer);
        return fileName;
    } catch (error) {
        throw new Error('Error saving image: ' + error.message);
    }
}
function getImage(fileName) {
    try {
        const filePath = path.join(IMAGE_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const imageBuffer = fs.readFileSync(filePath);
        return imageBuffer.toString('base64');
    } catch (error) {
        throw new Error('Error retrieving image: ' + error.message);
    }
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getUser = async (username) => {
    try {
        const sql = "SELECT * FROM users WHERE name = ?";
        const [rows] = await pool.promise().execute(sql, [username]);
        return rows;
    } catch (err) {
        return 'Database error:' + err;
    }
};
const SaveUser = async (username) => {
    try {
        const sql = "insert into users(name) values (?)";
        const [rows] = await pool.promise().execute(sql, [username]);
        return rows;
    } catch (err) {
        return 'Database error:' + err;
    }
};
const checkUser = async (username, password) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://strav.nasejidelna.cz/0341/login';

    await page.goto(url);
    await page.type('#j_username', username);
    await page.type('#j_password', password);

    await page.click('input[value="Přihlásit"]');
    await delay(2000);

    const result_url = page.url();
    await browser.close();

    const correct_url = 'https://strav.nasejidelna.cz/0341/faces/secured/main.jsp?status=true&printer=&keyboard=&terminal=false'
    if (result_url === correct_url) {
        if ((await getUser(username)).length === 0) {
        await setUser(username)
    }
        return true
    }
    return false
};

const getMenu = async (amount,page,filter) => {

};
const SaveMenu = async () => {};
const getTodayMenu = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const url = 'https://strav.nasejidelna.cz/0341/login';

    await page.goto(url);
    const todayMenu = await page.$('.jidelnicekDen');
    const dateTag = await todayMenu.$$('*');
    const date = (await dateTag[0].evaluate(el => el.id)).slice(4);

    if ((await getMenuDate(date)).length === 0) {
        const lunches = await dateTag[1].$$(':scope > *');

        let menu = [];
        let soup;
        let drink;
        for (let index in lunches) {
            if (index > 3) {
                const lunch = lunches[index]
                let food = (await lunch.$$(':scope > *'))[2]
                const foodText = await food.evaluate(el => {
                    let text = '';
                    for (let node of el.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += node.textContent.trim();
                        }
                    }
                    return text
                });
                food = foodText.split(',');
                soup = food[0].trim();
                food[0] = '';
                drink = food[food.length - 1].trim();
                food[food.length - 1] = '';

                let main = ''
                for (i in food) {
                    main += food[i].trim() + ' '
                }
                menu.push(main.trim())
            }
        }
        menu.push(soup);
        menu.push(drink);
        for (let i in menu) {
                console.log(menu[i]);
            }
        return 1
    }
    return 0
}

const basicAuth = async (req, res, next) => {
    if (req.session.username) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Wrong auth format.' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    try {
        if (await checkUser(username,password)) {
            req.session.username = username;
            return next();
        } else {
            return res.status(401).json({ error: 'Wrong username or password' });
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

app.get('/login', basicAuth, (req, res) => {
  res.json('success');
})

app.get('/menu', async (req, res) => {
    res.json();
})

app.get('/image', async (req, res) => {
    const {file} = req.body;
    res.json(getImage(file));
})

app.post('/image', async (req, res) => {
    const {data} = req.body;
    saveImage(data);
    res.json(1);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})