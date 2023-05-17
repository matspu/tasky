

// blob animation
const blob = document.getElementById("blob");

document.body.onpointermove = e => {
   blob.style.opacity = "0.6";

   const { clientX, clientY } = e;

   blob.animate({
      left: `${clientX}px`,
      top: `${clientY}px`
   }, { duration: 2000, fill: "forwards" });

}

    
// cards hover effect
document.getElementById("cards").onmousemove = e => {
   blob.style.opacity = "0";
   for (const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect(),
         x = e.clientX - rect.left,
         y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
   }
}

// hide blob on card hover
document.getElementById("cards").onmouseleave = e => {
   blob.style.opacity = "0.6";
}

const heroImage = document.querySelector(".hero-image-card");
const arrow = document.querySelector(".group-tasks-dropdown-arrow i");
const groupTasksContainer = document.querySelector(".group-tasks-container");

arrow.addEventListener("click", e => {
   if (groupTasksContainer.style.display === "block") {
      groupTasksContainer.style.display = "none";
      arrow.setAttribute("class", "bi bi-chevron-right");
   } else {
      groupTasksContainer.style.display = "block";
      arrow.setAttribute("class", "bi bi-chevron-down");
   }
});

heroImage.onmousemove = e => {
   blob.style.opacity = "0";
};





// card tilting effect
const pre = document.querySelector(".hero-image");

document.addEventListener("mousemove", e => {
  rotateElement(e, pre);
});

function rotateElement(event, element) {
  // get mouse position
  const x = event.clientX;
  const y = event.clientY;

  // find the middle
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  // get offset from middle as a percentage
  // and tone it down a little
  const offsetX = ((x - middleX) / middleX) * 15;
  const offsetY = ((y - middleY) / middleY) * 15;

  // set rotation
  element.style.setProperty("--rotateX", offsetX + "deg");
  element.style.setProperty("--rotateY", -1 * offsetY + "deg");
}