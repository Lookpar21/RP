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

function calculateStat(target) {
    let count = 0;
    const key = `${target.result}${target.eye1}${target.eye2}${target.eye3}${target.outcome}`;
    for (let i = 0; i < data.length; i++) {
        const currentKey = `${data[i].result}${data[i].eye1}${data[i].eye2}${data[i].eye3}${data[i].outcome}`;
        if (currentKey === key) {
            count++;
        }
    }
    return count;
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach((item, index) => {
        const fullKey = `${item.result}${item.eye1}${item.eye2}${item.eye3}${item.outcome}`;
        if (searchKeyword && !fullKey.includes(searchKeyword)) {
            return; // ข้ามแถวที่ไม่ตรงคำค้น
        }
        const stat = calculateStat(item);
        const row = `<tr>
            <td>${item.result}</td>
            <td>${item.eye1}</td>
            <td>${item.eye2}</td>
            <td>${item.eye3}</td>
            <td>${item.outcome}</td>
            <td>${fullKey}  ${stat} ครั้ง <button onclick="deleteRecord(${index})">🗑️</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function deleteRecord(index) {
    if (confirm("คุณต้องการลบข้อมูลแถวนี้หรือไม่?")) {
        data.splice(index, 1);
        localStorage.setItem('baccarat_data', JSON.stringify(data));
        renderTable();
    }
}

function downloadData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'baccarat_data.bak'); // เปลี่ยนนามสกุลเป็น .bak เพื่อช่วย iOS
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
