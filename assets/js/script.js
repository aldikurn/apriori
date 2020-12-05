window.data = null;

// window.onbeforeunload = function(e) {
//     return 'Dialog text here.';
//  };

fetch('data.json')
  .then(response => response.json())
  .then(data => {
      window.data = data;
      refreshData();
  });

document.getElementById('import').addEventListener('click', function(e) {
    let files = document.getElementById('import-input').files;
    if (files.length <= 0) {
        return false;
    }

    let fileReader = new FileReader();
    fileReader.onload = function(e) { 
        window.data = JSON.parse(e.target.result);
    }
    fileReader.readAsText(files.item(0));
});

function refreshData() {
    refreshDataRule();
    refreshDataitem();
    refreshDataTransaction();
}

function getIndex(id, array) {
    return array.findIndex(x => x.id === id);
}

function showToast(message) {
    document.getElementById('toastMessage').textContent = message;
    $('#toastNotification').toast('show');
}

// Rule
let selectedRuleID = null;
let ruleEditForm = document.forms['ruleEditForm'];

function refreshDataRule() {
    const tbody = document.getElementById('rules-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    window.data.rules.forEach(element => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${element.id}
            </td>
            <td>
                ${element.name}
            </td>
            <td>
                ${element.minimumSupport}%
            </td>
            <td>
                <button onclick="editRule('${element.id}')" class="btn btn-sm btn-outline-info">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editRule(id) {
    selectedRuleID = id;
    index = getIndex(selectedRuleID, window.data.rules);

    ruleEditForm['idInput'].value = window.data.rules[index].id;
    ruleEditForm['nameInput'].value = window.data.rules[index].name;
    ruleEditForm['minimumSupportInput'].value = window.data.rules[index].minimumSupport;

    $('#ruleEditModal').modal('show');
}

document.querySelector('#ruleEditModal .saveButton').addEventListener('click', function(event) {
    index = getIndex(selectedRuleID, window.data.rules);

    window.data.rules[index].id = ruleEditForm['idInput'].value;
    window.data.rules[index].name = ruleEditForm['nameInput'].value;
    window.data.rules[index].minimumSupport = parseInt(ruleEditForm['minimumSupportInput'].value);

    refreshData();
    $('#ruleEditModal').modal('hide');
    showToast('Berhasil mengubah rule');
});


// Data Barang
let selectedItemID = null;
let itemEditForm = document.forms['itemEditForm'];

function refreshDataitem() {
    const tbody = document.getElementById('items-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    window.data.items.forEach(element => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${element.id}
            </td>
            <td>
                ${element.name}
            </td>
            <td>
                <button onclick="editItem('${element.id}')" class="btn btn-sm btn-outline-info">Edit</button>
                <button onclick="deleteItem('${element.id}')" class="btn btn-sm btn-outline-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('showAddItemModalButton').addEventListener('click', function(event) {
    const lastID = window.data.items.slice(-1)[0].id;
    document.forms['itemAddForm']['idInput'].value = 'A' + (parseInt(lastID.substring(1)) + 1);
    $('#itemAddModal').modal('show');
});

document.querySelector('#itemAddModal .saveButton').addEventListener('click', function(event) {
    const form = document.forms['itemAddForm'];

    if(form['idInput'].value === '' || form['nameInput'].value === '') {
        showToast('Data tidak lengkap');
        return;
    }

    const newData = {
        id : form['idInput'].value,
        name : form['nameInput'].value
    };

    window.data.items.push(newData);

    refreshData();
    $('#itemAddModal').modal('hide');
    showToast('Berhasil menambahkan barang');
});

function editItem(id) {
    selectedItemID = id;
    index = getIndex(selectedItemID, window.data.items);

    if(form['idInput'].value === '' || form['nameInput'].value === '') {
        showToast('Data tidak lengkap');
        return;
    }

    itemEditForm['idInput'].value = window.data.items[index].id;
    itemEditForm['nameInput'].value = window.data.items[index].name;

    $('#itemEditModal').modal('show');
}

document.querySelector('#itemEditModal .saveButton').addEventListener('click', function(event) {
    index = getIndex(selectedItemID, window.data.items);

    window.data.items[index].id = itemEditForm['idInput'].value;
    window.data.items[index].name = itemEditForm['nameInput'].value;

    refreshData();
    $('#itemEditModal').modal('hide');
    showToast('Berhasil mengubah barang');
});

function deleteItem(id) {
    selectedItemID = id;
    index = getIndex(selectedItemID, window.data.items);
    document.getElementById('itemNameToDelete').textContent = window.data.items[index].name;
    $('#itemDeleteModal').modal('show');
}

document.querySelector('#itemDeleteModal .deleteButton').addEventListener('click', function(event) {
    index = getIndex(selectedItemID, window.data.items);
    window.data.items.splice(index, 1);

    refreshData();
    $('#itemDeleteModal').modal('hide');
    showToast('Berhasil menghapus barang');
});



// Transaksi
let selectedTransactionID = null;
// let transactionEditForm = document.forms['transactionEditForm'];

function refreshDataTransaction() {
    const tbody = document.getElementById('transactions-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    window.data.transactions.forEach(element => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${element.id}
            </td>
            <td>
                ${element.itemsId}
            </td>
            <td>
                <button onclick="editItem('${element.id}')" class="btn btn-sm btn-outline-info">Edit</button>
                <button onclick="deleteItem('${element.id}')" class="btn btn-sm btn-outline-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('showAddTransactionModalButton').addEventListener('click', function(event) {
    const lastID = window.data.transactions.slice(-1)[0].id;
    document.forms['transactionAddForm']['idInput'].value = 'T' + (parseInt(lastID.substring(1)) + 1);

    const itemCheckbox = document.querySelector('#transactionAddForm .itemsCheckbox');
    window.data.items.forEach(element => {
        const checkbox = document.createElement('div');
        checkbox.classList.add('form-check', 'form-check-inline');
        checkbox.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${element.id}" id="checkbox${element.id}">
            <label class="form-check-label" for="checkbox${element.id}">${element.name}</label>
        `;
        itemCheckbox.appendChild(checkbox);
    });
    $('#transactionAddModal').modal('show');
});

document.querySelector('#transactionAddModal .saveButton').addEventListener('click', function(event) {
    const form = document.forms['transactionAddForm'];
    const listItemsCheckbox = document.querySelectorAll('#transactionAddForm .itemsCheckbox input[type=checkbox]');

    let isValid = false;
    if(form['idInput'].value === '') {
        isValid = false;
        showToast('Data tidak lengkap');
        return;
    }
    listItemsCheckbox.forEach(element => {
        if(element.checked) {
            isValid = true;
        }
    });
    if(!isValid) {
        showToast('Data tidak lengkap');
        return;
    }

    const newData = {
        id : form['idInput'].value,
        itemsId : []
    };

    listItemsCheckbox.forEach(element => {
        if(element.checked) {
            newData.itemsId.push(element.value);
        } 
    });

    window.data.transactions.push(newData);

    refreshData();
    $('#transactionAddModal').modal('hide');
    showToast('Berhasil menambahkan transaksi');
});