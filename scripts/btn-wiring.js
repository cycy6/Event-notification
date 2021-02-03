// Each button has an ID, "1" to "7", inclusive.
// Each of the 7 button's onclick will map to the same function.
// Passing in its own ID.

let formCollapse;
let currentBtn;

(function() {
  // Initialization function.
  // Make form a collapsable element.
  formCollapse = new bootstrap.Collapse(document.getElementById('main-form'), {
    toggle: false
  });

  // Wire the form's 3 buttons, #submitBtn, #resetBtn, and #cancelBtn
  document.getElementById('submitBtn').addEventListener("click", () => {
    // Make sure required information is filled out by the user.
    // Submit the form.

    // restore all disabled btns.
    for (const btn of document.getElementsByClassName("responsive-width")) {
      btn.classList.remove('disabled');
    }

    // hide form. Will remove this, just for debugging.
    // TODO: REMOVE THIS EVENTUALLY!
    formCollapse.hide();
    
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
  });

  // Prevent submit button from refreshing page.
  document.getElementById('main-form').addEventListener('submit', (e) => e.preventDefault());
})();

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

function btnClickHandler (event) {
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

