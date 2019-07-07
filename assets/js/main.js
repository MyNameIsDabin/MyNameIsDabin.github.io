function initNavigationEvents(selectorUnderLine, selectorNavElements) {
  const underLine = document.querySelector(selectorUnderLine);
  const navElements = document.querySelectorAll(selectorNavElements);
  const tempTransition = underLine.style.transition;
  underLine.style.transition = "none";
  let undoUnderLine = null;
  navElements.forEach((el, i)=>{
    let left = 0;
    Array.from(navElements).slice(0, i).forEach(el=>left += el.offsetWidth);
    if (el.className.includes('active')) {
      undoUnderLine = [el, left];
      moveUnderLine(el, left);
    };
    el.addEventListener("mouseenter", event => moveUnderLine(event.target, left));
    el.addEventListener("mouseleave", event => {
      if (undoUnderLine) {
        moveUnderLine(undoUnderLine[0], undoUnderLine[1]);
      }
    });
  })
  function moveUnderLine(el, dist) {
    console.log(el);
    underLine.style.left = dist + "px"
    underLine.style.width = el.offsetWidth + "px";
  }
  setTimeout(()=>{
    underLine.style.transition = tempTransition;
  }, 1);
}

window.onload = () => {
  initNavigationEvents(".current-bar", ".site-nav a");
}