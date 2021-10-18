var tasks = {};

/* Create Task Section */

var createTask = function(taskText, /* taskDate, */ taskList) {
  var taskLi = $("<li>").addClass("list-group-item");
  // var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);
  
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append p element to parent li
  taskLi.append(taskP);

  // check due date
  auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
}

/* Loading Webpage Section */

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localstorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      time8am: [],
      time9am: [],
      time10am: [],
      time11am: [],
      time12pm: [],
      time1pm: [],
      time2pm: [],
      time3pm: [],
      time4pm: [],
      time5pm: [],
      time6pm: [],
      time7pm: [],
      time8pm: [],
      time9pm: [],
      time10pm: [],
    };
  };

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, /* task.date, */ list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Draggable & Sortable Feature on List-Group Elements */

$(".list-group").sortable({
  //enable dragging across lists
  connectWith: $(".list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event, ui) {
    $(this).addClass("dropover");
    $(".bottom-trash").addClass("bottom-trash-drag")
  }
})

//

loadTasks();

setInterval(function() {
  $(".list-group-item").each(function() {
    auditTask($(this));
  });
}, 1800000);
