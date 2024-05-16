const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Enable CORS for all routes and origins
app.use(cors());

app.use(express.json());

// POST route to save editor content
app.post("/submit-editor", async (req, res) => {
    const { title, info ,authorId} = req.body;
    try {
        const newPost = await prisma.post.create({
            data: {
                authorId,
                title,
                info,
            },
        });
        res.json(newPost);
    } catch (error) {
        console.error('Failed to save post:', error);
        res.status(500).json({ error: 'Failed to save post' });
    }
});

const port = process.env.PORT || "4000";

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port} 🚀`);
});
