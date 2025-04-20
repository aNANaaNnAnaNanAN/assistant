const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePDF(filePath) {
  try {
    // 1. Загрузка и парсинг PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    // 2. Разделение текста на строки
    const lines = pdfData.text.split('\n').filter(line => line.trim() !== '');

    // 3. Определение заголовков (первые 2 строки)
    const headers = lines.slice(0, 2);
    
    // 4. Обработка данных
    const data = lines.slice(2).map(line => {
      const values = line.split(/\s{2,}/); 
      return {
        date: values[0] || '',
        description: values[1] || '',
        amount: values[2] || ''
      };
    });

    return {
      headers: {
        main: headers[0],
        sub: headers[1]
      },
      transactions: data
    };

  } catch (err) {
    throw new Error(`Ошибка обработки PDF: ${err.message}`);
  }
}

// Пример использования
parsePDF('bank_statement.pdf')
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(err => console.error(err.message));






