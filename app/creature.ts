import _ from './util';
import type {Creature, CreatureAction, CreatureInitializer, CreatureOptions, Neighbor} from './types';

type CreatureConstructor = (new(options?: CreatureOptions) => Creature) & {prototype: Creature};
interface CreatureFactory {
  make(type: string | false | undefined, options?: CreatureOptions): Creature | false;
  registerCreature(options: CreatureOptions, init?: CreatureInitializer): boolean;
  registerCA(options: CreatureOptions, init?: CreatureInitializer): boolean;
}

// abstract factory that adds a superclass of baseCreature
var factory: CreatureFactory = (function () {
  function baseCreature(this: Creature) {
    this.age = -1;
  }
  function baseCA(this: Creature) {
    this.age = -1;
  }


  // The legacy function constructors back the dynamically registered prototype chains.
  const BaseCreatureConstructor = baseCreature as unknown as new () => Creature;
  const BaseCAConstructor = baseCA as unknown as new () => Creature;
  baseCreature.prototype.initialEnergy = 50;
  baseCreature.prototype.maxEnergy = 100;
  baseCreature.prototype.efficiency = 0.7;
  baseCreature.prototype.size = 50;
  baseCreature.prototype.actionRadius = 1;
  baseCreature.prototype.sustainability = 2;
  // used as percentages of maxEnergy
  baseCreature.prototype.reproduceLv = 0.70;
  baseCreature.prototype.moveLv = 0;

  baseCreature.prototype.boundEnergy = function (this: Creature) {
    if (this.energy! > this.maxEnergy!)
      this.energy = this.maxEnergy!;
  };

  baseCreature.prototype.isDead = function (this: Creature) {
    return this.energy! <= 0;
  };

  baseCreature.prototype.reproduce = function (this: Creature, neighbors: Neighbor[]) {
    var spots = _.filter(neighbors, function (spot: Neighbor) {
      return !spot.creature;
    });

    if (spots.length) {
      var step = spots[_.random(spots.length - 1)];
      var coords = step.coords;
      var creature = factory.make(this.type);

      var successFn = (function (this: Creature) {
        this.energy! -= this.initialEnergy!;
        return true;
      }).bind(this);
      var failureFn = this.wait;

      return {
        x: coords.x,
        y: coords.y,
        creature: creature,
        successFn: successFn,
        failureFn: failureFn
      };
    } else return false;
  };

  baseCreature.prototype.move = function (this: Creature, neighbors: Neighbor[]) {
    var creature = this;

    // first, look for creatures to eat
    var spots = _.filter(neighbors, (function (this: Creature, spot: Neighbor) {
      return spot.creature ? spot.creature.size! < this.size! : false;
    }).bind(this));

    // if there's not enough food, try to move
    if (spots.length < this.sustainability!) {
      spots = _.filter(neighbors, function (spot: Neighbor) {
        return !spot.creature;
      });
    }

    // if we've got a spot to move to...
    if (spots.length) {
      // ...pick one
      var step = spots[_.random(spots.length - 1)];

      var coords = step.coords;

      var successFn = (function (this: Creature) {
        var foodEnergy = (step.creature ? step.creature.energy : undefined)! * this.efficiency!;
        // add foodEnergy if eating, subtract 10 if moving
        this.energy = this.energy! + (foodEnergy || -10);
        // clear the original location
        return false;
      }).bind(this);

      return {
        x: coords.x,
        y: coords.y,
        creature: creature,
        successFn: successFn
      };
    } else return false;
  };

  baseCreature.prototype.wait = function (this: Creature) {
    this.energy! -= 5;
    return true;
  };

  baseCreature.prototype.process = function (this: Creature, neighbors: Neighbor[], x: number, y: number) {
    var step: CreatureAction | false = {x: 0, y: 0, creature: false};
    var maxEnergy = this.maxEnergy;

    if (this.energy! > maxEnergy! * this.reproduceLv! && this.reproduce) {
      step = this.reproduce(neighbors);
    } else if (this.energy! > maxEnergy! * this.moveLv! && this.move) {
      step = this.move(neighbors);
    }

    if (step !== false && step.creature) {
      var creature = step.creature;
      creature.successFn = step.successFn || creature.wait;
      creature.failureFn = step.failureFn || creature.wait;

      return {
        x: step.x,
        y: step.y,
        creature: creature,
        observed: true
      };
    } else return this.energy !== this.maxEnergy;
  };

  baseCA.prototype.actionRadius = 1;
  baseCA.prototype.boundEnergy = function (this: Creature) {};
  baseCA.prototype.isDead = function (this: Creature) { return false; };
  baseCA.prototype.process = function (this: Creature, neighbors: Neighbor[], x: number, y: number) {};
  baseCA.prototype.wait = function (this: Creature) {};

  // Storage for our creature types
  var types: Record<string, CreatureConstructor> = {};

  return {
    make: function (type: string | false | undefined, options?: CreatureOptions): Creature | false {
      var CreatureType = types[String(type)];
      return (CreatureType ? new CreatureType(options) : false);
    },

    registerCreature: function (options: CreatureOptions, init?: CreatureInitializer) {
      var type = options.type;
      // only register classes that fulfill the creature contract
      if (typeof type === 'string' && typeof types[type] === 'undefined') {
        // set the constructor, including init if it's defined
        // These dynamic constructors get their typed prototype directly below.
        if (typeof init === 'function') {
          types[type] = (function (this: Creature) {
            this.energy = this.initialEnergy;
            init.call(this);
          }) as unknown as CreatureConstructor;
        } else {
          types[type] = (function (this: Creature) {
            this.energy = this.initialEnergy;
          }) as unknown as CreatureConstructor;
        }

        var color = options.color || options.colour;
        // set the color randomly if none is provided
        if (typeof color !== 'object' || color.length !== 3) {
          options.color = [_.random(255), _.random(255), _.random(255)];
        }

        types[type].prototype = new BaseCreatureConstructor();
        types[type].prototype.constructor = types[type];

        _.each(options, function (value: unknown, key: string) {
          types[type].prototype[key] = value;
        });

        types[type].prototype.successFn = types[type].prototype.wait;
        types[type].prototype.failureFn = types[type].prototype.wait;
        types[type].prototype.energy = options.initialEnergy;

        return true;
      } else return false;
    },

    registerCA: function (options: CreatureOptions, init?: CreatureInitializer) {
      var type = options.type;
      if (typeof type === 'string' && typeof types[type] === 'undefined') {
        // set the constructor, including init if it's defined
        // These dynamic constructors get their typed prototype directly below.
        types[type] = (typeof init === 'function' ?
           function (this: Creature) { init.call(this); } :
           function (this: Creature) {}) as unknown as CreatureConstructor;
        var color = options.color = options.color || options.colour;
        // set the color randomly if none is provided
        if (typeof color !== 'object' || color.length !== 3) {
          options.color = [_.random(255), _.random(255), _.random(255)];
        }

        options.colorFn = options.colorFn || options.colourFn;

        types[type].prototype = new BaseCAConstructor();
        types[type].prototype.constructor = types[type];

        _.each(options, function (value: unknown, key: string) {
          types[type].prototype[key] = value;
        });

        return true;
      } else return false;
    }
  };
})();

export default factory;
