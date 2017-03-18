const PhysicsHandler = require('./physicsHandler.es6');

class Octo {
    constructor() {
      this.svg = document.getElementById("octoSVG");
      this.svgTentacles = []; // will hold the SVG path groups

      this.physics = new PhysicsHandler([
        {x: 135, y: 139, rig: [{b: 10, target: {x: 60, y: 218}}]},
        {x: 144.6, y: 139, rig: [{b: 10, target: {x: 100, y: 218}}]},
        {x: 156.2, y: 138},
        {x: 167.8, y: 138, rig: [{b: 10, target: {x: 200, y: 200}}]},
        {x: 179.4, y: 137, rig: [{b: 10, target: {x: 250, y: 190}}]},
        {x: 188, y: 137, rig: [{b: 10, target: {x: 280, y: 100}},{b: 20, target: {x: 190, y: 85}},{b: 29, target: {x: 280, y: 70}}]}
      ]);

      this.physics.bodies.forEach(b => {
        this.svgTentacles.push(this.createSvgGroup(b));
      });

      this.update();
    }

    update() {
      window.requestAnimationFrame(() => { this.update() });

      this.svgTentacles.forEach((t, j) => {
        for (let i = 0, n = t.childNodes, b = this.physics.bodies[j]; i < n.length; i++){
          n[i].setAttribute("x1", b[i].x);
          n[i].setAttribute("y1", b[i].y);
          n[i].setAttribute("x2", b[i+1].x);
          n[i].setAttribute("y2", b[i+1].y);
        }
      });
    }

    createSvgGroup(body) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      for (var i = 0; i < body.length-1; i++){
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', body[i].x);
        line.setAttribute('y1', body[i].y);
        line.setAttribute('x2', body[i+1].x);
        line.setAttribute('y2', body[i+1].y);
        line.setAttribute('stroke', "#FFD815");
        line.setAttribute('stroke-linecap', 'round')
        line.setAttribute('stroke-width', 17 - (i * (body.length/24)));
        line.setAttribute('shape-rendering','optimizeQuality');
        group.appendChild(line);
      }
      this.svg.appendChild(group);
      return group;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    let t = new Octo();
});
