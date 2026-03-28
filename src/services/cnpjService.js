function validarCNPJ(cnpj) {
    var cleanCNPJ = cnpj.replace(/\D/g, '');
    if (!/^\d{14}$/.test(cleanCNPJ)) {
        return false;
    }

    var cnpjArray = [...cleanCNPJ].map(Number);
    if (cnpjArray.length > 0 && cnpjArray.every(val => val === cnpjArray[0])) {
        return false;
    }
    var d1 = 0;
    const weightsd1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i=0; i < 12; i++) {
        d1 += cnpjArray[i] * weightsd1[i];
    }

    if (d1 % 11 < 2) {
        d1 = 0;
    } else {
        d1 = 11 - (d1 % 11);
    }

    var d2 = 0;
    const weightsd2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i=0; i < 13; i++) {
        d2 += cnpjArray[i] * weightsd2[i]
    }

    if (d2 % 11 < 2) {
        d2 = 0;
    } else {
        d2 = 11 - (d2 % 11);
    }

    if (d1 != cnpjArray[12] || d2 != cnpjArray[13]) {
        return false
    }

    return true
}

function gerarCNPJ() {
    let cnpjArray = [];

    for (let i = 0; i < 12; i++) {
        cnpjArray.push(Math.floor(Math.random() * 10));
    }

    let soma1 = 0;
    let peso1 = 5;
    for (let i = 0; i < 12; i++) {
        soma1 += cnpjArray[i] * peso1;
        peso1 = peso1 === 2 ? 9 : peso1 - 1;
    }
    let digito1 = soma1 % 11 < 2 ? 0 : 11 - (soma1 % 11);
    cnpjArray.push(digito1)

    let soma2 = 0;
    let peso2 = 6;
    for (let i = 0; i < 13; i++) {
        soma2 += cnpjArray[i] * peso2;
        peso2 = peso2 === 2 ? 9 : peso2 - 1;
    }
    let digito2 = soma2 % 11 < 2 ? 0 : 11 - (soma2 % 11);
    cnpjArray.push(digito2);

    return cnpjArray.join("");
}

module.exports = { validarCNPJ, gerarCNPJ }