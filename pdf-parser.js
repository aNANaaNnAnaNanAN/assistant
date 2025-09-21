document.getElementById('pdfInput').addEventListener('change', async (event) => {
  const selectedBank = document.getElementById('bankSelect').value;
  console.log('Выбран банк:', selectedBank);
  
  const file = event.target.files[0];
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Обрабатываю файл...';

  if (!file) {
    resultDiv.textContent = '';
    return;
  }

  if (selectedBank === 'tbank') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('Файл загружен, размер:', arrayBuffer.byteLength);

      const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str.trim());
        fullText += strings.join(' ') + '\n';
      }
      console.log('Текст из pdf получен:', fullText.length, 'символов');

      const txRegex = /(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})\s+(\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2})\s+([+\-]?[ \d,.]+ ₽)\s+([+\-]?[ \d,.]+ ₽)\s+(.+?)\s+(\d{4})/g;

      const transactions = [];
      let match;

      while ((match = txRegex.exec(fullText)) !== null) {
        transactions.push({
          operationDate: match[1],
          debitDate: match[2],
          operationAmount: match[3].replace(/\s/g, ''),
          cardAmount: match[4].replace(/\s/g, ''),
          description: match[5].trim(),
          cardNumber: match[6]
        });
      }

      console.log('Найдено транзакций:', transactions.length);

      if (transactions.length === 0) {
        resultDiv.textContent = 'Не удалось распознать транзакции в данном файле.';
        return;
      }

      resultDiv.textContent = '';

      const table = document.createElement('table');
      const header = document.createElement('tr');
      header.innerHTML = `
        <th>Дата и время операции</th>
        <th>Дата списания</th>
        <th>Сумма в валюте операции</th>
        <th>Сумма операции в валюте карты</th>
        <th>Описание операции</th>
        <th>Номер карты</th>
      `;
      table.appendChild(header);

      transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${tx.operationDate}</td>
          <td>${tx.debitDate}</td>
          <td>${tx.operationAmount}</td>
          <td>${tx.cardAmount}</td>
          <td>${tx.description}</td>
          <td>${tx.cardNumber}</td>
        `;
        table.appendChild(row);
      });
      resultDiv.appendChild(table);

    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
      resultDiv.textContent = 'Ошибка при чтении файла: ' + error.message;
    }
  } else {
    resultDiv.textContent = 'Парсинг для выбранного банка отсутствует.';
  }
});





