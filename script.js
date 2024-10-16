let totalSpent = 0;
let salary = 0;

// Función para actualizar el salario
function updateSalary() {
    salary = parseFloat(document.getElementById('salary').value);
    if (isNaN(salary)) salary = 0;
    updateRemainingSalary();
}

// Función para agregar una nueva fila a la tabla
function addRow() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const paymentStatus = document.getElementById('paymentStatus').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;

    if (description && !isNaN(amount)) {
        const table = document.getElementById('budgetTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        // Columna de Descripción
        const descriptionCell = newRow.insertCell(0);
        descriptionCell.innerText = `${description} (${month} ${year})`;

        // Columna de Cantidad
        const amountCell = newRow.insertCell(1);
        amountCell.innerText = `Q${amount.toFixed(2)}`;
        totalSpent += amount;

        // Columna de Estado de Pago
        const statusCell = newRow.insertCell(2);
        statusCell.innerText = paymentStatus;

        // Columna de Acciones
        const actionsCell = newRow.insertCell(3);
        actionsCell.innerHTML = `<button onclick="editRow(this)">Editar</button> 
                                 <button class="delete" onclick="deleteRow(this, ${amount})">Eliminar</button>`;

        // Limpiar los campos
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';

        updateRemainingSalary();
    }
}

// Función para eliminar una fila
function deleteRow(button, amount) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    totalSpent -= amount;
    updateRemainingSalary();
}

// Función para editar una fila
function editRow(button) {
    const row = button.parentNode.parentNode;
    const descriptionCell = row.cells[0];
    const amountCell = row.cells[1];
    const statusCell = row.cells[2];

    const newDescription = prompt("Editar Descripción", descriptionCell.innerText);
    const newAmount = parseFloat(prompt("Editar Cantidad (Q)", amountCell.innerText.slice(1)));
    const newStatus = prompt("Editar Estado de Pago", statusCell.innerText);

    if (newDescription !== null) {
        descriptionCell.innerText = newDescription;
    }
    if (!isNaN(newAmount)) {
        totalSpent -= parseFloat(amountCell.innerText.slice(1));
        totalSpent += newAmount;
        amountCell.innerText = `Q${newAmount.toFixed(2)}`;
    }
    if (newStatus !== null) {
        statusCell.innerText = newStatus;
    }

    updateRemainingSalary();
}

// Función para actualizar el saldo restante
function updateRemainingSalary() {
    const remaining = salary - totalSpent;
    document.getElementById('remainingSalary').innerText = `Q${remaining.toFixed(2)}`;
}

// Función para exportar la tabla a CSV
function exportTableToCSV(filename) {
    const rows = document.querySelectorAll("table tr");
    let csvContent = "";

    rows.forEach(row => {
        const cells = row.querySelectorAll("td, th");
        const rowData = Array.from(cells).map(cell => cell.innerText).join(",");
        csvContent += rowData + "\n";
    });

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    link.setAttribute("download", filename);

    // Simular clic en el enlace para forzar la descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function exportTableToExcel() {
    let table = document.getElementById('budgetTable');
    let rows = table.getElementsByTagName('tr');
    let csvContent = [];

    // Extraer los datos de cada fila y convertirlos en formato CSV
    for (let i = 0; i < rows.length; i++) {
        let row = [];
        let cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csvContent.push(row.join(","));
    }

    // Convertir el contenido a un archivo CSV
    let csvFile = new Blob([csvContent.join("\n")], { type: 'text/csv' });

    // Crear un enlace para la descarga
    let downloadLink = document.createElement("a");
    downloadLink.download = "presupuesto_personal.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    
    // Hacer clic en el enlace para descargar el archivo
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
