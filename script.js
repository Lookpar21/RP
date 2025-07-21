
let data = JSON.parse(localStorage.getItem('baccarat_data')) || [];

let currentInput = {
    result: '',
    eye1: '',
    eye2: '',
    eye3: '',
    outcome: ''
};

function setInput(field, value) {
    currentInput[field] = value;
}

function addRecord() {
    if (!currentInput.result || !currentInput.eye1 || !currentInput.eye2 || !currentInput.eye3 || !currentInput.outcome) {
        alert("กรุณากรอกข้อมูลให้ครบ 5 ช่อง");
        return;
    }

    const newRecord = {
        ...currentInput
    };
    data.unshift(newRecord);
    localStorage.setItem('baccarat_data', JSON.stringify(data));
    renderTable();
}

function viewHistory() {
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach((item, index) => {
        const stat = calculateStat(item);
        const row = `<tr>
            <td>${item.result}</td>
            <td>${item.eye1}</td>
            <td>${item.eye2}</td>
            <td>${item.eye3}</td>
            <td>${item.outcome}</td>
            <td>P=${stat.P}, B=${stat.B}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function calculateStat(target) {
    let P = 0, B = 0;
    for (let i = 0; i < data.length - 1; i++) {
        const current = data[i];
        const next = data[i + 1];
        if (
            current.result === target.result &&
            current.eye1 === target.eye1 &&
            current.eye2 === target.eye2 &&
            current.eye3 === target.eye3 &&
            current.outcome === target.outcome
        ) {
            if (next.outcome === 'P') P++;
            if (next.outcome === 'B') B++;
        }
    }
    return { P, B };
}

function downloadData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baccarat_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Render table on load
renderTable();
