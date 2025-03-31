const { ipcRenderer } = require("electron")

const task = document.getElementById("task")
const button = document.getElementById("button")
const input = document.getElementById("input")
const deadlineInput = document.getElementById("deadlineInput")
const home = document.getElementById("homeButton")
const settings = document.getElementById("settingsButton")
const homeSection = document.getElementById("homeSection")
const settingsSection = document.getElementById("settingsSection")
const finishedTaskSection = document.getElementById("finishedTasksSection")

let taskList = []
let finishedTasks = []


try {
    taskList = JSON.parse(localStorage.getItem("tasks")) || []
    finishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || []
} catch (e) {
    console.error("Błąd parsowania z LocalStorage: ", e)
    taskList = []
    finishedTasks = []
}


flatpickr(deadlineInput, {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    time_24hr: true
})

button.onclick = () => {
    let inputValue = input.value.trim()
    let deadlineValue = deadlineInput.value.trim()
    if(inputValue !== "") {
        let taskObjects = {
            text: inputValue,
            deadline: deadlineValue || "Brak"
        }

        taskList.push(taskObjects)
        renderList()
        input.value = ""
        deadlineInput.value = ""
    } else {
        alert("Nie możesz dodać pustego pola!")
    }
}


const removeTask = (index) => {
    taskList.splice(index, 1)
    renderList()
} 

const renderList = () => {
    task.innerHTML = ""
    taskListContainer = document.createElement("div")

    taskList.forEach((taskObj, index) => {
        let {text, deadline} = taskObj
        let data = new Date()
        let dzien = data.getUTCDate()
        let miesiac = data.getUTCMonth() + 1
        let rok = data.getUTCFullYear()
        let dataDodania = "Data dodania: "
        
        const taskItem = document.createElement("div")
        taskItem.style.display = "flex"
        taskItem.style.alignItems = "center"
        taskItem.style.gap = "10px"
        taskItem.style.marginTop = "5px"

        const taskTextElement = document.createElement("span")
        taskTextElement.innerHTML = `- ${text}
        <span style="font-size: 12px; color: gray;">${dataDodania}
        <span style="font-size: 14px; font-weight: bold;">${dzien}</span> /
        <span style="font-size: 14px; font-weight: bold;">${miesiac}</span> /
        <span style="font-size: 14px; font-weight: bold;">${rok}</span>
        <span style="font-size: 50px; font-weight: bold; color: red;">| Dead Line: ${deadline}</span>
        </span>`;

        const removeButton = document.createElement("button")
        removeButton.textContent = "Remove"
        removeButton.style.background = "#D63031"
        removeButton.style.color = "white"
        removeButton.style.border = "none"
        removeButton.style.width = "100px"
        removeButton.style.height = "35px"
        removeButton.style.cursor = "pointer"

        const checkIn = document.createElement("input")
        checkIn.type = "checkbox"
        checkIn.style.color = "white"
        checkIn.style.border = "none"
        checkIn.style.width = "100px"
        checkIn.style.height = "35px"
        checkIn.style.cursor = "pointer"

        checkIn.addEventListener("change", function () {
            if(this.checked) {
                taskItem.classList.add("fade-out")

                setTimeout(() => {
                    finishedTasks.push(taskObj)
                    taskList.splice(index, 1)
                    localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks))
                    localStorage.setItem("tasks", JSON.stringify(taskList))
                    renderList()
                    renderFinishedTasks()
                }, 500)
            }
        })

        removeButton.onclick = () => removeTask(index)
        taskItem.appendChild(taskTextElement)
        taskItem.appendChild(removeButton)
        taskItem.appendChild(checkIn)

        taskListContainer.appendChild(taskItem)
    })
    task.appendChild(taskListContainer)

    localStorage.setItem("tasks", JSON.stringify(taskList))
}

