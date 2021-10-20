/* Moment JS and Front Page Time */

function updateClock() {
  let today = new Date();
  var formatToday = moment(today).format('MMMM Do YYYY, h:mm a');
  $("#currentDay").html(formatToday);
  setInterval(updateClock, 60 * 1000); // every minute
}
updateClock();

/* Update Time Slots Section */

function timeState() {
  let hours = new Date();
  var time = hours.getHours();

  // make data-attribute values into an array
  var dataArray = [];
  $('.time-block').each( function() {
    dataArray.push( $(this).attr("data-number"));
  })

  // remove any old classes
  let changeClass = $(".time-block");
  $(changeClass).removeClass("past present future");

  for (let i=0; i<dataArray.length; i++) {
    if (time < dataArray[i]) {
      $(changeClass[i]).addClass("future");
    } else if (time === dataArray[i]) {
      $(changeClass[i]).addClass("present");
    } else if (time > dataArray[i]) {
      $(changeClass[i]).addClass("past");
    }
  }
  setInterval(timeState, 600000); // every 10 minutes
}
timeState();

var createTask = function(taskText, taskTitle, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskTitle);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  // check due date
  // auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
}

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
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
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.title, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// trash icon can be dropped onto
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    // remove dragged element from the dom
    ui.draggable.remove();
    $(".bottom-trash").removeClass("bottom-trash-active");
  },
  over: function(event, ui) {
    console.log(ui);
    $(".bottom-trash").addClass("bottom-trash-active");
  },
  out: function(event, ui) {
    $(".bottom-trash").removeClass("bottom-trash-active");
  }
});


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalTitle").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-save").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskTitle = $("#modalTitle").val();

  if (taskText && taskTitle) {
    createTask(taskText, taskTitle, "time8am");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.time8am.push({
      title: taskTitle,
      text: taskText,
    });

    saveTasks();
  }
});

// task text was clicked
$(".list-group").on("click", "p", function() {
  // get current text of p element
  var text = $(this)
    .text()
    .trim();

  // replace p element with a new textarea
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);

  // auto focus new element
  textInput.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function() {
  // get current value of textarea
  var text = $(this).val();

  // get status type and position in the list
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].text = text;
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace textarea with new content
  $(this).replaceWith(taskP);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  console.log(tasks);
  saveTasks();
});

// load tasks for the first time
loadTasks();

// audit task due dates every 30 minutes
setInterval(function() {
  $(".card .list-group-item").each(function() {
    auditTask($(this));
  });
}, 1800000);