
window.addEventListener("load", () => {

});

window.addEventListener("click", e => {
    
    if(e.target.className !== "edit-project-button"){
        element = document.querySelector(".edit-project-functions");
        if(!element.classList.contains("hide")) element.classList.toggle("hide");
    } 
    if(e.target !== newTaskPanelInput && e.target !== dueDateIcon && e.target !== dueDateInput){ 
        newTaskPanelInput.classList.toggle("selected");
        taskFormAnimationBackwards();
    }
});







const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY";
const LOCAL_STORAGE_ONE_COMPLETE_TASK_KEY = "LOCAL_STORAGE_ONE_COMPLETE_TASK_KEY";
const LOCAL_STORAGE_SELECTED_GROUP_ID_KEY = "LOCAL_STORAGE_SELECTED_GROUP_ID_KEY";


const projectsList = document.querySelector(".projects-list");


const header = document.querySelector(".header");
const headerTitle = document.querySelector(".header-title");
const headerIcon = document.querySelector(".header-icon");


const editProjectTemplate = document.getElementById("edit-project-template").content;
const editProjectDropdown = document.querySelector(".edit-project-dropdown");
const editProjectButton = document.querySelector(".edit-project-button");
const editProjectFunctions = document.querySelector(".edit-project-functions");

const deleteProjectButton = document.querySelector(".delete-project-button");
const editProjectTitleButton = document.querySelector(".edit-project-title-button");

const deleteCompleteTasksButton = document.querySelector(".delete-complete-tasks-button");

const taskTemplate = document.getElementById("task-template").content;

const taskPanel = document.querySelector(".task-panel");
const tasksContainer = document.querySelector(".tasks-container");


let iconSource;
let blankIcon;

let editingTaskTitle = false;

const groupTasksTemplate = document.getElementById("group-tasks-template").content;
const newGroupButton = document.querySelector(".new-group-button");


const noteTemplate = document.getElementById("note-template").content;
const newNoteButton = document.querySelector(".new-note-button");



// -- Creating New Projects --


const newProjectInput = document.querySelector(".new-project-title");
const newProjectForm = document.querySelector(".new-project-container form");
const newProjectButton = document.querySelector(".new-project-button");
let projects = JSON.parse(localStorage.getItem("projects")) || [];    
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY);
let selectedGroupId = localStorage.getItem(LOCAL_STORAGE_SELECTED_GROUP_ID_KEY);


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
        tasks: [],
        groups: [],
        notes: [],
        oneCompleteTask: false
    }
}
function saveAndRender(){
    save();
    render();
}

function save(){
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_GROUP_ID_KEY, selectedGroupId);
}

function render(){          
    clearElement(projectsList);
    renderProjects();
    const selectedProject = projects.find(project => project.id === selectedProjectId); 
    if(projects.length === 0){
        messageCreateProject();
    }
    if(selectedProject == null){
        header.style.display = "none";
    } else{
        clearElement(tasksContainer);
        renderHeader(selectedProject);
        header.style.display = "flex";
        renderTasks(selectedProject); 
        renderGroups(selectedProject);
        renderNotes(selectedProject);
        messageTasksCompleted();
    }
}









function renderProjects(){
    projects.forEach(project => {                                       
        const projectElement = document.createElement("li");
        if(project.icon !== undefined){
            const icon = document.createElement("img");
            icon.src = project.icon;
            icon.style.textIndent = "100vw";
            projectElement.appendChild(icon);   
        } 
        const title = document.createElement("p");
        title.textContent = project.title;
        title.classList.add("project-title");
        const tasksCount = document.createElement("p");
        const incompleteTaskCount = project.tasks.filter(task => !task.complete).length;
        tasksCount.textContent = incompleteTaskCount;
        tasksCount.classList.add("project-tasks-count");
        edit = document.importNode(editProjectTemplate, true);
        projectElement.dataset.listId = project.id;
        projectElement.classList.add("project");
        projectElement.appendChild(title);
        projectElement.appendChild(tasksCount);
        projectsList.appendChild(projectElement);
        if(project.id === selectedProjectId){
            projectElement.classList.add("active-project"); 
            projectElement.appendChild(edit);
            tasksCount.style.opacity = "0";
        } 
    });
}





