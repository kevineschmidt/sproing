"use strict";
(() => {
  // src/vector.ts
  var Vector = class _Vector {
    x;
    y;
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    length() {
      return Math.sqrt(this.dot(this));
    }
    sub(v) {
      return new _Vector(this.x - v.x, this.y - v.y);
    }
    add(v) {
      return new _Vector(this.x + v.x, this.y + v.y);
    }
    dot(v) {
      return this.x * v.x + this.y * v.y;
    }
    scale(factor) {
      return new _Vector(this.x * factor, this.y * factor);
    }
    normalize() {
      return this.scale(1 / this.length());
    }
  };
  var vector_default = Vector;

  // src/world.ts
  var BACKGROUND = "black";
  var SPRING = "orange";
  var gravity = new vector_default(0, 980);
  var World = class {
    walls;
    objects;
    animationRequest;
    canvas;
    context;
    animating;
    constructor(canvas2) {
      this.walls = [];
      this.objects = [];
      this.animationRequest = null;
      this.canvas = canvas2;
      this.context = canvas2.getContext("2d");
      this.animating = false;
    }
    stop() {
      if (this.animationRequest)
        window.cancelAnimationFrame(this.animationRequest);
      this.animationRequest = null;
      this.animating = false;
      this.draw();
    }
    draw() {
      this.context.fillStyle = BACKGROUND;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.walls.forEach((wall) => wall.draw(this.context));
      this.context.strokeStyle = SPRING;
      this.context.fillStyle = SPRING;
      this.objects.forEach((object) => {
        object.springs.forEach((spring) => spring.draw(this.context));
        object.masses.forEach((mass) => mass.draw(this.context));
      });
    }
    update(deltaT) {
      this.objects.forEach((object) => {
        object.springs.forEach((spring) => spring.applyForce());
        object.masses.forEach((mass) => mass.applyForce(gravity.scale(mass.mass)));
        object.masses.forEach((mass) => mass.update(deltaT));
        this.walls.forEach((wall) => {
          object.masses.forEach((mass) => {
            wall.intersect(mass);
          });
        });
      });
    }
    animate() {
      if (this.animationRequest)
        window.cancelAnimationFrame(this.animationRequest);
      this.animating = true;
      this.draw();
      const UPDATES = 50;
      const deltaT = 0.01;
      for (let i = 0; i < UPDATES; ++i) {
        this.update(deltaT / UPDATES);
      }
      this.animationRequest = requestAnimationFrame(() => this.animate());
    }
  };

  // src/wall.ts
  var Wall = class {
    start;
    end;
    vector;
    length;
    normal;
    constructor(x1, x2, y1, y2) {
      this.start = new vector_default(x1, y1);
      this.end = new vector_default(x2, y2);
      this.vector = this.end.sub(this.start);
      this.length = this.vector.length();
      this.vector = this.vector.scale(1 / this.length);
      this.normal = new vector_default(-this.vector.y, this.vector.x);
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.end.x, this.end.y);
      ctx.stroke();
    }
    intersect(ball) {
      if (ball.position.x + ball.radius < this.start.x) return false;
      if (ball.position.x - ball.radius > this.end.x) return false;
      const v = ball.position.sub(this.start);
      const hdot = v.dot(this.normal);
      const ldot = v.dot(this.vector);
      if (Math.abs(hdot) < ball.radius && ldot > 0 && ldot < this.length) {
        const vdot = ball.velocity.dot(this.normal);
        if (vdot < 0 && hdot < 0 || vdot > 0 && hdot > 0) return false;
        const deltaV = this.normal.scale(vdot).add(this.normal.scale(vdot * ball.restitution));
        ball.velocity = ball.velocity.sub(deltaV);
        const friction = this.vector.scale(0.01 * ball.velocity.dot(this.vector));
        ball.velocity = ball.velocity.sub(friction);
        return true;
      }
      return false;
    }
  };

  // src/body.ts
  var Mass = class {
    force;
    velocity;
    position;
    mass;
    restitution;
    radius;
    color;
    constructor(mass, x, y, color) {
      this.force = new vector_default();
      this.velocity = new vector_default();
      this.position = new vector_default(x, y);
      this.mass = mass;
      this.radius = mass;
      this.restitution = 0.8;
      this.color = color;
    }
    applyForce(f) {
      this.force = this.force.add(f);
    }
    update(dt) {
      this.velocity = this.velocity.add(this.force.scale(dt / this.mass));
      this.force = new vector_default();
      this.position = this.position.add(this.velocity.scale(dt));
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.moveTo(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 360);
      ctx.fill();
    }
  };
  var Spring = class {
    mass1;
    mass2;
    k;
    length;
    damping;
    constructor(mass1, mass2, k, length) {
      this.mass1 = mass1;
      this.mass2 = mass2;
      this.k = k;
      this.damping = 20;
      this.length = length;
    }
    applyForce() {
      let dir = this.mass2.position.sub(this.mass1.position);
      const dirLen = dir.length();
      const springForce = (dirLen - this.length) * this.k;
      const dirNorm = dir.scale(1 / dirLen);
      const dampingForce = dirNorm.dot(this.mass2.velocity.sub(this.mass1.velocity)) * this.damping;
      const totalForce = springForce + dampingForce;
      this.mass1.applyForce(dirNorm.scale(totalForce));
      this.mass2.applyForce(dirNorm.scale(-1 * totalForce));
    }
    draw(ctx) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(this.mass1.position.x, this.mass1.position.y);
      ctx.lineTo(this.mass2.position.x, this.mass2.position.y);
      ctx.stroke();
    }
  };
  var Body = class {
    springs;
    masses;
    constructor(springs = [], masses = []) {
      this.springs = springs;
      this.masses = masses;
    }
  };

  // src/index.ts
  var canvas = document.querySelector("canvas");
  var button = document.querySelector("#start-stop-button");
  var world = new World(canvas);
  world.walls = [
    new Wall(0, 0, 0, canvas.height),
    new Wall(canvas.width, canvas.width, canvas.height, 0),
    new Wall(0, canvas.width, canvas.height, canvas.height),
    new Wall(0, canvas.width / 2, canvas.height * 0.5, canvas.height * 4 / 5),
    new Wall(canvas.width / 2, canvas.width, 200, 75),
    new Wall(300, 500, 430, 350)
  ];
  var newBody = new Body();
  var activeMass = null;
  world.objects.push(newBody);
  var MASS_RADIUS = 5;
  var MASS_COLOR = "red";
  var SELECTED_MASS_COLOR = "blue";
  canvas.onclick = (event) => {
    const center = new vector_default(event.offsetX, event.offsetY);
    const clickedMass = newBody.masses.find((mass) => {
      return center.sub(mass.position).length() < MASS_RADIUS * 2;
    });
    if (clickedMass && clickedMass !== activeMass) {
      if (!activeMass) {
        activeMass = clickedMass;
        activeMass.color = SELECTED_MASS_COLOR;
      } else {
        const dist = activeMass.position.sub(clickedMass.position).length();
        const spring = new Spring(activeMass, clickedMass, 4e3, dist);
        newBody.springs.push(spring);
        activeMass.color = "red";
        activeMass = null;
      }
    } else {
      if (activeMass) activeMass.color = MASS_COLOR;
      newBody.masses.push(new Mass(MASS_RADIUS, center.x, center.y, MASS_COLOR));
    }
    world.draw();
  };
  button.onclick = () => {
    if (world.animating) world.stop();
    else world.animate();
  };
  world.draw();
})();
