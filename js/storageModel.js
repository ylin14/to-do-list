function createTaskDataObj (text, isArchived= false, statusDone = false) {
    return {
        text,
        id: Date.now(),
        statusDone,
        isArchived
    }
}

export {createTaskDataObj};