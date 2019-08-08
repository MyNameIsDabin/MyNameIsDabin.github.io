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
    underLine.style.left = dist + "px"
    underLine.style.width = el.offsetWidth + "px";
  }
  setTimeout(()=>{
    underLine.style.transition = tempTransition;
  }, 1);
}

function drawRoundedChart(selectorContainer, dataset) {
  const anchor = d3.select(selectorContainer);

  const div = anchor.selectAll(selectorContainer + " div")
  .data(dataset);

  div.enter().append("div")
  .attr("class", "bar");

  d3.select("body").selectAll(".bar")
  .append("div")
  .attr("class","pattern");

  d3.select("body").selectAll(".pattern")
    .append("div")
    .text(d=>d.name)
    .attr("class", "percentage")
    .transition()
    .delay((d, i) => i * 50)
    .duration(2800)
    .style("min-width", (d, i) => d.value + "%")

  d3.select("body").selectAll(".bar")
    .transition()
    .ease(d3.easeElastic)
    .delay((d, i) => i * 50)
    .duration(2800)
    .style("width", d => d.value + "%");

  const colorRange = d3.scaleLinear()
    .domain([0, 100])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#ffc64e"), d3.rgb('#ff4141')])

  d3.select("body").selectAll(".pattern")
    .transition()
    .duration(1500)
    .style("background-color", d=>colorRange(d.value))
}

window.onload = () => {
  initNavigationEvents(".current-bar", ".site-nav a");
}