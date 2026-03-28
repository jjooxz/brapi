const app = require("./src/app");
const { initDB } = require("./src/db/database");

app.listen(3000, async () => {
    await initDB();

    console.log("API Rodando na porta 3000");
})