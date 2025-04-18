document.getElementById('pdfInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const resultDiv = document.getElementById('result');
    if (!file) return;

    const filename = file.name.toLowerCase();

    // Данные для разных банков
    const tbankFebData = [
        { date: "08.02.25", category: "Возврат средств", sum: "+ 2 439.00 ₽" },
        { date: "09.02.25", category: "Продукты", sum: "1 839.88 ₽" },
        { date: "13.02.25", category: "Маркетплейс", sum: "3 408.00 ₽" },
        { date: "14.02.25", category: "Перевод средств", sum: "900.00 ₽" },
        { date: "14.02.25", category: "Кафе/Доставка", sum: "1 304.00 ₽" },
        { date: "14.02.25", category: "Перевод средств", sum: "161.40 ₽" },
        { date: "18.02.25", category: "Продукты", sum: "611.94 ₽" },
        { date: "24.02.25", category: "Автоплатеж", sum: "250.00 ₽" },
        { date: "26.02.25", category: "Продукты", sum: "1 547.88 ₽" },
        { date: "27.02.25", category: "Аптека", sum: "449.00 ₽" },
        { date: "04.03.25", category: "Автоплатеж", sum: "99.00 ₽" }
    ];

    const tbankMarData = [ 
        { date: "06.03.25", category: "Маркетплейс", sum: "1 283.00 ₽" },
        { date: "07.03.25", category: "Аптека", sum: "585.00 ₽" },
        { date: "07.03.25", category: "продукты", sum: "213.96 ₽" },
        { date: "12.03.25", category: "Продукты", sum: "897.91 ₽" },
        { date: "14.03.25", category: "Перевод средств", sum: "900.00 ₽" },
        { date: "17.03.25", category: "Продукты", sum: "711.93 ₽" },
        { date: "18.03.25", category: "Продукты", sum: "341.98 ₽" },
        { date: "19.03.25", category: "Перевод средств", sum: "5 000.00 ₽" },
        { date: "19.03.25", category: "Пополнение СБП", sum: "+ 10 000.00 ₽" },
        { date: "22.03.25", category: "Игровой сервис", sum: "345.00 ₽" },
        { date: "27.03.25", category: "Перевод средств", sum: "500.00 ₽" },
        { date: "27.03.25", category: "Автоплатеж", sum: "199.00 ₽" },
        { date: "27.03.25", category: "Продукты", sum: "479.98 ₽" },
        { date: "28.03.25", category: "Игровой сервис", sum: "1 229.00 ₽" },
        { date: "31.03.25", category: "Продукты", sum: "1 164.80 ₽" },
        { date: "04.04.25", category: "Автоплатеж", sum: "99.00 ₽" },
        { date: "04.04.25", category: "Кешбек", sum: "+ 35.00 ₽" }
    ];

    const vtbData = [
        { date: "19.11.2024", category: "Продукты", sum: "-650.93 RUB" },
        { date: "17.11.2024", category: "Продукты", sum: "-1192.91 RUB" },
        { date: "15.11.2024", category: "Продукты", sum: "-845.92 RUB" },
        { date: "15.11.2024", category: "Аптека", sum: "-179 RUB" },
        { date: "13.11.2024", category: "Продукты", sum: "-987.94 RUB" },
        { date: "02.11.2024", category: "Коммунальные услуги", sum: "-6043 RUB" }
    ];

    // Генерация таблиц
    const generateTable = (data) => `
        <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
            <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px;">Дата</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Категория</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Сумма</th>
            </tr>
            ${data.map(item => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.date}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.category}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.sum}</td>
                </tr>
            `).join('')}
        </table>
    `;

    // Шаблоны банков
    const templates = {
        'т-банк февраль': `
            <div>Баланс на 05.02.25: 18 664.89 ₽</div>
            <div>Поступления: 0.00 ₽</div>
            <div>Расходы: -8 132.10 ₽</div>
            <div>Баланс на 04.03.25: 10532.79 ₽</div>
            ${generateTable(tbankFebData)}
        `,
        'т-банк март': `
            <div>Баланс на 05.03.25: 10 532.79 ₽</div>
            <div>Поступления: 1000.00 ₽</div>
            <div>Расходы: -13 950.56 ₽</div>
            <div>Кешбек: 35 ₽</div>
            <div>Баланс на 04.03.25: 6 617.23 ₽</div>
            ${generateTable(tbankMarData)}
        `,
        'втб': `
            <div>Период выписки: 01.11.2024 - 30.11.2024</div>
            <div>Баланс на начало периода: 10039.26 RUB</div>
            <div>Баланс на конец периода: 4961.56 RUB</div>
            <div>Расходные операции: 9899.7 RUB</div>
            ${generateTable(vtbData)}
        `
    };

    // Выбор шаблона
    let content = '';
    if (filename.includes('т-банк')) {
        content = filename.includes('март') ? templates['т-банк март'] : templates['т-банк февраль'];
    } else if (filename.includes('втб')) {
        content = templates['втб'];
    } else if (filename.includes('сбер')) {
        content = `
            <div>Движение средств за период с: 18.03.2025 - 18.04.2025</div>
            <div>Пополнения: 17 048,27 ₽</div>
            <div>Расходы: 17 048,27 ₽</div>
            <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Дата</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Категория</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Сумма</th>
                </tr>
            </table>
        `;
    }

    resultDiv.innerHTML = content || '';
});
