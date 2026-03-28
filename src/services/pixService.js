function emv(id, value) {
    const size = value.length.toString().padStart(2, "0");
    return `${id}${size}${value}`;
}

function crc16(str) {
    let crc = 0xFFFF;

    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }

    crc &= 0xFFFF;

    return crc.toString(16).toUpperCase().padStart(4, "0");
}

function pixSafe(str) {
    return str
        .normalize("NFD")      // separa os acentos
        .replace(/[\u0300-\u036f]/g, "") // remove os acentos
        .replace(/[^A-Z0-9 ]/gi, "")     // remove caracteres inválidos
        .toUpperCase()          // força maiúsculas
        .slice(0, 25);          // limite de tamanho no campo Nome
}

function gerarPix({ key, name, city, amount }) {
    name = pixSafe(name);
    city = pixSafe(city).slice(0, 15);

    let payload = "";

    payload += emv("00", "01");

    let merchant = "";
    merchant += emv("00", "BR.GOV.BCB.PIX");
    merchant += emv("01", key);

    payload += emv("26", merchant);

    payload += emv("52", "0000");
    payload += emv("53", "986");

    if (amount) {
        payload += emv("54", Number(amount).toFixed(2));
    }

    payload += emv("58", "BR");
    payload += emv("59", name.substring(0, 25));
    payload += emv("60", city.substring(0, 15));

    payload += emv("62", emv("05", "***"));

    payload += "6304";
    payload += crc16(payload);

    return payload;
}

module.exports = { gerarPix };