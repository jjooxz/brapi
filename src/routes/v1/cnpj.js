const express = require("express");
const { validarCNPJ, gerarCNPJ } = require("../../services/cnpjService");
const router = express.Router();

router.get("/validate/:cnpj", (req, res) => {
    try {
        const { cnpj } = req.params;

        res.json({
            cnpj,
            valid: validarCNPJ(cnpj)
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "erro ao validar cnpj"
        });
    }
})

router.get("/generate", (req, res) => {
    const cnpj = gerarCNPJ();

    res.json({
        cnpj: cnpj
    })
})

module.exports = router;