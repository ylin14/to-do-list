function addToStorage (key, value) {
    let taskList = getFromStorage(key);

    if(taskList) {
        taskList.push(value);
    } else {
        taskList = [value];
    }

    const stringifiedTaskList = JSON.stringify(taskList);
    localStorage.setItem(key, stringifiedTaskList);
}

function getFromStorage (key) {
    const currentTask = localStorage.getItem(key);
    return JSON.parse(currentTask);
}

function deleteFromStorage (key, id) {
    const storageData = getFromStorage(key);
    const updatedList = JSON.stringify(storageData.filter(task => task.id !== id));

    localStorage.setItem(key ,updatedList);
}

export {addToStorage, getFromStorage, deleteFromStorage};