class PhysicsHandler {
    constructor(locations) {
      // this.engine = Matter.Engine.create(document.body, {
      //     render: {
      //         options: {
      //             wireframes: true
      //         }
      //     }
      // });
      this.engine = Matter.Engine.create();
      this.engine.world.gravity.y = 0.1;

      this.tentacles = [];

      locations.forEach(l => {
        const tentacle = Matter.Composites.softBody(l.x,l.y,2,15,0,0,true,4,{},{});
        const anchor1 = this.createAnchor(
                              tentacle.bodies[0].position.x,
                              tentacle.bodies[0].position.y,
                              tentacle.bodies[0]
                            );
        const anchor2 = this.createAnchor(
                              tentacle.bodies[1].position.x,
                              tentacle.bodies[1].position.y,
                              tentacle.bodies[1]
                            );
        Matter.World.add(this.engine.world, [tentacle,anchor1,anchor2]);

        tentacle.rig = l.rig || false;
        tentacle.randomModifier = (Math.random() * 2) - 1;

        this.tentacles.push(tentacle);
      });
      console.log(this.tentacles);
      Matter.Engine.run(this.engine);
      Matter.Events.on(this.engine, 'tick', event => { this.tick(event) });
    }

    createAnchor(x, y, bodyB) {
      return Matter.Constraint.create({
        pointA: {x: x, y: y},
        bodyB: bodyB,
        stiffness: 1,
      });
    }

    tick(event) {
      this.engine.world.gravity.x = Math.sin(event.timestamp/1000)/80;

      this.tentacles.forEach(t => {
        if (t.rig) {
          t.rig.forEach(r=>{
            const v = this.scale(
              this.vector(t.bodies[r.b].position,r.target),
              0.000002
              //this.distance(t.bodies[r.b].position,r.target) * 0.00000003
            );
            Matter.Body.applyForce(
              t.bodies[r.b],
              {x:0,y:0},
              {x:v.x,y:v.y},
            );
          });
        }
        Matter.Body.applyForce(
          t.bodies[t.bodies.length-1],
          {x:0,y:0},
          {x:Math.sin((event.timestamp/1000)*t.randomModifier)/50000,y:Math.sin((event.timestamp/1000)*t.randomModifier)/25000},
        );
      });
    }

    get bodies() {
      const total = [];

      this.tentacles.forEach(t => {
        const tentacle = [];
        for (let i = 0, b = t.bodies; i < b.length; i+=2){
          tentacle.push(this.midPoint(b[i].position,b[i+1].position));
        }
        total.push(tentacle);
      });

      return total;
    }

    midPoint(a,b) {
      return {
        x : a.x + ((b.x - a.x) / 2),
        y : a.y + ((b.y - a.y) / 2)
      }
    }

    vector(a,b) {
      return {
        x : (b.x - a.x),
        y : (b.y - a.y)
      }
    }

    scale(v,scale) {
      return {
        x: v.x*scale,
        y: v.y*scale
      }
    }

    distance(a,b) {
      const y = b.y - a.y;
      const x = b.x - a.x;

      return Math.sqrt(x*x + y*y);
    }
}

module.exports = PhysicsHandler;
