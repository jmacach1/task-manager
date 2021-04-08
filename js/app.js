const dev = false;
let taskForm;
let taskList;
window.onload = init;

const URL = `http://fsdi.azurewebsites.net/api`;

function init() {
  console.log("Task Manager!")
  taskForm = document.forms['taskForm'];
  taskList = $('#taskList');
  taskForm.addEventListener('submit', submitTaskForm);
  if (dev) testAddTask();
  fetchTask();
}

function fetchTask() {
  console.log("Ajax GET - fetching tasks from server...")
  $.ajax({
    type: "GET",
    url: URL + "/tasks",
    success: function (res) {
      const jeraldTask = res.filter(task => task.user === 'Jerald');
      for (const task of jeraldTask) {
        displayTask(task);
      }
      console.log(jeraldTask);
    },
    error: function (error) {
      console.error(error);
    }
  });
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
  httpPostSendTask(task); 
  console.log(task);
}

function httpPostSendTask(task) {
  console.log("Making Ajax request - sending Task...")
  $.ajax({
    type: "POST",
    url: URL + "/tasks",
    contentType: 'application/json',
    data: JSON.stringify(task),
    success: function (res) {
      displayTask(res);
      console.log(res);
    },
    error: function (error) {
      console.error(error);
    }
  });
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

function displayTask(task) {
  taskList.append(createTaskCard(task));
}


// alertText: "Alert alert alert !!!"
// createdOn: null
// description: "This is a New Task!!"
// dueDate: "2021-04-08T20:08:00.000Z"
// id: 569
// important: true
// location: "Boise, Idaho"
// title: "Test Title"
// user: "Jerald"
function createTaskCard(task) {
  let star = task.important ? `<span class="star"><i class="fa fa-star"></i></span>` : "";
  let taskDate = new Date(task.dueDate).toUTCString();
  return `
    <div class="card tm-card-task">
      <div class="card-header">
        <h5 class="title">
          ${star}
          ${task.title}
        </h5>
        <p>Location: ${task.location}</p>
        <p>Due Date: ${taskDate}</p>
      </div>
      <div class="card-body">
        <p>
          ${task.description}
        </p>
      </div>
    </div>
  `;
}

function testAjax() {
  $.ajax({
    url: URL,
    type: "GET",
    success: function(res) {
      console.log("Yeaay, It worked!!", res);
    },
    error: function(err) {
      console.err("Boo, we have a problem!!");
    }
  });
}

