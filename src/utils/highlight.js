const { codeToHtml } = require('shiki')
const {} = require("@shikijs/transformers")

async function highlightCode(code, lang = 'js') {
    return codeToHtml(code, {
        lang: lang,
        theme: 'nord',
    })
}

module.exports = { highlightCode };