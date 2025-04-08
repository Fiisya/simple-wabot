/*Simple WhatsApp bot
 * Credits : Bang_syaii
 * RestAPI : https://api.botwa.space
 * Community : https://api.botwa.space/s/gcbot
 */

let handler = async (m, {
    text
}) => {
    if (!text) return m.reply('Masukkan Code ESM Yang Ingin Di Convert CJS.');

    try {
        const cjsCode = convertESMtoCJS(text);

        m.reply(`\n\n${cjsCode}`);
    } catch (error) {
        console.error('Error Convert Code ESM To CJS:', error);
        m.reply('Ada Yang Error Om, Cek Lagi Code nya.');
    }
};

function convertESMtoCJS(esmCode) {
    let cjsCode = esmCode.replace(/import\s+([a-zA-Z0-9{},\s*]+)\s+from\s+['"](.*)['"];?/g, (match, imports, module) => {
        if (imports.includes("{")) {
            const [defaultImport, namedImports] = imports.split("{");
            let result = '';
            if (defaultImport.trim()) {
                result += `const ${defaultImport.trim()} = require('${module}');\n`;
            }
            if (namedImports) {
                result += `const { ${namedImports.replace("}", "").trim()} } = require('${module}');`;
            }
            return result;
        } else {
            return `const ${imports.trim()} = require('${module}');`;
        }
    });

    cjsCode = cjsCode.replace(/export\s+default/g, 'module.exports =');

    cjsCode = cjsCode.replace(/export\s+async\s+function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*{/g, 'exports.$1 = async function ($2) {');

    cjsCode = cjsCode.replace(/export\s+function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*{/g, 'exports.$1 = function ($2) {');

    cjsCode = cjsCode.replace(/export\s+const\s+([a-zA-Z0-9_]+)\s+=/g, 'exports.$1 =');

    cjsCode = cjsCode.replace(/export\s*{\s*([^}]+)\s*};/g, (match, exportedVars) => {
        return exportedVars.split(',').map(variable => `exports.${variable.trim()} = ${variable.trim()};`).join('\n');
    });

    cjsCode = cjsCode.replace(/import\((.*)\)/g, 'require($1)');

    return cjsCode;
}

handler.tags = ['tools'];
handler.command = ['tocjs'];
handler.help = ['tocjs'];
handler.limit = true;
module.exports = handler;