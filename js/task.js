const TASK_CONST = {
  ID: '_id',
  TITLE: 'title',
  DESCRIPTION: 'description',
  IMPORTANT: 'important',
  DUE_DATE: 'dueDate',
  LOCATION: 'location',
  ALERT_TEXT: 'alertText',
  STATUS: 'status'
}

class Task {
  constructor(title, description, important, dueDate, location, alertText, status) {
    this.title = title;
    this.description = description;
    this.important = important;
    this.dueDate = dueDate;
    this.location = location;
    this.alertText = alertText;
    this.status = status;
    this.user = "Jerald";
  }
}
