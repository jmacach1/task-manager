function testAddTask() {
  console.log('testAddTask');
  const elements = document.forms['taskForm'].elements;
  // elements[TASK_CONST.ID].value = "12356";
  elements[TASK_CONST.TITLE].value = "Test Title";
  elements[TASK_CONST.DESCRIPTION].value = "This is a New Task!!";
  elements[TASK_CONST.IMPORTANT].checked = 'true';
  elements[TASK_CONST.DUE_DATE].value = "2021-04-08T20:08";
  elements[TASK_CONST.LOCATION].value = 'Boise, Idaho';
  elements[TASK_CONST.ALERT_TEXT].value = "Alert alert alert !!!";
  elements[TASK_CONST.STATUS].value = "Pending";
}
