'use strict';

import { Random } from '../helpers/helpers';

//#region enums
export enum Classes {
	Barbarian,
	Sorceress,
	Assassin,
	Druid,
	Necromancer,
	Paladin,
	Amazon,
}

export enum MonsterClasses {
	Zombie,
	Imp,
	Spider,
	Skeleton,
}

export enum TypeOfEquippable {
	helmet,
	chestplate,
	pants,
	gloves,
	boots,
	shield,
	weapon,
	closeCombatWeapon,
	rangeWeapon,
	longRangeWeapon,
}
//#endregion
//#region classes
export class Level {
	private _current: number;
	private _next_level: number;
	private _experience: number;

	constructor(current = 1) {
		this._current = current;
		this._experience = 0;
		this._next_level = 100;
		this._calcNextLevel();
	}

	public get current() {
		return this._current;
	}
	private _calcNextLevel() {
		this._next_level = this._current * 100;
	}
	private get level_up(): boolean {
		return this._experience >= this._next_level ? true : false;
	}
	public get next(): number {
		return this._next_level;
	}
	public get experience(): number {
		return this._experience;
	}
	public increase(p0: number) {
		this._experience += p0;
		if (this.level_up) {
			this._current += 1;
			this._calcNextLevel();
		}
	}
}

export class Damage {
	value: number;
	sender: Entity;

	constructor(_value: number, _sender: Entity) {
		this.value = _value;
		this.sender = _sender;
	}
}
//#endregion
//#region abstract classes
export abstract class Equippable {
	_reqStrength: number;
	_reqDexterity: number;
	_reqIntelligence: number;
	_typeOfEquippable: TypeOfEquippable;

	constructor(
		typeOfEquippable: TypeOfEquippable,
		rS: number,
		rD: number,
		rI: number
	) {
		this._reqStrength = rS;
		this._reqDexterity = rD;
		this._reqIntelligence = rI;
		this._typeOfEquippable = typeOfEquippable;
	}

	public get Type() {
		return this._typeOfEquippable;
	}

	public canEquip = (wielder: Entity) =>
		wielder.strength() >= this._reqStrength &&
		wielder.intelligence() >= this._reqIntelligence &&
		wielder.dexterity() >= this._reqDexterity;
}

export abstract class Armor extends Equippable {
	armor: number;

	constructor(
		typeOfEquippable: TypeOfEquippable,
		armor: number,
		rS: number,
		rD: number,
		rI: number
	) {
		super(typeOfEquippable, rS, rD, rI);
		this.armor = armor;
	}
}

export abstract class Weapon extends Equippable {
	damage: number;

	constructor(
		typeOfEquippable: TypeOfEquippable,
		dmg: number,
		rS = 0,
		rD = 0,
		rI = 0
	) {
		super(typeOfEquippable, rS, rD, rI);
		this.damage = dmg;
	}

	public doDamage(wielder: Entity) {
		const dmg = new Damage(this.damage, wielder);
		wielder.takeDamage(dmg);
	}
}

export abstract class Entity {
	private _name: string;
	private _class: Classes | MonsterClasses;
	private _health: number;
	private _mana: number;
	private _level: Level;
	private _damage: Damage[];
	private _strength: number;
	private _dexterity: number;
	private _intelligence: number;

	private _helmet: Helmet;
	private _chest: ChestPlate;
	private _offHand: Shield;
	private _pants: Pants;
	private _gloves: Gloves;
	private _boots: Boots;
	private _weapon: Weapon;
	private _armors: Armor[];
	private _inventory: Equippable[];

	constructor(_name: string, _class: Classes | MonsterClasses, _level: Level) {
		this._name = _name;
		this._class = _class;
		this._health = 100;
		this._mana = 100;
		this._level = _level;
		this._damage = [];
		this._strength = 15;
		this._dexterity = 10;
		this._intelligence = 12;
		this._weapon = new Fist(1, -1, 0, 0);
		this._offHand = new Shield(TypeOfEquippable.shield, 5, 0, 0, 0);
		this._helmet = new Helmet(TypeOfEquippable.helmet, 2, 15, 10, 0);
		this._chest = new ChestPlate(TypeOfEquippable.chestplate, 8, 15, 10, 12);
		this._offHand = new Shield(TypeOfEquippable.shield, 5, 15, 10, 12);
		this._pants = new Pants(TypeOfEquippable.pants, 3, 15, 10, 12);
		this._gloves = new Gloves(TypeOfEquippable.gloves, 1, 15, 10, 12);
		this._boots = new Boots(TypeOfEquippable.boots, 4, 15, 10, 12);
		this._armors = [
			this._helmet,
			this._chest,
			this._pants,
			this._gloves,
			this._boots,
		];
		this._inventory = JSON.parse(JSON.stringify(this._armors)); //since we can't simply clone the array >:(
		this._inventory.push(this._weapon);
		if (typeof this._offHand !== typeof Weapon) {
			this._armors.push(this._offHand);
		}
	}

