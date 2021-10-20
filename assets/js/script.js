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
  $('.card').each( function() {
    dataArray.push( $(this).attr("data-number"));
  })

  // remove any old classes
  let changeClass = $(".card");
  $(changeClass).removeClass("past present future");

  for (let i=0; i<dataArray.length; i++) {
    if (time < parseInt(dataArray[i])) {
      $(changeClass[i]).addClass("future");
    } else if (time === parseInt(dataArray[i])) {
      $(changeClass[i]).addClass("present");
    } else if (time > parseInt(dataArray[i])) {
      $(changeClass[i]).addClass("past");
    }
  }

  setInterval(timeState, 600000); // every 10 minutes
}
timeState();


/* Create, Load, and Save Tasks Section*/

var createTask = function(taskTitle, taskText, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge rounded-pill bg-info")
    .text(taskTitle);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

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
      createTask(task.title, task.text, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

/* Model Section */

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
  var taskTitle = $("#modalTitle").val();
  var taskText = $("#modalTaskDescription").val();

  if (taskText && taskTitle) {
    createTask(taskTitle, taskText, "time8am");

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

/* Click Changing Task Title Section */

$(".list-group").on("click", "span", function() {
  // get current text
  var title = $(this)
    .text()
    .trim();

  // create new input element
  var titleInput = $("<input>").attr("type", "text").addClass("form-control").val(title);
  $(this).replaceWith(titleInput);

  // auto focus new element
  titleInput.trigger("focus");
});

// value of title was changed
$(".list-group").on("change", "input[type='text']", function() {
  var title = $(this).val();

  // get status type and position in the list
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].title = title;
  saveTasks();

  // recreate span and insert in place of input element
  var taskSpan = $("<span>")
    .addClass("badge rounded-pill bg-info")
    .text(title);
    $(this).replaceWith(taskSpan);
});


/* Click Changing Task Description Section */

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



/* Draggable/Sortable Feature Section */

$(".list-group").sortable({
  // enable dragging across lists
  connectWith: $(".list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event, ui) {
    $(this).addClass("dropover");
    $(".bottom-trash").addClass("bottom-trash-drag");
  },
  deactivate: function(event, ui) {
    $(this).removeClass("dropover");
    $(".bottom-trash").removeClass("bottom-trash-drag");
  },
  over: function(event) {
    $(event.target).addClass("dropover-active");
  },
  out: function(event) {
    $(event.target).removeClass("dropover-active");
  },
  update: function() {
    var tempArr = [];
  
    // loop over current set of children in sortable list
    $(this)
      .children()
      .each(function() {
        // save values in temp array
        tempArr.push({
          title: $(this)
          .find("span")
          .text()
          .trim(),
          text: $(this)
            .find("p")
            .text()
            .trim(),
        });
      });

    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});


/* Trash Droppable Icon Section */

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


/* Remove All Tasks Section */

$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();