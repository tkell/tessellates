// entry
window.addEventListener("load", (event) => {
  const ourImage = document.getElementById("test");
  ourImage.addEventListener("click", function(e) {
    ourImage.classList.add("motion-demo");
    console.log("hello");
  })
})
