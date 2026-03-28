function validarCPF(cpf) {
    var cleanCpf = cpf.replace(/\D/g, '');
    if (!/^\d{11}$/.test(cleanCpf)) {
        return false;
    }

    var cpfArray = [...cleanCpf].map(Number);
    if (cpfArray.length > 0 && cpfArray.every(val => val === cpfArray[0])) {
        return false;
    }
    var d1 = 0;

    for (let i = 0, o = 10; i < 9; i++, o--) {
        d1 += cpfArray[i] * o;
    }

    if (d1 % 11 < 2) {
        d1 = 0;
    } else {
        d1 = 11 - (d1 % 11);
    }

    var d2 = 0;

    for (let i = 0, o = 11; i < 10; i++, o--) {
        d2 += cpfArray[i] * o;
    }

    if (d2 % 11 < 2) {
        d2 = 0;
    } else {
        d2 = 11 - (d2 % 11);
    }

    if (d1 != cpfArray[9] || d2 != cpfArray[10]) {
        return false;
    }

    return true;
}

function gerarCPF(estado) {
    const estadoMap = {
        rs: 0,
        df: 1, go: 1, ms: 1, mt: 1, to: 1,
        ac: 2, am: 2, ap: 2, pa: 2, ro: 2, rr: 2,
        ce: 3, ma: 3, pi: 3,
        al: 4, pb: 4, pe: 4, rn: 4,
        ba: 5, se: 5,
        mg: 6,
        es: 7, rj: 7,
        sp: 8,
        pr: 9, sc: 9
    };

    estado = estado?.toLowerCase();

    let cpfArray = [];

    // gera 8 dígitos aleatórios
    for (let i = 0; i < 8; i++) {
        cpfArray.push(Math.floor(Math.random() * 10));
    }

    // 9º dígito (estado ou random)
    const digitoEstado = estadoMap[estado];
    cpfArray.push(
        digitoEstado !== undefined
            ? digitoEstado
            : Math.floor(Math.random() * 10)
    );

    // cálculo d1
    let d1 = 0;
    for (let i = 0; i < 9; i++) {
        d1 += cpfArray[i] * (10 - i);
    }

    d1 = d1 % 11 < 2 ? 0 : 11 - (d1 % 11);
    cpfArray.push(d1);

    // cálculo d2 (agora com 10 dígitos!)
    let d2 = 0;
    for (let i = 0; i < 10; i++) {
        d2 += cpfArray[i] * (11 - i);
    }

    d2 = d2 % 11 < 2 ? 0 : 11 - (d2 % 11);
    cpfArray.push(d2);

    return cpfArray.join("");
}

module.exports = { validarCPF, gerarCPF }