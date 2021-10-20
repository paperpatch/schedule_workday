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


/* Make Add & Trash Place Appear on Hover */

// let mouseEnter = $(".row").attr("data-number");
// console.log(mouseEnter);

// $(".row").mouseenter(function() {
//   $(".btn").removeClass("hide");
// })
// $(".row").mouseleave(function() {
//   $(".btn").addClass("hide");
// })

$(".row").on({
  mouseenter: function() {
    let dataNumber = $(".row").attr("data-number");

    let dataBtn = [];
    $('.btn').each( function() {
      dataBtn.push( $(this).attr("data-number"));
    })

    for (let i=0; i<dataBtn.length; i++) {
      if (dataBtn[i] === dataNumber) {
        $(dataBtn[i]).removeClass("hide");
        console.log(dataBtn[i]);
      }
    }
  }
  
});
/*   mouseleave: function() {
    let dataNumber = [];
    $('.row').each( function() {
      dataNumber.push( $(this).attr("data-number"));
    })

    for (let i=0; i<dataNumber.length; i++) {
      if ($(".btn").attr("data-number") === dataNumber[i]) {
        $(dataBtn[i]).addClass("hide");
      }
    }
    console.log("add 'hide'");
  } */