//INITIAL VARIABLES

//store page container
let page = document.querySelector(".page");
//store page header
let pageHeader = document.querySelector(".page-header");
//store student list as a node
let studentList = document.querySelector("ul");
//store all li's inside of student list
let studentsNodeList = document.querySelectorAll(".student-item");

//FUNCTIONS
//remove hidden class
function removeHidden(student){
  if (student.getAttribute("class") === "student-item cf hidden") {
    student.setAttribute("class", "student-item cf")
  }
}


//add hidden class
function addHidden(student){
  //make sure to not add duplicate hidden classes
  if (student.getAttribute("class") !== "student-item cf hidden"){
    student.className += " hidden";
  }
}


function removeNotFound(){
  if (page.querySelector(".not-found") != null) {
    let notFoundDiv = document.querySelector(".not-found");
    page.removeChild(notFoundDiv);
  }
}


function removePageLinks(){
  if (page.querySelector(".pagination") != null){
    let paginationDiv = document.querySelector('.pagination');
    page.removeChild(paginationDiv);
  }
}


function resetStudents(){
  removePageLinks();
  studentsNodeList.forEach((student) => {
    removeHidden(student);
  });
  appendPageLinks(studentsNodeList);
  //remove not found div
  removeNotFound();
}


function showPage(pageNumber, studentList){
  //first remove hidden class from every student using getters and setters for attribute
  studentList.forEach((student) => {
    removeHidden(student);
  });

  //apply hidden class based on page number and multiples of 10
  studentList.forEach((student, i) => {
    if ( i < ((pageNumber-1)*10) || i > ((pageNumber*10)-1)){
      addHidden(student);
    }
  });
}


function appendPageLinks(studentList){
  //create appropriate number of pages of students in groups of 10
  let numberOfPages = Math.ceil(studentList.length / 10);

  //dynamically add pagination links if more than one page of (or 10) students
  if (numberOfPages > 1){

    //create pagination container and add to DOM
    let paginationDiv = document.createElement('div');
    paginationDiv.setAttribute("class", "pagination");
    page.appendChild(paginationDiv);

    //add unordered list and attach it to div container
    let list = document.createElement('ul');
    paginationDiv.appendChild(list);

    //loop for correct amount of list items and attach to list
    for(let i = 0; i < numberOfPages; i++){
      let li = document.createElement('li');
      let a = document.createElement('a');
      let aText = document.createTextNode(i + 1);
      a.appendChild(aText);
      a.setAttribute("href", "#");
      li.appendChild(a);
      list.appendChild(li);

      // initially set button 1 to active
      if (i === 0) {
        a.setAttribute("class", "active");
        //initialize page to first page
        showPage(1, studentList);
      }
    }
  }

  //get all a links
  let pageButtons = document.querySelectorAll("a");
  //get area to click buttons
  let paginationDiv = document.querySelector(".pagination");

  //set class to active upon button click and remove from others
  paginationDiv.addEventListener("click", (e) => {
    //if not found div is on top remove
    removeNotFound();

    pageButtons.forEach((button, i) => {
      //checks for previously active class to remove
      if(button.hasAttribute("class")){
        button.removeAttribute("class");
      }
      //sets new button that is active
      e.target.setAttribute("class", "active");

      //shows new page if class is active
      if (button.hasAttribute("class")){
        showPage(i+1, studentList);
      }
    });
  })
}


//SEARCH LIST functionality
function appendSearchFunctions(){
  //include search component dynamically

  //create Div and attach
  let searchDiv = document.createElement('div')
  searchDiv.setAttribute('class', 'student-search');
  pageHeader.appendChild(searchDiv);

  //create input
  let input = document.createElement('input');
  input.setAttribute('placeholder', 'Search for students...');

  //create button
  let button = document.createElement('button');
  let buttonText = document.createTextNode('Search');

  //append all
  button.appendChild(buttonText);
  searchDiv.appendChild(input);
  searchDiv.appendChild(button);

  //create event handler for button submit that calls searchList
  button.addEventListener("click", () => {
    searchList();
  });

  //dynamically add button to return to initial rendering
  let resetButton = document.createElement('button');
  let resetButtonText = document.createTextNode('Reset Students');
  resetButton.appendChild(resetButtonText);
  searchDiv.appendChild(resetButton);

  //add event listener to reset students button
  resetButton.addEventListener('click', () => {
    resetStudents();
  });
}


function searchList(){
  // Obtain the value of the search input
  let inputValue = document.querySelector('input').value;
  //store div for not found

  // remove the page link if it exists
  removePageLinks();

  //remove not found if it exists
  removeNotFound();

  //array to store search matches
  let matched = [];
  // Loop over all students
  studentsNodeList.forEach((student) => {
    // grab name and email
    let name = student.children[0].children[1].innerHTML;
    let email = student.children[0].children[2].innerHTML;

    //check if part of input value matches name or email using indexOf
    if (name.indexOf(inputValue) > -1 || email.indexOf(inputValue) > -1) {
      //add to matched array
      matched.push(student);
    } else {
      //add hidden class to student
      addHidden(student);
    }
  });

  if (matched.length === 0){
    //display not found div if no matches found
    let notFoundDiv = document.createElement('div');
    let notFoundText = document.createTextNode('Sorry, no match found!');
    notFoundDiv.setAttribute('class', 'not-found');
    notFoundDiv.appendChild(notFoundText);
    //insert not found before student list
    page.insertBefore(notFoundDiv, studentList);
  }

  //call appendPageLinks with the matched students if enough students
  if (matched.length > 10){
    appendPageLinks(matched);
  }

   // Call showPage to show first ten students of matched list
   showPage(1, matched);

   //reset form field to blank
   inputValue = document.querySelector('input').value = "";
}


//END OF FUNCTIONS
//RUN PROGRAM
//ENTRY POINT

//call function to show first page and button links
appendPageLinks(studentsNodeList);

//call search input to show up
appendSearchFunctions();
