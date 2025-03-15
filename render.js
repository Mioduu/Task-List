const task = document.getElementById("task")
const button = document.getElementById("button")
const input = document.getElementById("input")
const deleteTask = document.getElementById("delete")
const refresh = document.getElementById("refresh")
const delSingleTask = document.getElementById("delTask")

let taskList = []

try {
    taskList = JSON.parse(localStorage.getItem("tasks")) || []
} catch (e) {
    console.error("Błąd parsowania z LocalStorage: ", e)
    taskList = []
}

button.onclick = () => {
    inputValue = input.value.trim()
    if(inputValue !== "") {
        taskList.push(inputValue + "<br>")
        renderList()
        input.value = ""
    } else {
        alert("Nie możesz dodać pustego pola!")
    }
}



deleteTask.onclick = () => {
    taskList.pop()
    renderList()
}

const removeTask = (index) => {
    taskList.splice(index, 1)
    renderList()
} 

const renderList = () => {
    task.innerHTML = ""
    taskListContainer = document.createElement("div")

    taskList.forEach((taskText, index) => {
        let data = new Date()
        let dzien = data.getUTCDate()
        let miesiac = data.getUTCMonth() + 1
        let rok = data.getUTCFullYear()
        const taskItem = document.createElement("div")
        taskItem.style.display = "flex"
        taskItem.style.alignItems = "center"
        taskItem.style.gap = "10px"
        taskItem.style.marginTop = "5px"

        const taskTextElement = document.createElement("span")
        taskTextElement.innerHTML = `- ${taskText} Data dodania: ${dzien} / ${miesiac} / ${rok}`

        const removeButton = document.createElement("button")
        removeButton.textContent = "Remove"
        removeButton.style.background = "rgb(139, 116, 146)"
        removeButton.style.color = "white"
        removeButton.style.border = "none"
        removeButton.style.width = "100px"
        removeButton.style.height = "35px"
        removeButton.style.cursor = "pointer"

        removeButton.onclick = () => removeTask(index)

        taskItem.appendChild(taskTextElement)
        taskItem.appendChild(removeButton)

        taskListContainer.appendChild(taskItem)
    })
    task.appendChild(taskListContainer)

    localStorage.setItem("tasks", JSON.stringify(taskList))
}

renderList()