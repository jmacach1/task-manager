let taskForm;
window.onload = init;

function init() {
  console.log("Task Manager!")
  taskForm = document.forms['taskForm'];
  taskForm.addEventListener('submit', submitTaskForm);
  testAddTask();
}

function submitTaskForm (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const validTaskData = validateTaskInput(formData);
  if (!validTaskData.valid) {
    console.error("Invalid Task Input");
    alert("Invalid Task Input");
    return;
  }

  const task = createTask(validTaskData);
  console.log(task);
}

function validateTaskInput(data) {
  console.log("validateTaskInput", data);
  const task = { valid : true};
  for (const [name,value] of data) {
    task[name] = value;
    console.log(name, value)
    if (value === "") {
      task.valid = false; 
    }
  }
  task.important = task.important === 'on' ? true : false; 
  return task;
}

function createTask(taskData) {
  console.log("createTask", taskData);
  const { title, description, important, dueDate, location, alertText, status } = taskData;
  return new Task(title, description, important, dueDate, location, alertText, status);
}