const renderFinishedTasks = () => {
    const finishedTasksContainer = document.getElementById("finishedTasks")
    finishedTasksContainer.innerHTML = ""

    finishedTasks.forEach((taskObj, index) => {
        const taskItem = document.createElement("div")
        taskItem.style.display = "flex"
        taskItem.style.alignItems = "center"
        taskItem.style.gap = "10px"
        taskItem.style.marginTop = "5px"

        const taskTextElement = document.createElement("span")
        taskTextElement.innerHTML = `✔ ${taskObj.text} (Deadline: ${taskObj.deadline})`
        taskTextElement.style.color = "green"

        const removeButton = document.createElement("button")
        removeButton.textContent = "Delete"
        removeButton.style.background = "#D63031"
        removeButton.style.color = "white"
        removeButton.style.border = "none"
        removeButton.style.width = "100px"
        removeButton.style.height = "35px"
        removeButton.style.cursor = "pointer"

        removeButton.onclick = () => {
            finishedTasks.splice(index, 1)
            localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks))
            renderFinishedTasks()
        }

        taskItem.appendChild(taskTextElement)
        taskItem.appendChild(removeButton)
        finishedTasksContainer.appendChild(taskItem)
    })
}

document.getElementById("homeButton").addEventListener("click", function () {
    this.classList.toggle("clicked");
    settings.classList.remove("clicked")
    checkList.classList.remove("clicked")
    homeSection.style.display = "block"
    settingsSection.style.display = "none"
    finishedTaskSection.style.display = "none"
    
});
document.getElementById("settingsButton").addEventListener("click", function () {
    this.classList.toggle("clicked")
    home.classList.remove("clicked")
    checkList.classList.remove("clicked")
    settingsSection.style.display = "block"
    homeSection.style.display = "none"
    finishedTaskSection.style.display = "none"
})
document.getElementById("checkList").addEventListener("click", function () {
    this.classList.toggle("clicked")
    home.classList.remove("clicked")
    settings.classList.remove("clicked")
    finishedTaskSection.style.display = "block"
    homeSection.style.display = "none"
    settingsSection.style.display = "none"
});

document.getElementById("nightModeButton").addEventListener("click", function () {
    document.body.style.background = "#181A1B"; 
    document.body.style.color = "#CCCCCC";

    document.getElementById("input").style.background = "#3B4048";
    document.getElementById("input").style.color = "#FFFFFF";
    document.getElementById("input").style.border = "2px solid #555";

    document.getElementById("button").style.backgroundColor = "#2BAE66";
    document.getElementById("button").style.color = "#FFFFFF";

    document.getElementById("task").style.color = "#3498DB";
    document.getElementById("task").style.borderColor = "#3B4048";

    document.getElementById("title").style.color = "#FFFFFF";

    document.getElementById("navBar").style.backgroundColor = "#101111";
});

document.getElementById("dayModeButton").addEventListener("click", function () {
    document.body.style.background = "#2B2B2B";  
    document.body.style.color = "#E0E0E0";  

    document.getElementById("input").style.background = "#3A3A3A";  
    document.getElementById("input").style.color = "#E0E0E0";
    document.getElementById("input").style.border = "2px solid #5A5A5A";

    document.getElementById("button").style.backgroundColor = "#3D85C6";  
    document.getElementById("button").style.color = "#FFFFFF";

    document.getElementById("task").style.color = "#1A936F";  
    document.getElementById("task").style.borderColor = "#5A5A5A";

    document.getElementById("title").style.color = "#D0D0D0";  

    document.getElementById("navBar").style.backgroundColor = "#383838";  
});

function parseDeadline(deadlineString) {
    const parts = deadlineString.split(" ")
    if(parts.length !== 2) return null

    const dateParts = parts[0].split("/")
    const timeParts = parts[1].split(":")

    if (dateParts.length !== 3 || timeParts.length !== 2) return null

    return new Date(
        dateParts[2],
        dateParts[1] - 1,
        dateParts[0],
        timeParts[0],
        timeParts[1]
    )
}

function checkDeadline() {
    const now = new Date()
    taskList.forEach(task => {
        if(task.deadline && task.deadline !== "Brak") {
            let deadlineDate = parseDeadline(task.deadline)

            if(deadlineDate && deadlineDate <= now) {
                ipcRenderer.send("Deadline Reached", task.text)
            }
        }
    })
}



setInterval(checkDeadline, 60000)

renderList()
renderFinishedTasks()