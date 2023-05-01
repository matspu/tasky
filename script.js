
window.addEventListener("load", () => {

});


window.addEventListener("click", e => {
    
    if(e.target !== newTaskPanelInput && e.target !== dueDateIcon && e.target !== dueDateInput){ 
        newTaskPanelInput.classList.toggle("selected");
        taskFormAnimationBackwards();
    }
    if(e.target.className !== "new-element-button"){
        const element = document.querySelector(".new-element-container");
        if(!element.classList.contains("dropdown-exit")) element.classList.replace("dropdown-active", "dropdown-exit");
    }

    if(e.target.className !== "edit-project-button"){
        const element = document.querySelector(".edit-project-functions");
        if(!element.classList.contains("dropdown-exit")) element.classList.replace("dropdown-active", "dropdown-exit");
    }
    
    if (e.target.className !== "new-project-button") {
        const element = document.querySelector(".icon-select-container");
        if(!element.classList.contains("dropdown-exit")) element.classList.replace("dropdown-active", "dropdown-exit");
    }




    
    /*
    if(e.target.className !== "icon-select-container"){
        const element = document.querySelector(".icon-select-container");
        if(!element.classList.contains("hide")) element.classList.toggle()
    }*/
});


window.onclick = e => {
    console.log(e.target);  // to get the element
    console.log(e.target.tagName);  // to get the element tag name alone
} 








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

const iconSelectContainer = document.querySelector(".icon-select-container");

let iconSource;
let blankIcon;

let editingTaskTitle = false;

const groupTemplate = document.getElementById("group-template").content;
const newGroupButton = document.querySelector(".new-group-button");

const groupTaskTemplate = document.getElementById("group-task-template").content;



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
    newProjectButton.style.backgroundColor = "transparent";
    document.querySelector(".new-project-button i").style.color = "transparent";
    newProjectInput.focus();
    newProjectButton.querySelector("img").src = iconSource;
    document.querySelector(".new-project-button img").style.display = "block";
    iconSelectContainer.classList.toggle("dropdown-active");
    iconSelectContainer.classList.toggle("dropdown-exit");
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
    newProjectButton.style.backgroundColor = "transparent";
    document.querySelector(".new-project-button img").src = "";
    document.querySelector(".new-project-button i").style.color = "rgba(255, 255, 255, 0.418)";
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
        var incompleteTaskCount = project.tasks.filter(task => !task.complete).length;
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
            button.parentNode.getElementsByClassName("edit-project-functions")[0].classList.toggle("dropdown-active"); 
            button.parentNode.getElementsByClassName("edit-project-functions")[0].classList.toggle("dropdown-exit"); 
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
            input.maxLength = "13";
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
    iconSelectContainer.classList.toggle("dropdown-active");
    iconSelectContainer.classList.toggle("dropdown-exit");
});

const newProjectLabel = document.querySelector(".new-project-label");
const newProjectButtonIcon = document.querySelector(".new-project-button i");
newProjectLabel.addEventListener("click", e => {
    newProjectButton.style.backgroundColor = "rgba(128, 128, 128, 0.322)";
    newProjectButton.style.fontSize = "16px";
    newProjectButton.style.pointerEvents = "auto";
});


deleteCompleteTasksButton.addEventListener("click", e => {
    const selectedProject = projects.find(project => project.id === selectedProjectId);
    selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete);
    if(selectedProject.groups.length >= 1){
        const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
        selectedGroup.tasks = selectedGroup.tasks.filter(task => !task.complete);
    }
    saveAndRender();
})

const newElementButton = document.querySelector(".new-element-button");
const newElementDropdownContainer = document.querySelector(".new-element-container");
newElementButton.addEventListener("click", e => {
    newElementDropdownContainer.classList.toggle("dropdown-active");
    newElementDropdownContainer.classList.toggle("dropdown-exit");
    
})






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


const dueDateInput = document.querySelector(".task-due-date-details input");
const dueDateDetails = document.querySelector(".task-due-date-details");
dueDateDetails.addEventListener("submit", e => {
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
        title: "",
        id: Date.now().toString(),
        enabled: false,
        tasks: []
    }
}

