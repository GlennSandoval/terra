import _ from './util';
import type {
  Creature,
  CreatureAction,
  CreatureInitializer,
  CreatureOptions,
  Neighbor,
} from './types';

type CreatureConstructor = (new (options?: CreatureOptions) => Creature) & {prototype: Creature};
interface CreatureFactory {
  make(type: string | false | undefined, options?: CreatureOptions): Creature | false;
  registerCreature(options: CreatureOptions, init?: CreatureInitializer): boolean;
  registerCA(options: CreatureOptions, init?: CreatureInitializer): boolean;
}

// abstract factory that adds a superclass of baseCreature
const factory: CreatureFactory = (() => {
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
  baseCreature.prototype.reproduceLv = 0.7;
  baseCreature.prototype.moveLv = 0;

  baseCreature.prototype.boundEnergy = function (this: Creature) {
    if (this.energy !== undefined && this.maxEnergy !== undefined && this.energy > this.maxEnergy) {
      this.energy = this.maxEnergy;
    }
  };

  baseCreature.prototype.isDead = function (this: Creature) {
    return this.energy !== undefined && this.energy <= 0;
  };

  baseCreature.prototype.reproduce = function (this: Creature, neighbors: Neighbor[]) {
    const spots = _.filter(neighbors, (spot: Neighbor) => {
      return !spot.creature;
    });

    if (spots.length) {
      const step = spots[_.random(spots.length - 1)];
      const coords = step.coords;
      const creature = factory.make(this.type);

      const successFn = function (this: Creature) {
        this.energy = Number(this.energy) - Number(this.initialEnergy);
        return true;
      }.bind(this);
      const failureFn = this.wait;

      return {
        x: coords.x,
        y: coords.y,
        creature: creature,
        successFn: successFn,
        failureFn: failureFn,
      };
    } else return false;
  };

  baseCreature.prototype.move = function (this: Creature, neighbors: Neighbor[]) {
    // first, look for creatures to eat
    let spots = _.filter(
      neighbors,
      function (this: Creature, spot: Neighbor) {
        return spot.creature
          ? spot.creature.size !== undefined &&
              this.size !== undefined &&
              spot.creature.size < this.size
          : false;
      }.bind(this),
    );

    // if there's not enough food, try to move
    if (this.sustainability !== undefined && spots.length < this.sustainability) {
      spots = _.filter(neighbors, (spot: Neighbor) => {
        return !spot.creature;
      });
    }

    // if we've got a spot to move to...
    if (spots.length) {
      // ...pick one
      const step = spots[_.random(spots.length - 1)];

      const coords = step.coords;

      const successFn = function (this: Creature) {
        const foodEnergy =
          Number(step.creature ? step.creature.energy : undefined) * Number(this.efficiency);
        // add foodEnergy if eating, subtract 10 if moving
        this.energy = Number(this.energy) + (foodEnergy || -10);
        // clear the original location
        return false;
      }.bind(this);

      return {
        x: coords.x,
        y: coords.y,
        creature: this,
        successFn: successFn,
      };
    } else return false;
  };

  baseCreature.prototype.wait = function (this: Creature) {
    this.energy = Number(this.energy) - 5;
    return true;
  };

  baseCreature.prototype.process = function (
    this: Creature,
    neighbors: Neighbor[],
    _x: number,
    _y: number,
  ) {
    let step: CreatureAction | false = {x: 0, y: 0, creature: false};
    const maxEnergy = this.maxEnergy;

    if (
      this.energy !== undefined &&
      maxEnergy !== undefined &&
      this.reproduceLv !== undefined &&
      this.energy > maxEnergy * this.reproduceLv &&
      this.reproduce
    ) {
      step = this.reproduce(neighbors);
    } else if (
      this.energy !== undefined &&
      maxEnergy !== undefined &&
      this.moveLv !== undefined &&
      this.energy > maxEnergy * this.moveLv &&
      this.move
    ) {
      step = this.move(neighbors);
    }

    if (step !== false && step.creature) {
      const creature = step.creature;
      creature.successFn = step.successFn || creature.wait;
      creature.failureFn = step.failureFn || creature.wait;

      return {
        x: step.x,
        y: step.y,
        creature: creature,
        observed: true,
      };
    } else return this.energy !== this.maxEnergy;
  };

  baseCA.prototype.actionRadius = 1;
  baseCA.prototype.boundEnergy = function (this: Creature) {};
  baseCA.prototype.isDead = function (this: Creature) {
    return false;
  };
  baseCA.prototype.process = function (
    this: Creature,
    _neighbors: Neighbor[],
    _x: number,
    _y: number,
  ) {};
  baseCA.prototype.wait = function (this: Creature) {};

  // Storage for our creature types
  const types: Record<string, CreatureConstructor> = {};

  return {
    make: (type: string | false | undefined, options?: CreatureOptions): Creature | false => {
      const CreatureType = types[String(type)];
      return CreatureType ? new CreatureType(options) : false;
    },

    registerCreature: (options: CreatureOptions, init?: CreatureInitializer) => {
      const type = options.type;
      // only register classes that fulfill the creature contract
      if (typeof type === 'string' && typeof types[type] === 'undefined') {
        // set the constructor, including init if it's defined
        // These dynamic constructors get their typed prototype directly below.
        if (typeof init === 'function') {
          types[type] = function (this: Creature) {
            this.energy = this.initialEnergy;
            init.call(this);
          } as unknown as CreatureConstructor;
        } else {
          types[type] = function (this: Creature) {
            this.energy = this.initialEnergy;
          } as unknown as CreatureConstructor;
        }

        const color = options.color || options.colour;
        // set the color randomly if none is provided
        if (typeof color !== 'object' || color.length !== 3) {
          options.color = [_.random(255), _.random(255), _.random(255)];
        }

        types[type].prototype = new BaseCreatureConstructor();
        types[type].prototype.constructor = types[type];

        _.each(options, (value: unknown, key: string) => {
          types[type].prototype[key] = value;
        });

        types[type].prototype.successFn = types[type].prototype.wait;
        types[type].prototype.failureFn = types[type].prototype.wait;
        types[type].prototype.energy = options.initialEnergy;

        return true;
      } else return false;
    },

    registerCA: (options: CreatureOptions, init?: CreatureInitializer) => {
      const type = options.type;
      if (typeof type === 'string' && typeof types[type] === 'undefined') {
        // set the constructor, including init if it's defined
        // These dynamic constructors get their typed prototype directly below.
        types[type] = (typeof init === 'function'
          ? function (this: Creature) {
              init.call(this);
            }
          : function (this: Creature) {}) as unknown as CreatureConstructor;
        const color = (options.color = options.color || options.colour);
        // set the color randomly if none is provided
        if (typeof color !== 'object' || color.length !== 3) {
          options.color = [_.random(255), _.random(255), _.random(255)];
        }

        options.colorFn = options.colorFn || options.colourFn;

        types[type].prototype = new BaseCAConstructor();
        types[type].prototype.constructor = types[type];

        _.each(options, (value: unknown, key: string) => {
          types[type].prototype[key] = value;
        });

        return true;
      } else return false;
    },
  };
})();

export default factory;
