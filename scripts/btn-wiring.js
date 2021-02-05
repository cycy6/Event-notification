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
let info;
let obj = { "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": [] };
let arr;
let t;
let toastMsg;
var day;
var currentDay;
let btns;

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


function btnClickHandler(event, day) {
  // DEBUGGING CODE
  console.log('btnClickHandler(event, day) has a day value of = ' + day); // will return 1, 2, 3, 4, 5, 6, or 7, depending on the btn clicked.
  console.log('btnClickHandler(event, day) has a day value of = ' + event);
  // console.log(this.id);
  let inputForm = document.getElementById("input-form-container");
  globalThis.day = day;
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

// for (const btn of btns) {
//   btn.addEventListener("click", btnClickHandler);
// }

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


  obj[currentDay].push({medication: arr[0].value, description: arr[arr.length - 1].value, times: arr.slice(1, arr.length - 1)});

  // Add to localStorage


  // restore all disabled btns.
  for (const btn of document.getElementsByClassName("responsive-width")) {
    btn.classList.remove('disabled');
  }

  // hide form. Will remove this, just for debugging.
  // TODO: REMOVE THIS EVENTUALLY!

  toastMsg.show();
  formCollapse.hide();
  listCollapse.hide();
});

document.getElementById('resetBtn').addEventListener("click", () => {
  // input="reset" clears the form's data already. But w/e, keep this here.
});

document.getElementById('cancelBtn').addEventListener("click", () => {
  // clear form, and collapse.
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

// Write <input> for medication to use fuzzy matching
// new Def.Autocompleter.Prefetch('drug_strengths', []);
// new Def.Autocompleter.Search('rxterms', 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
// Def.Autocompleter.Event.observeListSelections('rxterms', function () {
//   var drugField = document.getElementById('inputMedication')[0];
//   var autocomp = drugField.autocomp;
//   var strengths =
//     autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
//   if (strengths)
//     $('#drug_strengths')[0].autocomp.setListAndField(strengths, '');
// });


// Assign btn IDs programmatically to each button [1, 7] inclusive.
// for (let i = 1; i <= 7; ++i) {
//   let btns = document.querySelectorAll('button');

//   btns[i - 1].setAttribute('id', i);
// }

btns = document.getElementsByClassName("responsive-width");  // HTMLCollection(7)

function btnClickHandler(event, day) {
  // DEBUGGING CODE
  // console.log(day); // will return 1, 2, 3, 4, 5, 6, or 7, depending on the btn clicked.
  // console.log(this.id);
  let inputForm = document.getElementById("input-form-container");
  globalThis.day = day;
  // Open the medication input.
  formCollapse.show();

  // grey out each button, make them unclickable.
  // The only way to make them clickable again is to either press the "#cancelBtn" or "#submitBtn" btns.
  for (const btn of btns) {
    if (btn.id - 1 == day) {
      continue;
    }
    btn.classList.add('disabled');
  }
}

// function saveReminder( data ){
//   var reminders = JSON.parse( localStorage.reminders || "[]" )
//   reminders.push( data )
//   localStorage.reminders = JSON.stringify( reminders )
// }
// saveReminder( { time: "2021-02-06 14:40:00", med: "tylenol", "take without food" } )
// saveReminder( { time: "2021-02-06 18:40:00", med: "tylenol", "take without food" } )
// saveReminder( { time: "2021-02-06 21:40:00", med: "tylenol", "take without food" } )
// // every minute we check against any of the localStorage reminders
// function checkReminders(){
//   var reminders = JSON.parse( localStorage.reminders || "[]" )
//   var currentTime = Math.floor( Date.now()/1000 ) // unix timestamp of current time (since from 1970)
//   for( var i=0; i<reminders.length; i++ ){
//       var reminderTime = reminders[i].time
//       if( Number( moment(reminderTime).format("X") ) < currentTime ){
//           // remove the time from the localStorage.reminders
//           // display the message (in toastr)
//       }
//   }
// }
// setInterval( checkReminders, 60000 )


// // wire fuzzy match autosuggestion to the medication <input> element
// let inputMedication = document.getElementById('inputMedication');
// inputMedication.addEventListener('keypress', autoSuggest);

// function autoSuggest() {
//   console.log('autoSuggest() function executing!');

//   let keypresses = document.getElementById("inputMedication").value;

//   request = new XMLHttpRequest();
//   request.open('GET', `https://cors-anywhere.herokuapp.com/https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json`, true);
//   request.onload = () => {
//     if (request.readyState == 4 && request.status == 200) {
//       console.log("YAYAAYAYYAYAYA");
//       autosuggestionArray = JSON.parse(request.responseText);
//       numSuggestions = 0;
//       while (numSuggestions < 3) {
//         let ul = document.getElementById('medication-div');
//         ul.children[numSuggestions].innerHTML = autosuggestionArray.data[numSuggestions].drug_name;
//       }

//       listCollapse.show();
//     }
//   };
//   request.send();

//   inputMedication.removeEventListener('keypress', autoSuggest);
// };

// https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json