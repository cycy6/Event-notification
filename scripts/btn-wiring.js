// Each button has an ID, "1" to "7", inclusive.
// Each of the 7 button's onclick will map to the same function.
// Passing in its own ID.

let formCollapse;
let listCollapse;
let currentBtn;
let inputForm;
let numTimeSlots = 1;
let request;
let returnData;
let autosuggestionArray;
let numSuggestions;
let formData;
let info = document.getElementsByClassName("form-control");
let timeArray;
let obj = {};
let arr;
let t;
let toastMsg;
var day;
var currentDay;
let btns;
let timeArrayParsed;
let currentHour;
let currentMinute;
let taskHour;
let taskMinute;

const ls = localStorage;

// Database workflow.
// Data Structure of localStorage
// localStorage === 7 property object, each property corresponds to a day of week.
// When we add a task (by pressing the submit btn), we stringify the object, and add it 
// to the current day of week, giving it the property name of numTasks, then incrementing
// numTasks by 1.
// 
// Example of adding one task
// localStorage[currentDay][numTasks++] = JSON.stringify(task)
//
// For parsing localStorage, this is done if there is "history" in localStorage.
//

if (!ls.length) {
  // Initialize it.
  localStorage["Monday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Tuesday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Wednesday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Thursday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Friday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Saturday"] = JSON.stringify({ numTasks: 0 });
  localStorage["Sunday"] = JSON.stringify({ numTasks: 0 });
}

else {
  // TODO.

}

// Build obj
obj["Monday"] = JSON.parse(localStorage["Monday"]);
obj["Tuesday"] = JSON.parse(localStorage["Tuesday"]);
obj["Wednesday"] = JSON.parse(localStorage["Wednesday"]);
obj["Thursday"] = JSON.parse(localStorage["Thursday"]);
obj["Friday"] = JSON.parse(localStorage["Friday"]);
obj["Saturday"] = JSON.parse(localStorage["Saturday"]);
obj["Sunday"] = JSON.parse(localStorage["Sunday"]);


// Initialization function.
// Make form a collapsable element.
formCollapse = new bootstrap.Collapse(document.getElementById('main-form'), {
  toggle: false
});

// Initialize toast
t = document.getElementById('toast-msg');
toastMsg = new bootstrap.Toast(t);

// Make the auto suggestion list a collapsable element.
listCollapse = new bootstrap.Collapse(document.getElementById('medication-div'), {
  toggle: false
});

// Initialize <form> into a FormData object.
inputForm = document.getElementById('main-form');

btns = document.getElementsByClassName("responsive-width");  // HTMLCollection(7)


function btnClickHandler(event) {
  // DEBUGGING CODE
  console.log('id =' + this.id); // will return 1, 2, 3, 4, 5, 6, or 7, depending on the btn clicked.
  console.log('event = ' + event);
  // console.log(this.id);
  let inputForm = document.getElementById("input-form-container");
  globalThis.day = this.id;
  // Open the medication input.
  formCollapse.show();

  // grey out each button, make them unclickable.
  // The only way to make them clickable again is to either press the "#cancelBtn" or "#submitBtn" btns.
  for (const btn of btns) {
    console.log(btn.id);
    if (btn.id == day) {
      continue;
    }
    btn.classList.add('disabled');
  }
}

for (const btn of btns) {
  btn.addEventListener("click", btnClickHandler);
}

// Wire the form's 3 buttons, #submitBtn, #resetBtn, and #cancelBtn
document.getElementById('submitBtn').addEventListener("click", () => {
  // Make sure required information is filled out by the user.
  // Submit the form.

  info = document.getElementsByClassName("form-control");
  //info[0].value --> medication
  //info[info.length - 1] --> description
  //info[1] ... info[info.length - 2], inclusive --> timestamps to take.
  arr = Array.from(info);

  switch (globalThis.day) {
    case "1":
      currentDay = "Monday";
      break;

    case "2":
      currentDay = "Tuesday";
      break;

    case "1":
      currentDay = "Wednesday";
      break;

    case "4":
      currentDay = "Thursday";
      break;

    case "5":
      currentDay = "Friday";
      break;

    case "6":
      currentDay = "Saturday";
      break;

    case "7":
      currentDay = "Sunday";
      break;

    default:
      console.log("If you see this in console, we're screwed....");
      break;
  }

  timeArray = arr.slice(1, arr.length - 1);
  timeArrayParsed = [];

  for (let i = 0; i < timeArray.length; ++i) {
    timeArrayParsed.push(timeArray[i].value);
  }
  let todo = { medication: arr[0].value, description: arr[arr.length - 1].value, times: timeArrayParsed };
  obj[currentDay][obj[currentDay].numTasks] = todo;
  obj[currentDay].numTasks++;

  console.log(obj);
  console.log(obj[currentDay]);
  console.log(currentDay);
  console.log(obj[currentDay].numTasks);

  // restore all disabled btns.
  for (const btn of document.getElementsByClassName("responsive-width")) {
    btn.classList.remove('disabled');
  }

  // clear all <input> user text.
  for (var i = 0; i < info.length; ++i) {
    info[i].value = "";
  }

  setInterval(checkReminders, 60000);

  // hide form. Will remove this, just for debugging.
  toastMsg.show();
  formCollapse.hide();
  listCollapse.hide();
  console.log('hey');
});

