function inputs(userName, bookName, type) {
    this.userName = userName;
    this.bookName = bookName;
    this.type = type;
}

class Display {
    constructor() { }

    add(arrayInputs) {
        let tableBody = document.getElementById("table-body");
        let today = new Date().toLocaleDateString();
        let htmlToBeAdded = "";

        for (let i = 0; i < arrayInputs.length; i++) {
            htmlToBeAdded += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${today}</td>
                    <td>${arrayInputs[i].userName}</td>
                    <td>${arrayInputs[i].bookName}</td>
                    <td>${arrayInputs[i].type}</td>
                    <td><button type="button" onclick="deleteItem(${i})" class="dlt-btn btn-primary">Delete</button></td>
                </tr>`;
        }
        tableBody.innerHTML = htmlToBeAdded;
    }

    clear() {
        document.getElementById("mylibraryform").reset();
    }

    validate(inputs) {
        return inputs.userName !== "" && inputs.bookName !== "";
    }

    alertUser(type, sub, message) {
        let alertUser = document.getElementById("alertuser");
        let alertHTML = `<div class="alert alert-${type} alert-dismissible fade show">
                            <strong>${sub}</strong> ${message}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                &times;
                            </button></div>`;
        alertUser.innerHTML = alertHTML;
        setTimeout(() => {
            alertUser.innerHTML = "";
        }, 4000);
    }

    checkIssue(listArray, o1) {
        for (let i = 0; i < listArray.length; i++) {
            if (listArray[i].bookName === o1.bookName && listArray[i].userName === o1.userName) {
                this.issuedUser = listArray[i].userName;
                return false; // Book is already issued
            }
        }
        return true; // Book can be issued
    }
}

function showList() {
    let listItems = localStorage.getItem("listItems");
    let listArray = listItems ? JSON.parse(listItems) : [];
    new Display().add(listArray);
}

showList(); // Display the list on page load

function deleteItem(index) {
    let listItems = localStorage.getItem("listItems");
    let listArray = listItems ? JSON.parse(listItems) : [];
    listArray.splice(index, 1);
    localStorage.setItem("listItems", JSON.stringify(listArray));
    showList();
}

const form = document.getElementById("mylibraryform");
form.addEventListener("submit", formSubmit);

function formSubmit(e) {
    e.preventDefault();

    let givenUserName = document.getElementById("User-Name").value;
    let givenBookName = document.getElementById("Book-Name").value;
    let givenType;

    if (document.getElementById("Fiction").checked) {
        givenType = "Fiction";
    } else if (document.getElementById("Programming").checked) {
        givenType = "Programming";
    } else if (document.getElementById("Cooking").checked) {
        givenType = "Cooking";
    }

    let o1 = new inputs(givenUserName, givenBookName, givenType);
    let displayObj = new Display();

    let listItems = localStorage.getItem("listItems");
    let listArray = listItems ? JSON.parse(listItems) : [];

    if (displayObj.validate(o1)) {
        if (displayObj.checkIssue(listArray, o1)) {
            listArray.push(o1);
            localStorage.setItem("listItems", JSON.stringify(listArray));
            displayObj.add(listArray);
            displayObj.clear();
            displayObj.alertUser("success", "Success", "Book is issued.");
        } else {
            displayObj.alertUser("danger", "Oops!", `Book is already issued by ${displayObj.issuedUser}`);
        }
    } else {
        displayObj.alertUser("danger", "Error", "Please fill all fields.");
    }
}