function createGroupTask(){
    return {
        title: "", 
        dueDate: "",
        complete: false,
        id: Date.now().toString()
    }
}



function renderGroups(selectedProject){
    if(selectedProject.groups.length >= 1){
        selectedProject.groups.forEach(group => {
            const groupElement = document.importNode(groupTemplate, true);
            const title = groupElement.querySelector(".group-title");
            const arrow = groupElement.querySelector(".group-tasks-dropdown-arrow");
            const container = groupElement.querySelector(".group-tasks-container");
            const deleteButton = groupElement.querySelector(".delete-group-button");
            const plus = groupElement.querySelector(".group-tasks-dropdown-plus");
            arrow.id = group.id;
            deleteButton.id = group.id;
            plus.id = group.id;
            title.append(group.title);
            groupElement.appendChild(container);
            tasksContainer.appendChild(groupElement);
            container.style.maxHeight = "200px";
    
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
    
    
            if(group.title === ""){
                title.textContent = "enter title";
                title.style.color = "rgba(255, 255, 255, 0.418)";  
            } else{
                title.classList.toggle("empty");
            }
    
            if(group.enabled){
                container.style.display = "block";
                deleteButton.style.display = "none";
                plus.classList.toggle("hide");
                arrow.classList.toggle("arrow-down");
                renderGroupsTasks(selectedGroup, container);
                // render only one selectedGroup tasks whenever multiple groups are selected
            } else{
                container.style.display = "none";
            }
    
    
    
            arrow.addEventListener("click", e => {
                selectedGroupId = e.target.id;
                const selectedProject = projects.find(project => project.id === selectedProjectId);
                const deselectGroup = selectedProject.groups.filter(group => group.id !== selectedGroupId);
                deselectGroup.forEach(group => {group.enabled = false;});
                plus.classList.toggle("hide");

                arrow.classList.toggle("arrow-down");

    
                if(container.style.display === "block"){
                    container.style.display = "none";
                    group.enabled = false;
                } else{
                    container.style.display = "block";
                    group.enabled = true;
                }
                
                save();
                renderGroupsTasks(selectedGroup, container);
                
            });


            deleteButton.addEventListener("click", e => {
                selectedProject.groups = selectedProject.groups.filter(group => group.id !== selectedGroupId);
                selectedGroupId = null;
                saveAndRender();  
            });

            plus.addEventListener("click", e => {
                selectedGroupId = e.target.id;
                const task = createGroupTask()
                const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
                selectedGroup.tasks.push(task);
                saveAndRender();
            }); 
        });
    }
}




