

window.addEventListener("load", () => {

});

window.addEventListener("click", e => {
    // if any project is selected
    /*
    if(e.target.className !== "edit-project-button"){
        element = document.querySelector(".edit-project-functions");
        if(!element.classList.contains("hide")) element.classList.toggle("hide");
    }
    */

    // add active class to selected element
    // if element has class active && clicked outside => toggle hide
    // make as a universal function
    
});






//confetti(); 

const LOCAL_STORAGE_TASKS_KEY = "LOCAL_STORAGE_TASKS_KEY";
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY";


const projectsList = document.querySelector(".projects-list");



const headerTitle = document.querySelector(".header-title");
const headerIcon = document.querySelector(".header-icon");


const editProjectTemplate = document.getElementById("edit-project-template").content;
const editProjectDropdown = document.querySelector(".edit-project-dropdown");
const editProjectButton = document.querySelector(".edit-project-button");
const editProjectFunctions = document.querySelector(".edit-project-functions");

const deleteProjectButton = document.querySelector(".delete-project-button");
const editProjectTitleButton = document.querySelector(".edit-project-title-button");

const taskTemplate = document.getElementById("task-template").content;


const taskPanel = document.querySelector(".task-panel");
const tasksContainer = document.querySelector(".tasks-container");

let iconSource;
let blankIcon;



// -- Creating New Projects --


const newProjectInput = document.querySelector(".new-project-title");
const newProjectForm = document.querySelector(".new-project-container form");
const newProjectButton = document.querySelector(".new-project-button");
let projects = JSON.parse(localStorage.getItem("projects")) || [];     // change to more professional way
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY);

// new project customization
$(".icon-select").click(function(){
    iconSource = $(this).find("img").attr("src");
    iconSource.toString();
    document.querySelector(".icon-select-container").style.visibility = "hidden";          // improve showing elements
});




newProjectForm.addEventListener("submit", e => {    
    e.preventDefault();
    const title = newProjectInput.value;
    if(title == null || title.trim() === "") return
    const project = createProject(title);
    newProjectInput.value = null;
    projects.push(project);
    newProjectInput.blur(); 
    saveAndRender(); 
});


function createProject(title){
    return {
        title: title,
        icon: iconSource,
        id: Date.now().toString(),
        tasks: []
    }
}
function saveAndRender(){
    save();
    render();
}

function save(){
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId);
}

function render(){          
    clearElement(projectsList);
    renderProjects();
    const selectedProject = projects.find(project => project.id === selectedProjectId); 
    if(projects.length === 0){
        messageCreateProject();
    } 

    if(selectedProject == null){
        return;
    } else{
        clearElement(tasksContainer);
        renderHeader(selectedProject);
        renderTasks(selectedProject); 
        messageTasksCompleted();
    }
        
    



    
    /*
    if(selectedProjectId == null || selectedProjectId == undefined){
        newTaskPanel.style.display = "none"; 
        document.querySelector(".header-container").style.display = "none";
    } 
    */
   
 
}



function renderProjects(){
    projects.forEach(project => {
        const projectElement = document.createElement("li");
        const icon = document.createElement("img");
        const title = document.createElement("p");
        const infoContainer = document.createElement("div");
        title.textContent = project.title;
        title.style.margin = "0px";
        title.classList.add("test");
        infoContainer.appendChild(icon);
        infoContainer.appendChild(title);
        infoContainer.classList.add("project-info-container");
        edit = document.importNode(editProjectTemplate, true);
        icon.src = project.icon;
        projectElement.dataset.listId = project.id;
        projectElement.classList.add("project");
        icon.style.textIndent = "100vw";
        projectElement.appendChild(infoContainer);
        projectsList.appendChild(projectElement);
        if(project.id === selectedProjectId){
            projectElement.classList.add("active-project"); 
            projectElement.appendChild(edit);
        }
    });
}



