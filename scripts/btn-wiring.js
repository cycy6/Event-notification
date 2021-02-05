// Each button has an ID, "1" to "7", inclusive.
// Each of the 7 button's onclick will map to the same function.
// Passing in its own ID.

let formCollapse;
let listCollapse;
let currentBtn;
let inputForm;
let numTimeSlots = 1;
let request;
const myReg = /[a-z]+(?=<\/term>)/gim;
let returnData;
let autosuggestionArray;
let numSuggestions;
let formData;
let info;

(function () {
  // Initialization function.
  // Make form a collapsable element.
  formCollapse = new bootstrap.Collapse(document.getElementById('main-form'), {
    toggle: false
  });

  // Make the auto suggestion list a collapsable element.
  listCollapse = new bootstrap.Collapse(document.getElementById('medication-div'), {
    toggle: false
  });

  // Initialize <form> into a FormData object.
  inputForm = document.getElementById('main-form');
  formData = new FormData(inputForm);

  // Wire the form's 3 buttons, #submitBtn, #resetBtn, and #cancelBtn
  document.getElementById('submitBtn').addEventListener("click", () => {
    // Make sure required information is filled out by the user.
    // Submit the form.

    info = document.getElementsByClassName("form-control");
    // info.inputMedication, info.inputDescription, info.inputTime, info.inputTime1...info.inputTime4
    for (x of info) {
      //TODOOOOOOOO
    }
    // restore all disabled btns.
    for (const btn of document.getElementsByClassName("responsive-width")) {
      btn.classList.remove('disabled');
    }

    // hide form. Will remove this, just for debugging.
    // TODO: REMOVE THIS EVENTUALLY!
    formCollapse.hide();
    listCollapse.hide();
  })

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

})();

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
for (let i = 1; i <= 7; ++i) {
  let btns = document.querySelectorAll('button');

  btns[i - 1].setAttribute('id', i);
}

const database = {};

function initializeDatabase() {

  // No local storage, initialize with empty.
  if (localStorage.getItem("history")) {

  }

  else {
    database['Monday'] = {};
    database['Tuesday'] = {};
    database['Wednesday'] = {};
    database['Thursday'] = {};
    database['Friday'] = {};
    database['Saturday'] = {};
    database['Sunday'] = {};
  }
}

let btns = document.getElementsByClassName("responsive-width");  // HTMLCollection(7)

function btnClickHandler(event) {
  // DEBUGGING CODE
  console.log(this.id);
  // ...
  currentBtn = this.id;     // will return 1, 2, 3, 4, 5, 6, or 7, depending on the btn clicked.
  let inputForm = document.getElementById("input-form-container");

  // Open the medication input.
  formCollapse.show();

  // grey out each button, make them unclickable.
  // The only way to make them clickable again is to either press the "#cancelBtn" or "#submitBtn" btns.
  for (const btn of btns) {
    if (btn.id == this.id) {
      continue;
    }
    btn.classList.add('disabled');
  }
}

for (const btn of btns) {
  btn.addEventListener("click", btnClickHandler);
}

// wire fuzzy match autosuggestion to the medication <input> element
let inputMedication = document.getElementById('inputMedication');
inputMedication.addEventListener('keypress', autoSuggest);

function autoSuggest() {
  console.log('autoSuggest() function executing!');

  let keypresses = document.getElementById("inputMedication").value;

  request = new XMLHttpRequest();
  request.open('GET', `https://cors-anywhere.herokuapp.com/https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json`, true);
  request.onload = () => {
    if (request.readyState == 4 && request.status == 200) {
      console.log("YAYAAYAYYAYAYA");
      autosuggestionArray = JSON.parse(request.responseText);
      numSuggestions = 0;
      while (numSuggestions < 3) {
        let ul = document.getElementById('medication-div')
        ul.children[numSuggestions].innerHTML = autosuggestionArray.data[numSuggestions].drug_name;
      }

      listCollapse.show();
    }
  };
  request.send();

  inputMedication.removeEventListener('keypress', autoSuggest);
};

// https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json