projectsList.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "li"){
        selectedProjectId = e.target.dataset.listId;
        saveAndRender();
    }
    if(e.target.tagName.toLowerCase() === "button"){
        const selectedProject = projects.find(project => project.id === selectedProjectId); 
        const button = e.target;
        const li = document.querySelector(".active-project");
        const ul = projectsList;

        if(button.className === "edit-project-button"){
            button.parentNode.getElementsByClassName("edit-project-functions")[0].classList.toggle("hide"); 
        }

        if(button.textContent.includes("Delete")){
            projects = projects.filter(project => project.id !== selectedProjectId);
            selectedProjectId = null;
            saveAndRender();
            location.reload();
        } else if(button.textContent.includes("Edit")){
            const title = li.querySelector(".project-title");
            const input = document.createElement("input");
            const form = document.createElement("form");
            form.appendChild(input);
            input.type = "text";
            input.value = title.textContent;
            input.maxLength = "20";
            input.classList.add("edit-project-input");
            li.insertBefore(form, title);
            li.removeChild(title);
            input.focus();
            if(input.value == null || input.value.trim() === "") return
            form.addEventListener("submit", e => {
                e.preventDefault();
                selectedProject.title = input.value;
                saveAndRender();
            });
        }  
    } 
});



function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    } 
}





newProjectButton.addEventListener("click", function(){
    const iconSelectContainer = document.querySelector(".icon-select-container");
    iconSelectContainer.classList.toggle("hide");
});

deleteCompleteTasksButton.addEventListener("click", e => {
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete);
    saveAndRender();
})

// hello and welcome







// -- Creating New Tasks --

// task panel input animation
const addTaskButton = document.querySelector(".add-task-button");
const newTaskPanel = document.querySelector(".new-task-panel");
const newTaskPanelInput = document.querySelector(".new-task-panel-input input");
const newTaskPanelForm = document.querySelector(".new-task-panel-input");

newTaskPanelInput.addEventListener("click", function() {
    newTaskPanelInput.classList.add("selected");
    if(newTaskPanelInput.classList.contains("selected")){
        newTaskPanel.style.opacity = "1";
        newTaskPanel.style.display = "flex";                 
        addTaskButton.style.display = "block";
        dueDateInput.style.display = "none";
        dueDateIcon.style.display = "block";
        dueDateDetails.style.display = "flex";
        
    }
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
        const title = taskElement.querySelector(".task-title");
        checkbox.id = task.id;
        checkbox.checked = task.complete;  
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        title.append(task.title);
        const dueDate = taskElement.querySelector(".task-due-date-text");         
        if (task.dueDate == null || task.dueDate.trim() === "") taskElement.querySelector(".task-due-date").style.visibility = "hidden";
        dueDate.append(task.dueDate);
        tasksContainer.appendChild(taskElement);
    });
}

function newGroup(){
    const group = createGroup();
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.groups.push(group);
    saveAndRender();
}
function createGroup(){
    return {
        title: "title",
        id: Date.now().toString(),
        enabled: false,
        tasks: []
    }
}

function createGroupTask(){
    return {
        title: "default text", 
        complete: false,
        id: Date.now().toString()
    }
}


function renderGroups(selectedProject){
    selectedProject.groups.forEach(group => {
        const groupElement = document.importNode(groupTasksTemplate, true);
        const title = groupElement.querySelector(".group-title");
        const arrow = groupElement.querySelector(".group-tasks-dropdown-arrow");
        const container = groupElement.querySelector(".group-tasks-container");
        const plus = groupElement.querySelector(".group-tasks-dropdown-plus");
        arrow.id = group.id;
        title.append(group.title);
        groupElement.appendChild(container);
        tasksContainer.appendChild(groupElement);

        if(group.enabled){
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
            container.style.display = "block";
            arrow.classList.toggle("arrow-down");
            plus.classList.toggle("hide");
            // render only one selectedGroup tasks whenever multiple groups are selected
            renderGroupsTasks(selectedGroup, container);
        } else{
            container.style.display = "none";
        }

        


        arrow.addEventListener("click", e => {
            selectedGroupId = e.target.id;
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
            arrow.classList.toggle("arrow-down");
            //container.classList.toggle("hide");
            plus.classList.toggle("hide");

            if(container.style.display === "block"){
                container.style.display = "none";
                group.enabled = false;
            } else{
                container.style.display = "block";
                group.enabled = true;
            }
            renderGroupsTasks(selectedGroup, container);
            save();
        });
        plus.addEventListener("click", e => {
            const task = createGroupTask();
            // create a task only here inside of selectedGroup
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
            console.log(selectedGroup);
            selectedGroup.tasks.push(task);
            saveAndRender();
        }); 
    });
}