function renderGroupsTasks(selectedGroup, container){
    clearElement(container);
    selectedGroup.tasks.forEach(task => {
        const taskElement = document.importNode(groupTaskTemplate, true);
        const checkbox = taskElement.querySelector(".checkmark");
        checkbox.classList.add("checkbox-group-task");
        const title = taskElement.querySelector(".task-title");
        title.classList.add("group-task-title");
        title.id = task.id;
        checkbox.id = task.id;
        checkbox.checked = task.complete;  
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        title.append(task.title);
        const dueDateDetailsForm = taskElement.querySelector(".task-due-date-details");
        const dueDateInput = taskElement.querySelector(".task-due-date-details input")
        const dueDate = taskElement.querySelector(".task-due-date-text");  
        if (task.dueDate == null || task.dueDate.trim() === "") taskElement.querySelector(".task-due-date").style.visibility = "hidden";       
        dueDate.append(task.dueDate);
        container.appendChild(taskElement);

        if(task.title === ""){
            title.textContent = "enter title";
            title.style.color = "rgba(255, 255, 255, 0.418)";  
        } else{
            title.classList.toggle("empty");
        }

        dueDateDetailsForm.addEventListener("submit", e => {
            e.preventDefault();
            const dueDate = dueDateInput.value;
            if (dueDate == null || dueDate.trim() === "") return
            task.dueDate = dueDate; 
            saveAndRender();
        });

        if(task.dueDate !== ""){
            dueDateDetailsForm.style.display = "none";
        }
    });
}










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

        // editing titles (task titles, group titles, group task titles, note titles)
        // I'M HERE // every title has "editable-title" class, determine whether it's group title => change styling
        // when submitting get the type of title(task/group), get selectedTask/Group/Note, assing the title then saveAndRender()
        // make sure to not submit empty title / if group-title
    } else if(e.target.classList.contains("editable-title")){
        if(e.target.classList.contains("empty")){
            e.target.textContent = "";
            e.target.style.color = "rgba(255, 255, 255, 0.418);";
        }
        const selectedProject = projects.find(project => project.id === selectedProjectId);
        const selectedTask = selectedProject.tasks.find(task => task.title === e.target.textContent);
        const li = e.target.parentNode;
        const title = e.target;
        const input = document.createElement("input");
        const form = document.createElement("form");
        form.appendChild(input);
        form.style.width = "90%";
        input.type = "text";
        input.value = title.textContent;
        input.maxLength = "70";
        li.insertBefore(form, title);
        //li.removeChild(title);
        title.style.display = "none";
        input.focus(); 

        // checking which title has been clicked
        if(e.target.classList.contains("group-title")){
            input.classList.add("edit-group-title-input");
            input.closest(".group-tasks").style.backgroundColor = "rgba(255, 255, 255, 0.020)";
            var group = true;
        } else if(e.target.classList.contains("note-title")){
            selectedNote = selectedProject.notes.find(note => note.id === e.target.id);
            input.classList.add("edit-group-title-input");
            var note = true;
        } else if(e.target.classList.contains("group-task-title")){
            const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
            var selectedGroupTask = selectedGroup.tasks.find(task => task.id === e.target.id);
            input.classList.add("edit-task-title-input");
            input.closest(".task-panel").style.backgroundColor = "rgba(255, 255, 255, 0.020)";
            var groupTask = true;
        } else{
            input.classList.add("edit-task-title-input");
            input.closest(".task-panel").style.backgroundColor = "rgba(255, 255, 255, 0.020)";
            var task = true;
        }

        // subitting edited title
        form.addEventListener("submit", e => {
            e.preventDefault();
            if(input.value != null && input.value.trim() === "") return
            if(group){
                selectedGroupId = li.querySelector(".group-tasks-dropdown-arrow").id;
                const selectedGroup = selectedProject.groups.find(group => group.id === selectedGroupId);
                // if title is empty => toggle to placeolder "title"
                selectedGroup.title = input.value;
            } else if(note){
                selectedNote.title = input.value;
            } else if(groupTask){
                selectedGroupTask.title = input.value;
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





$(".checkmark").click(function() {
   alert($(this).attr("class"));
});



function createNote(){
    return {
        title: "",
        text: "",
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
        const dropdown = noteElement.querySelector(".note-dropdown");
        const textarea = noteElement.querySelector(".note-dropdown textarea");
        const title = noteElement.querySelector(".note-title");
        const icon = noteElement.querySelector(".note-icon");
        const deleteButton = noteElement.querySelector(".delete-note-button");
        deleteButton.id = note.id;
        textarea.value = note.text;
        title.id = note.id; 
        title.append(note.title);
        tasksContainer.appendChild(noteElement);

        if(note.title === ""){
            title.textContent = "enter title";
            title.style.color = "rgba(255, 255, 255, 0.418)";  
        } else{
            title.classList.toggle("empty");
        }

        
        textarea.addEventListener("input", e => {
            note.text = textarea.value;
            save();
        });

        icon.addEventListener("click", e => {
            dropdown.classList.toggle("hide");
            textarea.focus();
        });

        deleteButton.addEventListener("click", e => {
            let selectedNoteId = e.target.id;
            selectedProject.notes = selectedProject.notes.filter(note => note.id !== selectedNoteId);
            selectedNoteId = null;
            saveAndRender();  
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


















    







