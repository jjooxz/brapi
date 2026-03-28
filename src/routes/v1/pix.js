const express = require("express");
const router = express.Router();
const { gerarPix } = require("../../services/pixService")
const QRCode = require("qrcode");

router.get("/static", (req, res) => {
    try {
        const { key, name, city, amount } = req.body;

        if (!key || !name || !city) {
            return res.status(400).json({
                error: "key, name and city are needed"
            });
        }

        const payload = gerarPix({
            key,
            name,
            city,
            amount
        });

        return res.json({
            payload
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "erro ao gerar pix"
        });
    }
})

router.get("/qrcode", async (req, res) => {
    try {
        const { key, name, city, amount } = req.query;

        if (!key || !name || !city) {
            return res.status(400).json({
                error: "key, name e city são obrigatórios"
            });
        }

        const payload = gerarPix({
            key,
            name,
            city,
            amount: amount ? Number(amount) : undefined
        });

        // gera imagem
        const buffer = await QRCode.toBuffer(payload);

        res.type("image/png");
        return res.send(buffer);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "erro ao gerar QR code"
        });
    }
});

module.exports = router;