function renderGroupsTasks(selectedGroup, container){
    clearElement(container);
    selectedGroup.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate, true);
        const checkbox = taskElement.querySelector(".checkmark");
        checkbox.classList.add("checkbox-group-task");
        const title = taskElement.querySelector(".task-title");
        title.classList.add("group-title");
        checkbox.id = task.id;
        checkbox.checked = task.complete;  
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        title.append(task.title);
        const dueDate = taskElement.querySelector(".task-due-date-text");  
        if (task.dueDate == null || task.dueDate.trim() === "") taskElement.querySelector(".task-due-date").style.visibility = "hidden";       
        dueDate.append(task.dueDate);
        container.appendChild(taskElement);
    });
}



//  BIG ANNOTATION
//      when multiple groups are selected => adds task to all selected groups
//  make sure to have stored in LocalStorage only one selectedGroup







tasksContainer.addEventListener("click", e => {
    if(e.target.tagName.toLowerCase() === "input"){
        if(e.target.classList.contains("checkbox-group-task")){
            const selectedProject = projects.find(project => project.id === selectedProjectId);
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
            const selectedGroupTask = selectedGroup.tasks.find(task => task.id === e.target.id);
            selectedGroupTask.complete = e.target.checked;
        } else{
            const selectedProject = projects.find(project => project.id === selectedProjectId);
            const selectedTask = selectedProject.tasks.find(task => task.id === e.target.id);
            selectedTask.complete = e.target.checked;
            if(selectedTask.complete) selectedProject.oneCompleteTask = true;
        }
        saveAndRender(); 
        //selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete);
        //setTimeout(saveAndRender, 1500);     // add fade out animation
    } else if(e.target.classList.contains("task-title")){
        const selectedProject = projects.find(project => project.id === selectedProjectId);
        const selectedTask = selectedProject.tasks.find(task => task.title === e.target.textContent);
        var groupBool = false;
        const li = e.target.parentNode;
        const title = e.target;
        const input = document.createElement("input");
        const form = document.createElement("form");
        if(li.className === "group-tasks-dropdown") groupBool = true;
        input.classList.add("edit-task-title-input");
        form.appendChild(input);
        input.type = "text";
        input.value = title.textContent;
        input.maxLength = "60";
        li.insertBefore(form, title);
        li.removeChild(title);
        input.focus(); 
        if(input.value == null && input.value.trim() === "") return
        form.addEventListener("submit", e => {
            e.preventDefault();
            if(groupBool){
                selectedGroupId = li.querySelector(".group-tasks-dropdown-arrow").id;
                const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
                // if title is empty => toggle to placeolder "title"
                selectedGroup.title = input.value;
            } else{
                selectedTask.title = input.value;
            }
            saveAndRender();
        });
    } 

});








function renderHeader(selectedProject){
    document.querySelector(".header-container").style.display = "flex";
    newTaskPanel.style.display = "flex";  
    tasksContainer.style.display = "";
    headerTitle.textContent = selectedProject.title;
    if(selectedProject.icon === undefined){
        headerIcon.style.display = "none";
    } else{
        headerIcon.style.display = "block";
    }
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
    if(incompleteTasks === 0 && selectedProject.oneCompleteTask && completeTasks === 0){
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

function createNote(){
    return {
        title: "default title",
        id: Date.now().toString()
    }
}


newNoteButton.addEventListener("click", e => {
    const selectedProject = projects.find(project => project.id === selectedProjectId); 
    const note = createNote();
    selectedProject.notes.push(note);
    saveAndRender();
});

function renderNotes(selectedProject){
    selectedProject.notes.forEach(note => {
        const noteElement = document.importNode(noteTemplate, true);
        const arrow = noteElement.querySelector(".group-tasks-dropdown-arrow");
        const dropdown = noteElement.querySelector(".note-dropdown");
        tasksContainer.appendChild(noteElement);

        arrow.addEventListener("click", e => {
            arrow.classList.toggle("arrow-down");
            dropdown.classList.toggle("hide");
        });
    });



}





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


















    







