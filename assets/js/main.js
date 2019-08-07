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

function drawBarChart(selectorContainer, dataset) {
  const margin = { top: 40, right: 30, bottom: 30, left: 30 },
  width = 740 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

  const greyColor = "#898989";
  const colors = ["#f3b619", "#f37919", "#ff4141"];

  const formatPercent = d3.format(".0%");

  const _width = width + margin.left + margin.right;
  const _height = height + margin.top + margin.bottom;
  const svg = d3.select(selectorContainer).append("svg")
    .attr("viewBox", '0 0 ' + _width + ' ' + _height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  const x = d3.scaleBand().range([0, width]).padding(0.4);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
  const yAxis = d3.axisLeft(y).tickFormat(formatPercent);

  x.domain(dataset.map( d => d.name));
  // y.domain([0, d3.max(dataset,  d => { return d.value; })]);
  y.domain([0, 1]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
  // svg.append("g")
  //   .attr("class","y axis")
  //   .call(yAxis);

  const getColorIdx = (value) => {
    if (value <= 0.5) {
      return 0;
    } else if (value <= 0.7) {
      return 1;
    } else if (value <= 1.0) {
      return 2;
    }
  }

  svg.selectAll(".bar")
    .data(dataset)
    .enter().append("rect")
    .attr("class", "bar")
    .style("display", d => d.value === null ? "none" : null)
    .style("fill",  d => colors[getColorIdx(d.value)])
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth()-5)
    .attr("y", d => height)
    .attr("height", 0)
    .transition()
    .duration(750)
    .delay((d, i) => i * 150)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));

  // svg.selectAll(".label")        
  //   .data(dataset)
  //   .enter()
  //   .append("text")
  //   .attr("class", "label")
  //   .style("display",  d =>  d.value === null ? "none" : null)
  //   .attr("x", d => x(d.name) + (x.bandwidth() / 2) - 14)
  //   .style("fill",  d => colors[getColorIdx(d.value)])
  //   .attr("y",  d => height)
  //   .attr("height", 0)
  //   .transition()
  //   .duration(750)
  //   .delay((d, i) => i * 150)
  //   .text( d => formatPercent(d.value))
  //   .attr("y",  d => y(d.value) + 0.1)
  //   .attr("dy", "-0.7em"); 
}

window.onload = () => {
  initNavigationEvents(".current-bar", ".site-nav a");
}