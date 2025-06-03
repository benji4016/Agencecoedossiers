const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "votre_cle_secrete";

// Utilisateurs avec mots de passe hachés
const users = [
    {
        id: 1,
        email: "john@example.com",
        password: bcrypt.hashSync("password123", 10),
        name: "John Doe",
    },
    {
        id: 2,
        email: "jane@example.com",
        password: bcrypt.hashSync("mypassword", 10),
        name: "Jane Smith",
    },
];

// Articles enrichis
const articles = [
    {
        id: 1,
        title: "Les bases de Node.js",
        description: "Introduction aux concepts fondamentaux de Node.js",
        content: "Node.js est un environnement d'exécution JavaScript orienté serveur. Il permet de créer des applications back-end performantes et évolutives...",
        publicationDate: "2023-01-01",
    },
    {
        id: 2,
        title: "REST API avec Express",
        description: "Comment créer une API REST avec Express.js",
        content: "Express est un framework minimaliste et flexible pour Node.js. Il facilite la création d'API robustes, et permet de gérer facilement les routes, les middlewares et les réponses HTTP...",
        publicationDate: "2023-02-15",
    },
    {
        id: 3,
        title: "L’éco-conception web expliquée",
        description: "Pourquoi l'éco-conception est essentielle dans le développement moderne.",
        content: "L’éco-conception consiste à minimiser l’impact environnemental d’un site web tout en maintenant sa performance...",
        publicationDate: "2023-03-20",
    },
    {
        id: 4,
        title: "Les bonnes pratiques du HTML sémantique",
        description: "Un site web accessible commence par une structure HTML claire.",
        content: "Utiliser les bonnes balises HTML (comme <article>, <section>, <nav>, etc.) améliore l’accessibilité et le référencement naturel...",
        publicationDate: "2023-04-05",
    }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *         publicationDate:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification des utilisateurs
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 */
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
});

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Retourne la liste de tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
app.get('/articles', (req, res) => {
    res.status(200).json(articles);
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Récupère un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 */
app.get('/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
        return res.status(404).send('Article non trouvé');
    }
    res.status(200).json(article);
});

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Crée un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */
app.post('/articles', (req, res) => {
    const newArticle = {
        id: articles.length + 1,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        publicationDate: req.body.publicationDate || new Date().toISOString().split('T')[0],
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Met à jour un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
app.put('/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
        return res.status(404).send('Article non trouvé');
    }

    article.title = req.body.title || article.title;
    article.description = req.body.description || article.description;
    article.content = req.body.content || article.content;
    article.publicationDate = req.body.publicationDate || article.publicationDate;

    res.status(200).json(article);
});

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Supprime un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
app.delete('/articles/:id', (req, res) => {
    const index = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Article non trouvé');
    }
    articles.splice(index, 1);
    res.status(200).send('Article supprimé avec succès');
});

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AgencEco Articles API',
            version: '1.0.0',
            description: 'API pour la gestion des actualités du site AgencEco',
        },
    },
    apis: ['./app.js'],
};
const openapiSpecification = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3000, () => {
    console.log('✅ Serveur lancé sur http://localhost:3000');
    console.log('📚 Swagger dispo sur http://localhost:3000/api-docs');
});
