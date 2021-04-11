const dev = true;

const URL = `http://fsdi.azurewebsites.net/api`;
let taskForm, taskList;
const taskInputs = {};
const taskDB = new Map();

window.onload = init;

function init() {
  console.log("Task Manager!")
  initDomElements();
  if (dev) testAddTask();
  fetchTask();
  setEventListeners();
}

function initDomElements() {
  console.log('initDomElements()', 'getting DOM elements')
  taskForm = document.forms['taskForm'];
  taskList = $('#taskList');
  taskInputs[TASK_CONST.ID] = $('#' + TASK_CONST.ID);
  taskInputs[TASK_CONST.TITLE] = $('#' + TASK_CONST.TITLE); 
  taskInputs[TASK_CONST.DESCRIPTION] = $('#' + TASK_CONST.DESCRIPTION);
  taskInputs[TASK_CONST.IMPORTANT]  = $('#' + TASK_CONST.IMPORTANT);
  taskInputs[TASK_CONST.DUE_DATE]= $('#' + TASK_CONST.DUE_DATE);
  taskInputs[TASK_CONST.LOCATION] = $('#' + TASK_CONST.LOCATION);
  taskInputs[TASK_CONST.ALERT_TEXT]  = $('#' + TASK_CONST.ALERT_TEXT);
  taskInputs[TASK_CONST.STATUS]  = $('#' + TASK_CONST.STATUS);
}

function setEventListeners() {
  taskForm.addEventListener('submit', submitTaskForm);
}

function fetchTask() {
  console.log("Ajax GET - fetching tasks from server...")
  $.ajax({
    type: "GET",
    url: URL + "/tasks",
    success: function (res) {
      const filtered = res.filter(task => task.user === 'Jerald');
      for (const task of filtered) {
        taskDB.set(task.id, task);
        displayTask(task);
      }
      console.log(taskDB);
      setTaskListeners();
    },
    error: function (error) {
      console.error(error);
    }
  });
}

function setTaskListeners() {
  const tasks = taskList.children();
  for (const task of tasks) {
    $(task).off();
    $(task).click(function (e) {
      const id = Number(e.currentTarget.dataset.id);
      console.log(id);
      const task = taskDB.get(id);
      console.log(taskDB);
      console.log(task);
      populateDetails(task);
    })
  }
}

function submitTaskForm (event) {
  event.preventDefault();
  const validTask = validateTaskInput();
  if (!validTask) {
    console.error("Invalid Task Input");
    alert("Invalid Task Input");
    return;
  }

  const task = createTask();
  clearTaskFrom();
  httpPostSendTask(task); 
  console.log(task);
}

function validateTaskInput() {
  console.log("validateTaskInput");
  const valid = taskForm.checkValidity();
  // const validTitle = taskInputs[TASK_CONST.TITLE].val().length > 5;
  if(!valid) taskForm.classList.add('was-validated');
  return valid;
}

function createTask(taskData) {
  console.log("createTask", taskData);
  const title = taskInputs[TASK_CONST.TITLE].val();
  const description = taskInputs[TASK_CONST.DESCRIPTION].val();
  const important = taskInputs[TASK_CONST.IMPORTANT].prop('checked');
  const dueDate = taskInputs[TASK_CONST.DUE_DATE].val();
  const location = taskInputs[TASK_CONST.LOCATION].val();
  const alertText = taskInputs[TASK_CONST.ALERT_TEXT].val();
  const status = taskInputs[TASK_CONST.STATUS].val();
  return new Task(title, description, important, dueDate, location, alertText, status);
}

function clearTaskFrom() {
  taskInputs[TASK_CONST.ID].val("");
  taskInputs[TASK_CONST.TITLE].val("");
  taskInputs[TASK_CONST.DESCRIPTION].val("");
  taskInputs[TASK_CONST.IMPORTANT].val("");
  taskInputs[TASK_CONST.DUE_DATE].val("");
  taskInputs[TASK_CONST.LOCATION].val("");
  taskInputs[TASK_CONST.ALERT_TEXT].val("");
  taskInputs[TASK_CONST.STATUS].children()[0].selected = true;
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

function displayTask(task) {
  taskList.append(createTaskCard(task));
}

function createTaskCard(task) {
  const star = task.important ? `<span class="star"><i class="fa fa-star"></i></span>` : "";
  const taskDate = new Date(task.dueDate);
  const date = taskDate.toDateString();
  const time = taskDate.toLocaleString('en-US', 
    { hour: 'numeric', minute: 'numeric', hour12: true });
  return `
    <div id="task_${task.id}" class="card tm-card-task" data-id="${task.id}">
      <div class="card-header">
        <h5 class="title">
          ${star}
          ${task.title}
        </h5>
        <p>Location: ${task.location}</p>
        <p>Due Date: ${date} ${time}</p>
        <p>Status: ${task.status}</p>
      </div>
      <div class="card-body">
        <p>
          ${task.description}
        </p>
      </div>
    </div>
  `;
}

function populateDetails(task) {
  console.log("populateDetails(task)");
  taskInputs[TASK_CONST.ID].val(task.id);
  taskInputs[TASK_CONST.TITLE].val(task.title);
  taskInputs[TASK_CONST.DESCRIPTION].val(task.description);
  taskInputs[TASK_CONST.IMPORTANT].val(task.important);
  taskInputs[TASK_CONST.DUE_DATE].val(task.dueDate);
  taskInputs[TASK_CONST.LOCATION].val(task.location);
  taskInputs[TASK_CONST.ALERT_TEXT].val(task.alertText);
  taskInputs[TASK_CONST.STATUS].val(task.status);
}

// function testAjax() {
//   $.ajax({
//     url: URL,
//     type: "GET",
//     success: function(res) {
//       console.log("Yeaay, It worked!!", res);
//     },
//     error: function(err) {
//       console.err("Boo, we have a problem!!");
//     }
//   });
// }

