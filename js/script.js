import {LOCALSTORAGE_ARCHIVED, LOCALSTORAGE_KEY} from "./constant.js";
import { addTaskButtonRef, taskListRef, inputCreateTaskRef, grybochkyPicker } from "./refs.js";
import { addToStorage, getFromStorage, deleteFromStorage } from "./APIStorage.js";
import { createTaskMarkup, addMarkup } from "./markup.js";
import { createTaskDataObj } from "./storageModel.js";

// TODO: Видалення елемента списку.
// TODO: Закреслення виконаної таски.

function onAddBtnClick () {
    const taskValue = inputCreateTaskRef.value.trim();

    if(!taskValue) {
        return
    }

    const createdTaskObj = createTaskDataObj(taskValue);
    inputCreateTaskRef.value = "";
    addToStorage(LOCALSTORAGE_KEY, createdTaskObj);
    addNewTask(LOCALSTORAGE_KEY);
}

function addNewTask(key) {
    const tasks = getFromStorage(key);
    const taskMarkup = createTaskMarkup(tasks);
    addMarkup(taskListRef, taskMarkup);
}

function init() {
    const tasksItems = getFromStorage(LOCALSTORAGE_KEY);
    if(!tasksItems) {
        return
    }
    const itemsMarkup = createTaskMarkup(tasksItems);
    addMarkup(taskListRef, itemsMarkup);
}

function handleAction (event) {
    const target = event.target;
    let taskId;
    let isArchived;

    switch (target.dataset.action) {
        case 'archive':
            taskId = Number(target.parentNode.dataset.id);
            archiveTask (taskId);
            break;
        case 'unarchive':
            taskId = Number(target.parentNode.dataset.id);
            unarchive (taskId);
            break;
        case 'close':
            taskId = Number(target.parentNode.dataset.id);
            isArchived = !!target.parentNode.dataset.archived;
            deleteTask(taskId, isArchived);
            break;
        case 'done':
            taskId = Number(target.dataset.id);
            isArchived = !!target.dataset.archived;
            changeStatus(taskId, isArchived);
            break;
        default:
            return console.log('Куда тикаєш, псюка?')
    }
}

function onGrybochkyPicker (event) {
    if(event.target.dataset.type === "current") {
        const activeStorageTasks = getFromStorage(LOCALSTORAGE_KEY);
        const currentTasks = createTaskMarkup(activeStorageTasks);
        addMarkup(taskListRef, currentTasks);
    } else if(event.target.dataset.type === "archive") {
        const archivedStorageTasks = getFromStorage(LOCALSTORAGE_ARCHIVED);
        const archivedTasks = createTaskMarkup(archivedStorageTasks);
        addMarkup(taskListRef, archivedTasks);
    }
}

function deleteTask (taskId, isArchived) {
    const storageKey = isArchived ? LOCALSTORAGE_ARCHIVED : LOCALSTORAGE_KEY;
    deleteFromStorage(storageKey, taskId);
    const storageTasks = getFromStorage(storageKey);
    const tasks = createTaskMarkup(storageTasks);
    addMarkup(taskListRef, tasks);
}

function archiveTask (taskId) {
    const activeStorageTasks = getFromStorage(LOCALSTORAGE_KEY);
    const taskObj = activeStorageTasks.filter(task => task.id === taskId)[0];
    const currentActiveTasks = activeStorageTasks.filter(task => task.id !== taskId);

    taskObj.isArchived = true;

    deleteFromStorage(LOCALSTORAGE_KEY, taskId);

    const updatedTasksMarkup = createTaskMarkup(currentActiveTasks);
    addToStorage(LOCALSTORAGE_ARCHIVED, taskObj);
    addMarkup(taskListRef, updatedTasksMarkup);
}

function unarchive (taskId) {
    const archiveStorageTasks = getFromStorage(LOCALSTORAGE_ARCHIVED);
    const taskObj = archiveStorageTasks.filter(task => task.id === taskId)[0];
    console.log(taskObj)
    const currentArchiveTasks = archiveStorageTasks.filter(task => task.id !== taskId);

    taskObj.isArchived = false;

    deleteFromStorage(LOCALSTORAGE_ARCHIVED, taskId);
    addToStorage(LOCALSTORAGE_KEY, taskObj);

    const updatedTasksMarkup = createTaskMarkup(currentArchiveTasks);
    addMarkup(taskListRef, updatedTasksMarkup);
}

function changeStatus(taskId, isArchived) {
    const storageKey = isArchived ? LOCALSTORAGE_ARCHIVED : LOCALSTORAGE_KEY;
    const activeStorageTasks = getFromStorage(storageKey);
    const taskObj = activeStorageTasks.filter(task => task.id === taskId)[0];
    const currentActiveTasks = activeStorageTasks.filter(task => task.id !== taskId);

    taskObj.statusDone = !taskObj.statusDone;
    currentActiveTasks.push(taskObj)

    deleteFromStorage(storageKey, taskId);

    addToStorage(storageKey, taskObj);

    const tasks = createTaskMarkup(currentActiveTasks);
    addMarkup(taskListRef, tasks);
}

init();

addTaskButtonRef.addEventListener("click", onAddBtnClick);
taskListRef.addEventListener('click', handleAction);
grybochkyPicker.addEventListener('click', onGrybochkyPicker)
