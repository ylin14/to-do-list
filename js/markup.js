function createTaskMarkup (tasks) {
    return tasks.map(({text, id, statusDone, isArchived}) => {
        return `<li data-id="${id}" class="${statusDone ? 'checked' : ''}" data-archived="${isArchived ? 'true' : ''}" data-action="done">
            ${text}
            <button type="button"  class="button-17" data-action="${isArchived ? 'unarchive' : 'archive'}">&#9885;</button>
            <button type="button"  class="button-17" data-action="close">&#10006;</button>
        </li>`
    }).join("");
} 

function addMarkup(ref, str) {
    ref.innerHTML = str;
}


export {createTaskMarkup, addMarkup};