document.getElementById('resetBtn').addEventListener("click", () => {
  // input="reset" clears the form's data already. But w/e, keep this here.
});

document.getElementById('cancelBtn').addEventListener("click", () => {
  // clear form, and collapse.
  info = document.getElementsByClassName("form-control");

  for (var i = 0; i < info.length; ++i) {
    info[i].value = "";
  }
  // restore all disabled btns.
  for (const btn of document.getElementsByClassName("responsive-width")) {
    btn.classList.remove('disabled');
  }


  formCollapse.hide();
  listCollapse.hide();

});

// Prevent submit button from refreshing page.
document.getElementById('main-form').addEventListener('submit', (e) => e.preventDefault());


// Inside the form is a plus btn, #plusBtn, which adds another <input> to the form.
document.getElementById('plusBtn').addEventListener("click", () => {
  let newTimeInput = document.createElement('input');
  newTimeInput.type = "time";
  newTimeInput.id = `inputTime${numTimeSlots++}`;
  newTimeInput.className = "form-control";
  document.getElementById('growing-list').appendChild(newTimeInput);
})

// Inside the form is a minus btn, #minusBtn, which removes an <input> from the form.
// it will continue to remove until there's 1 left, then does nothing.
document.getElementById('minusBtn').addEventListener("click", () => {
  if (numTimeSlots > 1) {
    let list = document.getElementById('growing-list');
    list.removeChild(list.childNodes[list.childNodes.length - 1]);
    numTimeSlots--;
    console.log(`numTimeSlots = ${numTimeSlots}`);
  }
  else {
    console.log("only 1 <input type='time'> element");
  }

});

btns = document.getElementsByClassName("responsive-width");  // HTMLCollection(7)

function checkReminders() {
  console.log('checkreminders!!');
  let CD = moment().get('day');
  let checkCurrent;
  currentHour = parseInt(moment().format('HH:mm').split(':')[0]);
  currentMinute = parseInt(moment().format('HH:mm').split(':')[1]);


  // switch (CD) {
  //   case '1':
  //     checkCurrent = "Monday";
  //     break;

  //   case '2':
  //     checkCurrent = "Tuesday";
  //     break;

  //   case '3':
  //     checkCurrent = "Wednesday";
  //     break;

  //   case '4':
  //     checkCurrent = "Thursday";
  //     break;

  //   case '5':
  //     checkCurrent = "Friday";
  //     break;

  //   case '6':
  //     checkCurrent = "Saturday"
  //     break;

  //   case '7':
  //     checkCurrent = "Sunday";
  //     break;

  //   default:
  //     console.log("If you see this, you're fucked!");
  //     break;
  // }

  for (let j = 0; j < obj[currentDay].numTasks; ++j) {
    for (let i = 0; i < obj[currentDay][j].times.length; ++i) {
      let x = obj[currentDay][obj[currentDay].numTasks - 1].times[i];
      taskHour = parseInt(x.split(':')[0]);
      taskMinute = parseInt(x.split(':')[1]);

      console.log("j = " + j);
      console.log("i = " + x);
      console.log("taskHour = " + taskHour);
      console.log("taskMinute = " + taskMinute);

      if (currentHour >= taskHour && currentMinute >= taskMinute) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
          focus: true,
          keyboard: false,
          backdrop: 'static'
        });

        var modelTitle = document.getElementById('myModal').querySelector('.modal-title');
        var modelBodyInput = document.getElementById('myModal').querySelector('.modal-body');

        modelTitle.textContent = `TAKE YOUR ${obj[currentDay][j].medication}!`
        modelBodyInput.innerHTML = `REMEMBER: ${obj[currentDay][j].description}`

        myModal.show();
        obj[currentDay][i].times.shift();   // Removes the reminder.
        obj[currentDay].numTasks -= 1;
        

        console.log("IF THIS EXECUTES, WE'RE GOLDEN!");
        // remove so that the todo doesn't keep executing every minute.
      }
    }
  }
}