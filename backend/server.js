const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "supersecret";
const UPLOADS_DIR = path.join(__dirname, "uploads");


fs.ensureDirSync(UPLOADS_DIR);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(UPLOADS_DIR));

const DB_FILE = "db.json";


const loadDB = async () => {
    try {
        return await fs.readJson(DB_FILE);
    } catch (error) {

        return { users: [], posts: [] };
    }
};


const saveDB = async (data) => {
    await fs.writeJson(DB_FILE, data);
};


const authenticate = (req, res, next) => {
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    const token = tokenHeader.replace("Bearer ", "").trim();
    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized. Token format invalid." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // { id, name, username, role }
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid token. Please log in again." });
    }
};


const addDefaultUsers = async () => {
    let db = await loadDB();

    const usersToAdd = [
        {
            username: "admin",
            name: "Administrator",
            email: "admin@example.com",
            password: "admin",
            role: "admin",
        },
        {
            username: "test",
            name: "Test User",
            email: "test@example.com",
            password: "test123",
            role: "user",
        },
    ];

    let changes = false;

    for (const user of usersToAdd) {
        let existingUser = db.users.find((u) => u.username === user.username);

        if (!existingUser) {

            const hashedPassword = await bcrypt.hash(user.password, 10);
            db.users.push({
                id: Date.now(),
                name: user.name,
                username: user.username,
                email: user.email,
                password: hashedPassword,
                role: user.role,
            });
            changes = true;
        } else {

            if (!existingUser.password.startsWith("$2a$")) {
                existingUser.password = await bcrypt.hash(user.password, 10);
                changes = true;
            }
        }
    }

    if (changes) {
        await saveDB(db);
        console.log("✅ Default users updated");
    }
};
addDefaultUsers();



// РЕЄСТРАЦІЯ
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    let db = await loadDB();

    if (!username || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (db.users.some((u) => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now(),
        name: username,
        username,
        email: `${username}@example.com`,
        password: hashedPassword,
        role: "user",
    };

    db.users.push(newUser);
    await saveDB(db);

    const token = jwt.sign(
        { id: newUser.id, name: newUser.name, username: newUser.username, role: newUser.role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token, message: "Registration successful" });
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let db = await loadDB();

    const user = db.users.find((u) => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "Користувача не знайдено" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: "Невірний логін або пароль" });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token });
});



app.get("/posts", async (req, res) => {
    let db = await loadDB();
    res.json(db.posts);
});


app.post("/posts", authenticate, upload.array("files", 5), async (req, res) => {
    const { title, content, tag } = req.body;
    let db = await loadDB();

    const newPost = {
        id: Date.now(),
        title,
        content,
        tag,
        userId: req.user.id,
        images: req.files
            ? req.files.map((file) => `http://localhost:${PORT}/uploads/${file.filename}`)
            : [],
        likes: 0,
        comments: [],
    };

    db.posts.unshift(newPost);
    await saveDB(db);
    res.json(newPost);
});


app.put("/posts/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, content, tag } = req.body;
    let db = await loadDB();

    const postIndex = db.posts.findIndex((p) => p.id === Number(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: "Пост не знайдено" });
    }

    if (db.posts[postIndex].userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Немає прав для редагування поста" });
    }

    db.posts[postIndex].title = title;
    db.posts[postIndex].content = content;
    db.posts[postIndex].tag = tag;
    await saveDB(db);

    res.json({ message: "Пост оновлено", post: db.posts[postIndex] });
});


app.delete("/posts/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    let db = await loadDB();

    const postIndex = db.posts.findIndex((p) => p.id === Number(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: "Пост не знайдено" });
    }


    if (db.posts[postIndex].userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Немає прав для видалення поста" });
    }

    db.posts.splice(postIndex, 1);
    await saveDB(db);

    res.json({ message: "Пост видалено" });
});


app.post("/posts/:id/like", authenticate, async (req, res) => {
    const { id } = req.params;
    let db = await loadDB();

    const postIndex = db.posts.findIndex((p) => p.id === Number(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: "Пост не знайдено" });
    }

    db.posts[postIndex].likes = (db.posts[postIndex].likes || 0) + 1;
    await saveDB(db);

    res.json({ likes: db.posts[postIndex].likes });
});


app.post("/posts/:id/comments", authenticate, async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    let db = await loadDB();

    const postIndex = db.posts.findIndex((p) => p.id === Number(id));
    if (postIndex === -1) {
        return res.status(404).json({ message: "Пост не знайдено" });
    }

    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: "Коментар не може бути порожнім" });
    }


    db.posts[postIndex].comments.push({
        author: req.user.username, // беремо з токена
        comment,
        date: new Date().toISOString(),
    });

    await saveDB(db);


    res.json({ comments: db.posts[postIndex].comments });
});


app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

