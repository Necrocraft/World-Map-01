(function(d3, topojson) {
    'use strict';
    const svg = d3.select("svg");

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append('g');

var tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .attr("class", "d3tooltip")
                    .text("a simple tooltip");

svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));

Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
]).then(([tsvData, topojsonData]) => {
    const countryName = {};
    tsvData.forEach(d => {
        countryName[d.iso_n3] = d.name;
    }
    );
    const countries = topojson.feature(topojsonData, topojsonData.objects.countries);
    g
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
        .attr("class", "country")
        .attr("d", pathGenerator)
        .on("mouseover", function(d){tooltip.html((countryName[d.id])); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
});
}(d3, topojson));