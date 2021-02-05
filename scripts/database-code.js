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

