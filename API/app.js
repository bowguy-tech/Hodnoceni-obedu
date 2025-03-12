require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const puppeteer = require('puppeteer');
const {json} = require("express");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const sharp = require('sharp');
const app = express()
const port = 3001


app.use(express.json({ limit: '10mb' }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(cors());

const IMAGE_DIR = path.join(__dirname, 'images');
function saveImage(base64) {
    if (!base64) return null;
    try {
        const buffer = Buffer.from(base64, 'base64');
        const fileName = `${crypto.randomUUID()}.png`;
        const filePath = path.join(IMAGE_DIR, fileName);

        sharp(buffer)
            .resize({ width: 300 })
            .toFile(filePath, (err, info) => {
                if (err) throw new Error('Error saving image: ' + err.message);
            });

        return fileName;
    } catch (error) {
        throw new Error('Error processing image: ' + error.message);
    }
}
function getImage(fileName) {
    if (!fileName) {
        return null
    }
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

const addDailyMenu = async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['stylesheet', 'image', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });


        const url = 'https://strav.nasejidelna.cz/0341/login';
        await page.goto(url);
        const todayMenu = await page.$('.jidelnicekDen');
        const dateTag = await todayMenu.$$('*');
        const date = (await dateTag[0].evaluate(el => el.id)).slice(4);
        const formattedDate = new Date(date).toISOString().split('T')[0];

        await pool.promise().execute("CALL AddMenu(?)", [formattedDate]);

        const lunches = await dateTag[1].$$(':scope > *');
        let menu = [];

        let soup = null;
        let drink = null;
        for (let index in lunches) {
            if (index > 3) {
                const lunch = lunches[index];
                let food = (await lunch.$$(':scope > *'))[2];

                const foodText = await food.evaluate(el => {
                    let text = '';
                    for (let node of el.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            text += node.textContent.trim();
                        }
                    }
                    return text;
                });

                let foods = foodText.split(',');
                soup = foods.shift().trim();
                drink = foods.pop().trim();
                for (let ij in foods) {
                    foods[ij] = foods[ij].trim()
                }
                let mainCourse = foods.join(' ').trim();
                menu.push({ name: mainCourse, type: 'Main Course', description: mainCourse });
            }
        }
        if (soup) {
            menu.push({ name: soup, type: 'Soup', description: soup });
        }
        if (drink) {
            menu.push({ name: drink, type: 'Drink', description: drink });
        }
        for (let item of menu) {
            await pool.promise().execute("CALL AddItemToMenu(?, ?, ?, ?)", [item.name, item.type, item.description, formattedDate]);
        }
        await browser.close();
    } catch (err) {
    } finally {
        await browser.close();
    }

};
let lastRunDate = null;
const scheduleDailyMenu = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastRunDate !== today) {
        try{
            await addDailyMenu();
        } catch (err) {

        }
        lastRunDate = today;
        console.log(`Daily menu added for ${today}`);
    }
};
setInterval(scheduleDailyMenu, 24 * 60 * 60 * 1000);
try {scheduleDailyMenu();} catch {}

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

    await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['stylesheet', 'image', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

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
        await SaveUser(username)
    }
        return true
    }
    return false
};

const basicAuth = async (req, res, next) => {
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

app.get('/admin', basicAuth, async (req, res) => {
    const username = req.session.username;
    const isadmin = await pool.promise().execute("CALL isAdmin(?)", [username]);
    res.status(200).json(isadmin[0][0][0]['admin']);
})

app.get('/login', basicAuth, (req, res) => {
  res.json('success');
})

app.get('/menu', basicAuth, async (req, res) => {
    try {
        const username = req.session.username;

        let { page, limit, filter} = req.query;
        console.log(filter);
        let offset = (page - 1) * limit;
        const resp = await pool.promise().execute("CALL getMenu(?, ?, ?, ?)", [username, limit, offset, filter]);

        let menuData = resp[0][0]; // Extract the relevant data array
        let groupedMenu = {};

        // Grouping the menu by date
        menuData.forEach(item => {
            let dateKey = new Date(item.date).toLocaleDateString("cs-CZ");
            if (!groupedMenu[dateKey]) {
                groupedMenu[dateKey] = [];
            }
            groupedMenu[dateKey].push({
                id: item.id,
                name: item.name,
                type: item.type,
                description: item.description,
                image: getImage(item.images),
                hasRated: item.has_rated
            });
        });

        res.json(groupedMenu);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/item', basicAuth, async (req, res) => {
    let {id} = req.query;
    const [resp] = await pool.promise().execute("CALL getItem(?)", [id]);
    res.json(resp[0]);
})

app.get('/feedback', basicAuth, async (req, res) => {
    try {
        const [rows] = await pool.promise().query("CALL GetFeedback()");
        for (let feedback of rows[0]) {
            if (feedback.image) {
                try {
                    feedback.image = getImage(feedback.image);
                } catch (error) {
                    feedback.image = null;
                }
            }
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/feedback', basicAuth, async (req, res) => {
    try {
        const {title, description, image, rating} = req.body;
        const username = req.session.username;
        if (!username || !title || !description || rating == null) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const imageName = saveImage(image);

        await pool.promise().execute("CALL AddFeedback(?, ?, ?, ?, ?)", [username, title, description, imageName, rating]);

        res.json({ message: 'Feedback added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/rate', basicAuth, async (req, res) => {
    try {
        const { itemId, portionSize, foodTemperature, willingToPay, foodAppearance, image } = req.body;
        const username = req.session.username;

        if (!itemId || !portionSize || !foodTemperature || !willingToPay || !foodAppearance) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let imageFileName = null;
        if (image) {
            imageFileName = saveImage(image);
        }

        const sql = "CALL AddRating(?, ?, ?, ?, ?, ?, ?)";
        await pool.promise().execute(sql, [username, itemId, portionSize, foodTemperature, willingToPay, foodAppearance, imageFileName]);

        res.json({ success: true, message: "Rating submitted successfully" });
    } catch (err) {
        console.error("Error adding rating:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/admin_catalog', basicAuth, async (req, res) => {
    const query = 'call GetFoodCatalog()';
    const resp = await pool.promise().execute(query);
    res.status(200).json(resp[0]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})