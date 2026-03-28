const express = require("express");

const cpfRoutes = require("./routes/v1/cpf");
const cnpjRoutes = require("./routes/v1/cnpj");
const pixRoutes = require("./routes/v1/pix");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin.js");

const redoc = require("redoc-express");

const cookieParser = require("cookie-parser");
const apiKeyMiddleware = require("./middlewares/apiKey.js");

const app = express();
const path = require("path");

// middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "./src/views");

// rotas públicas
app.use("/", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);


app.get("/docs", (req, res) => {
    res.render("docs")
});

// 🔒 rotas protegidas
const protectedRoutes = express.Router();

protectedRoutes.use(apiKeyMiddleware);

protectedRoutes.use("/cpf", cpfRoutes);
protectedRoutes.use("/cnpj", cnpjRoutes);
protectedRoutes.use("/pix", pixRoutes);

// aplica tudo em /api/v1
app.use("/api/v1", protectedRoutes);

module.exports = app;