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
  // auditTask(taskLi);

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
  $('.row').each( function() {
    dataArray.push( $(this).attr("data-number"));
  })

  // remove any old classes
  let changeClass = $(".row");
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


/* Draggable & Sortable Feature on List-Group Elements */

$(".list-group").sortable({
  //enable dragging across lists
  connectWith: $(".list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event, ui) {
    $(this).addClass("dropover");
    $(".right-trash").addClass("right-trash-drag");
  },
  deactivate: function(event, ui) {
    $(this).removeClass("dropover");
    $(".right-trash").removeClass("right-trash-drag");
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
        tempArr.push({
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

//

loadTasks();

setInterval(function() {
  $(".list-group-item").each(function() {
    auditTask($(this));
  });
}, 1800000);
