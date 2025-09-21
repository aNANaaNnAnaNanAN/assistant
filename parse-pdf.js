const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    // Получаем текст из PDF и разбиваем на строки
    const lines = pdfData.text.split('\n').filter(line => line.trim() !== '');

    // Пример простой обработки - здесь надо адаптировать к формату вашей выписки
    const transactions = [];
    const txRegex = /(\d{2}\.\d{2}\.\d{2,4})\s+(.+?)\s+([+\-]?[ \d,.]+ [₽|RUB]+)/;

    for (const line of lines) {
      const match = line.match(txRegex);
      if (match) {
        transactions.push({
          date: match[1],
          description: match[2].trim(),
          amount: match[3].replace(/\s/g, '')
        });
      }
    }

    return transactions;

  } catch (err) {
    throw new Error(`Ошибка обработки PDF: ${err.message}`);
  }
}

if (require.main === module) {
  (async () => {
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Пожалуйста, укажите путь к PDF файлу');
      process.exit(1);
    }

    try {
      const data = await parsePDF(filePath);
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err.message);
    }
  })();
}

module.exports = parsePDF;







