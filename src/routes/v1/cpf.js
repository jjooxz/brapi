const express = require("express");
const router = express.Router();

const { validarCPF, gerarCPF } = require("../../services/cpfService");

router.get("/validate/:cpf", (req, res) => {
    try {
        const { cpf } = req.params;


        res.json({
            cpf,
            valid: validarCPF(cpf)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "erro interno" });
    }
});

router.get("/generate", (req, res) => {
    const { state } = req.query;

    const cpf = gerarCPF(state);

    res.json({
        cpf: cpf,
        state: state || null
    });
});

module.exports = router;