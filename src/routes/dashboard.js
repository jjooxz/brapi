const express = require("express");
const router = express.Router();
const { highlightCode } = require("../utils/highlight");
const requireAuth = require("../middlewares/requireAuth");

const skipIfLogged = require("../middlewares/skipIfLogged");

router.get("/", async (req, res) => {
    const code = `fetch("https://brapi.dev/api/v1/cpf/generate?state=sp", {
    headers: {
        "x-api-key": "sua-chave"
    }
})
.then(res => res.json())    
.then(data => console.log(data));`;

    const responseCode = `{
    "valid": true,
    "cpf": "84189748854",
    "state": "SP"
}`;

    const highlighted = await highlightCode(code);
    const highlightedResponse = await highlightCode(responseCode, "json");

    res.render("index", {
        code: highlighted,
        response: highlightedResponse
    });
});

router.get("/login", skipIfLogged, (req, res) => {
  res.render("login");
});

router.get("/dashboard", requireAuth, (req, res) => {
    const usagePercent = Math.min(
        (req.user.usage_count / req.user.rate_limit) * 100,
        100
    );

    res.render("dashboard", {
        user: req.user,
        usagePercent
    })
})

module.exports = router;