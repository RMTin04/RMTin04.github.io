let currentScene = 0;

function updateScene() {
    d3.selectAll('.scene').classed('visible', false);
    d3.select('#scene' + (currentScene + 1)).classed('visible', true);
}

function prevScene() {
    if (currentScene > 0) {
        currentScene--;
        updateScene();
    }
}

function nextScene() {
    if (currentScene < 2) {
        currentScene++;
        updateScene();
    }
}

d3.json('path/to/your/data.json').then(data => {
    // Scene 1
    const scene1 = d3.select('#scene1');
    scene1.append('h2').text('Global Temperature Changes');
    scene1.append('p').text('Introduction to global temperature changes.');

    // Scene 2
    const scene2 = d3.select('#scene2');
    scene2.append('h2').text('Temperature Changes by Continent');
    scene2.append('p').text('Detailed analysis.');

    // Scene 3
    const scene3 = d3.select('#scene3');
    scene3.append('h2').text('Future Projections');
    scene3.append('p').text('Explore future projections.');
});