projectsList.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li"){
        selectedProjectId = e.target.dataset.listId;
        saveAndRender();
    }
    if(e.target.tagName.toLowerCase() === "button"){
        const button = e.target;
        const li = projectsList.querySelector(".project-info-container");
        const ul = projectsList;

        if(button.className === "edit-project-button"){
            button.parentNode.getElementsByClassName("edit-project-functions")[0].classList.toggle("hide"); 
        }

        if(button.textContent === "Delete"){
            projects = projects.filter(project => project.id !== selectedProjectId);
            selectedProjectId = null;
            saveAndRender();
            location.reload();
        } else if(button.textContent === "Edit"){
            const title = document.querySelector(".test");
            const input = document.createElement("input");
            input.type = "text";
            input.value = title.textContent;
            input.classList.add("edit-project-input");
            li.style.pointerEvents = "auto";
            li.insertBefore(input, title);
            li.removeChild(title);
        }  
    }

    

    
});





/*
function deleteProject(e){
    projects = projects.filter(project => project.id !== selectedProjectId);
    selectedProjectId = null;
    saveAndRender();
    location.reload(); // improve
}
*/













function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    } 
}





newProjectButton.addEventListener("click", function(){
    const iconSelectContainer = document.querySelector(".icon-select-container");
    if(iconSelectContainer.style.visibility === "visible"){
        iconSelectContainer.style.visibility = "hidden";
    } else{
        iconSelectContainer.style.visibility = "visible";
    }
});







// -- Creating New Tasks --

// task panel input animation
const addTaskButton = document.querySelector(".add-task-button");
const newTaskPanel = document.querySelector(".new-task-panel");
const newTaskPanelInput = document.querySelector(".new-task-panel-input input");
const newTaskPanelForm = document.querySelector(".new-task-panel-input");

newTaskPanelInput.addEventListener("click", function() {
    newTaskPanel.style.opacity = "1";
    newTaskPanel.style.display = "flex";                 
    addTaskButton.style.display = "block";
    dueDateInput.style.display = "none";
    dueDateIcon.style.display = "block";
    dueDateDetails.style.display = "flex";
});

newTaskPanelForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = newTaskPanelInput.value;
    const dueDate = dueDateInput.value;
    if (title == null || title.trim() === "") return
    const task = createTask(title, dueDate);
    newTaskPanelInput.value = null;
    dueDateInput.value = null;
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks.push(task);
    saveAndRender();
    taskFormAnimationBackwards();
});

/*window.addEventListener('click',function(e){
    if(e.target != document.querySelector(".main-section")){
        taskFormAnimationBackwards();
    }
});
*/  


function taskFormAnimationBackwards(){
    newTaskPanel.style.opacity = "0.5";
    newTaskPanelInput.blur();
    addTaskButton.style.display = "none";
    dueDateIcon.style.display = "block";
    dueDateDetails.style.display = "none";
    dueDateInput.style.display = "none";
}

function createTask(title, dueDate){
    return {
        title: title, 
        complete: false,
        dueDate: dueDate,
        id: Date.now().toString()
    }     
}


// task due date input
const dueDateInput = document.querySelector(".task-due-date-details input");
const dueDateDetails = document.querySelector(".task-due-date-details");
const dueDateIcon = document.querySelector(".task-due-date-details i");

dueDateIcon.addEventListener("click", function () {
    if(dueDateInput.style.display === "none"){
        dueDateInput.style.display = "block";
        dueDateDetails.style.backgroundColor = "#1a1c1e8c";
    } else{
        dueDateInput.style.display = "none";
        dueDateDetails.style.backgroundColor = "#272A308c";
    }
});





// confirming-adding tasks
addTaskButton.addEventListener("click", function () {

    const title = newTaskPanelInput.value;
    const dueDate = dueDateInput.value;
    if (title == null || title.trim() === "") return
    const task = createTask(title, dueDate);
    newTaskPanelInput.value = null;
    dueDateInput.value = null;
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks.push(task);
    saveAndRender();
    taskFormAnimationBackwards();
});





function renderTasks(selectedProject){                   
    selectedProject.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate, true);
        const checkbox = taskElement.querySelector(".checkmark");
        checkbox.id = task.id;
        checkbox.checked = task.complete;  
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.title);
        const dueDate = taskElement.querySelector(".task-due-date-text");         
        if (task.dueDate == null || task.dueDate.trim() === "") taskElement.querySelector(".task-due-date").style.visibility = "hidden";
        dueDate.append(task.dueDate);
        tasksContainer.appendChild(taskElement);
    });
}


tasksContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "input"){
        const selectedProject = projects.find(project => project.id === selectedProjectId);
        const selectedTask = selectedProject.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        //selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete);
        saveAndRender();   //  was saveAndRender();
        //setTimeout(saveAndRender, 1500);     // add fade out animation
    }
});


function renderHeader(selectedProject){
    document.querySelector(".header-container").style.display = "flex";
    newTaskPanel.style.display = "flex";  
    tasksContainer.style.display = "";
    headerTitle.textContent = selectedProject.title;
    headerIcon.src = selectedProject.icon;
}


function messageCreateProject(){
    document.querySelector(".header").visibility = "hidden";
    newTaskPanel.style.display = "none";   
    const messageContainer = document.createElement("div");
    const text = document.createTextNode("Create your first project");
    const image = new Image();
    image.src = "images/create project.png";
    image.classList.add("message-image");
    messageContainer.classList.add("message-container");
    messageContainer.appendChild(image);
    messageContainer.appendChild(text);
    tasksContainer.appendChild(messageContainer);
}
function messageTasksCompleted(){
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    const incompleteTasks = selectedProject.tasks.filter(task => !task.complete).length;
    const completeTasks = selectedProject.tasks.filter(task => task.complete).length;
    if(incompleteTasks === 0 && completeTasks >= 1){
        const messageContainer = document.createElement("div");
        const text = document.createTextNode("You've completed all tasks");
        const image = new Image();
        image.src = "images/confetti.png";
        image.classList.add("message-image");
        messageContainer.classList.add("message-container");
        messageContainer.appendChild(image);
        messageContainer.appendChild(text);
        tasksContainer.appendChild(messageContainer);
    }
}




$(".checkmark").click(function() {
   alert($(this).attr("class"));
});





render();









/* old version */


/*

const newProjectButton = document.querySelector(".new-project-button");
newProjectButton.addEventListener('click', function () {
    document.querySelector(".icon-select-container").style.visibility = "visible";
});

function createProject(){
    const img = document.createElement("img")
    img.src = iconSource;
    const li = document.createElement("li");
    li.classList.add("project");
    var inputValue = document.querySelector(".new-project-title").value;
    const title = document.createTextNode(inputValue);
    

    if (inputValue === "") {
        return;
    } else {
        document.querySelector(".projects-list").appendChild(li);  
    }

    li.appendChild(img);
    li.appendChild(title);              

    document.querySelector(".new-project-title").value = "";
    document.querySelector(".icon-select-container").style.visibility = "hidden";
    document.querySelector(".new-project-title").style.visibility = "hidden";
}




// new project customization
$(".icon-select").click(function(){
    iconSource = $(this).find("img").attr("src");
    iconSource.toString();
    document.querySelector(".new-project-title").style.visibility = "visible";
    document.querySelector(".icon-select-container").style.visibility = "hidden";          // improve showing elements
    document.querySelector(".new-project-title").focus();
});


// selected project
const projectsList = document.querySelector(".projects-list");

projectsList.addEventListener("click", function(e){
    for(var i = 0; i < projectsList.children.length; i++){
        var project = projectsList.children[i];
        if(project === e.target){
            project.classList.add("active-project");
        } else{
            project.classList.remove("active-project");
        }
    }
});

*/
/*

*/ 










/* new version */

/*
const projectsList = document.querySelector(".projects-list");
const newProjectForm = document.querySelector(".new-project-button");
const newProjectInput = document.querySelector(".new-project-title");

const LOCAL_STORAGE_PROJECT_KEY = "task.projects";
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

newProjectForm.addEventListener("click", e => {
    e.preventDefault();
    const projectName = newProjectInput.value;
    if (projectName == null || projectName === "") return
    const project = createProject(projectName);
    newProjectInput.value = null;
    projects.push(project);
    saveAndRender();
});

function createProject(name){
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
}

function saveAndRender(){
    save();
    render();
}

function render(){
    clearElement(projectsList);
    projects.forEach(project => {
        const projectElement = document.createElement("li");
        projectElement.dataset.listId = project.id;
        projectElement.classList.add("project");
        projectElement.innerText = project.name;
        projectsList.appendChild(projectElement);
    });
}




function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

render();

*/


















    







