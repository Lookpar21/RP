let data = JSON.parse(localStorage.getItem('baccarat_data')) || [];

let currentInput = {
    result: '',
    eye1: '',
    eye2: '',
    eye3: '',
    outcome: ''
};

let searchKeyword = '';

function setInput(field, value) {
    currentInput[field] = value;
}

function setSearch(value) {
    searchKeyword = value.trim();
    renderTable();
}

function addRecord() {
    if (!currentInput.result || !currentInput.eye1 || !currentInput.eye2 || !currentInput.eye3 || !currentInput.outcome) {
        alert("กรุณากรอกข้อมูลให้ครบ 5 ช่อง");
        return;
    }

    const newRecord = { ...currentInput };
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
        // รวมข้อมูล 5 ช่องเป็นสตริงเดียวกัน เช่น "B🔴🔵🔴P"
        const fullKey = `${item.result}${item.eye1}${item.eye2}${item.eye3}${item.outcome}`;
        if (searchKeyword && !fullKey.includes(searchKeyword)) {
            return; // ข้ามถ้าไม่ตรงคำค้น
        }
        const stat = calculateStat(item, index);
        const row = `<tr>
            <td>${item.result}</td>
            <td>${item.eye1}</td>
            <td>${item.eye2}</td>
            <td>${item.eye3}</td>
            <td>${item.outcome}</td>
            <td>P=${stat.P}, B=${stat.B} <button onclick="deleteRecord(${index})">🗑️</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function calculateStat(target, targetIndex) {
    let P = 0, B = 0;
    for (let i = 0; i < data.length; i++) {
        if (i === targetIndex) continue;

        const current = data[i];

        if (
            current.eye1 === target.eye1 &&
            current.eye2 === target.eye2 &&
            current.eye3 === target.eye3 &&
            current.outcome === target.outcome
        ) {
            if (current.result === 'P') P++;
            if (current.result === 'B') B++;
        }
    }
    return { P, B };
}

function deleteRecord(index) {
    if (confirm("คุณต้องการลบข้อมูลแถวนี้หรือไม่?")) {
        data.splice(index, 1);
        localStorage.setItem('baccarat_data', JSON.stringify(data));
        renderTable();
    }
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

function uploadData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const uploadedData = JSON.parse(e.target.result);
            if (Array.isArray(uploadedData)) {
                data = uploadedData;
                localStorage.setItem('baccarat_data', JSON.stringify(data));
                renderTable();
            } else {
                alert("รูปแบบไฟล์ไม่ถูกต้อง");
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        }
    };
    reader.readAsText(file);
}

renderTable();