	public strength = () => this._strength;
	public dexterity = () => this._dexterity;
	public intelligence = () => this._intelligence;
	public dropLoot(): Equippable[] {
		return this._inventory;
	}
	public equipArmor(equippable: Armor) {
		if (equippable.canEquip(this)) {
			switch (equippable.Type) {
				case TypeOfEquippable.boots:
					this._boots = equippable;
					break;
				case TypeOfEquippable.helmet:
					this._helmet = equippable;
					break;
				case TypeOfEquippable.chestplate:
					this._chest = equippable;
					break;
				case TypeOfEquippable.gloves:
					this._gloves = equippable;
					break;
				case TypeOfEquippable.pants:
					this._pants = equippable;
					break;
				case TypeOfEquippable.shield:
					this._offHand = equippable;
					break;
			}
		}
	}
	public equipWeapon(equippable: Weapon) {
		if (equippable.canEquip(this)) {
			this._weapon = equippable;
		}
	}
	public get armor(): number {
		return this._armors
			.map((x) => x.armor)
			.reduce((acc, obj) => {
				return acc + obj;
			});
	}
	public get isAlive(): boolean {
		return this._health > 0;
	}
	public hasMana = () => this._mana > 0;
	public takeDamage(p0: Damage) {
		p0.value = p0.value - this.armor;

		if (p0.value > 0) {
			this._damage.push(p0);
			this._health -= p0.value;
		}
	}
	public heal(p0: number) {
		if (this._health >= 100) {
			return;
		}
		if (this._health + p0 > 100) {
			this._health = 100;
			return;
		}
		this._health += p0;
	}
	public get health(): number {
		return this._health;
	}
	public doDamage(entity: Entity) {
		const isAlive = entity.isAlive;
		this._weapon.doDamage(entity);

		if (!entity.isAlive && isAlive === true) {
			this._level.increase(entity.level.experience);
		}
	}
	public get weapon(): Weapon {
		return this._weapon;
	}
	public loot(monster: Monster): Equippable[] {
		if (!monster.isAlive) {
			return [];
		}
		return monster.dropLoot();
	}
	public get level() {
		return this._level;
	}
	public getType = (): string => '';
	public dropExperience(): number {
		if (!this.isAlive) {
			return this._level.experience;
		}
		return 0;
	}
	public name = () => this._name;
	public class = () => this._class;
	public display = () =>
		`${this.health} / 100 - ${this._name} (${this.getType})`;
}
//#endregion
//#region types of armors
export class Helmet extends Armor {}
export class ChestPlate extends Armor {}
export class Gloves extends Armor {}
export class Pants extends Armor {}
export class Boots extends Armor {}
export class Shield extends Armor {}
//#endregion
//#region types of weapons
export class Fist extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.closeCombatWeapon, dmg, rS, rD, rI);
	}
}
export class Fang extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.closeCombatWeapon, dmg, rS, rD, rI);
	}
}
export class BoneyHand extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.closeCombatWeapon, dmg, rS, rD, rI);
	}
}
export class RottenHand extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.closeCombatWeapon, dmg, rS, rD, rI);
	}
}
export class Bow extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.rangeWeapon, dmg, rS, rD, rI);
	}
}
export class Sword extends Weapon {
	constructor(dmg: number, rS = 0, rD = 0, rI = 0) {
		super(TypeOfEquippable.closeCombatWeapon, dmg, rS, rD, rI);
	}
}
//#endregion

export class Monster extends Entity {
	constructor(_name: string, _class: Classes | MonsterClasses, _level: Level) {
		super(_name, _class, _level);
		_level.increase(Random(199, _level.current * Math.PI + 10));

		if (_class == MonsterClasses.Imp) {
			this.equipWeapon(new Sword(Random(32, 27)));
		} else if (_class == MonsterClasses.Skeleton) {
			this.equipWeapon(new BoneyHand(Random(35, 27)));
		} else if (_class == MonsterClasses.Zombie) {
			this.equipWeapon(new RottenHand(Random(29, 28)));
		} else if (_class == MonsterClasses.Spider) {
			this.equipWeapon(new Fang(Random(49, 29)));
		}
	}

	override getType = () => MonsterClasses[this.class()];
	override display = () =>
		`${this.health} / 100 - ${this.name()} (${this.getType()})`;
}

export class Hero extends Entity {
	constructor(_name: string, _class: Classes, _level: Level) {
		super(_name, _class, _level);
	}

	override getType = () => Classes[this.class()];
	override display = () =>
		`${this.health} / 100 - ${this.name()} (${this.getType()})`;
}
