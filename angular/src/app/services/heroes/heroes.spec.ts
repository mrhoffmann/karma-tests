import { getRandomEnumValue } from 'src/app/helpers/helpers';
import {
	Classes,
	Monster,
	Entity,
	Hero,
	Level,
	MonsterClasses,
	Sword,
} from 'src/app/classes/hero.class';

describe('CoursesService', () => {
	const heroNames: string[] = [
		'Waldemar',
		'Conan',
		'Heracles',
		'Jakar',
		'Portim',
	];
	const monster: Entity = new Monster(
		'Fallen',
		getRandomEnumValue(MonsterClasses),
		new Level()
	);
	let heroes: Hero[] = [];

	const randomHero = (): Hero =>
		heroes[Math.floor(Math.random() * heroes.length)];

	beforeEach(() => {
		heroes = [];
		heroNames.forEach((x) => {
			heroes.push(new Hero(x, getRandomEnumValue(Classes), new Level(1)));
		});
	});

	it('should have the same number of hero-objects as it has names to use', () => {
		expect(heroes.length).toEqual(heroNames.length);
	});

	it('should be possible for a hero to increase their level', () => {
		const hero = randomHero();
		const level = hero.level.current;
		hero.level.increase(100);
		expect(level).toBeLessThan(hero.level.current);
	});

	it('a fully healed hero should not die from a fist attack from a monster, but should die from a sword doing more damage than the armor and health of a hero', () => {
		const hero = randomHero();
		const sword = new Sword(hero.armor + 100, 10, 10, 10);
		hero.heal(100);

		monster.equipWeapon(sword);
		monster.doDamage(hero);
		expect(hero.isAlive).toBeFalse();
	});

	it('an entity should not be able to equip something of higher requirement', () => {
		const hero = randomHero();
		const sword = new Sword(hero.armor + 100, 17, 15, 13);
		const canHeroEquipSword = sword.canEquip(hero);
		expect(canHeroEquipSword).toBeFalse();
	});

	it('an entity should be able to equip something of lower requirement', () => {
		const hero = randomHero();
		const sword = new Sword(5, 10, 10, 10);
		const canHeroEquipSword = sword.canEquip(hero);
		expect(canHeroEquipSword).toBeTrue();
	});

	it('two entities should be able to fight each other to death where monster attacks first', () => {
		const hero = randomHero();
		const sword = new Sword(39, 10, 10, 10);
		const weakSword = new Sword(5, 10, 10, 10);
		hero.heal(100);
		monster.heal(100);
		hero.equipWeapon(sword);
		monster.equipWeapon(weakSword);

		do {
			monster.doDamage(hero);
			hero.doDamage(monster);
		} while (hero.isAlive && monster.isAlive);

		expect(hero.isAlive || monster.isAlive).toBeTrue();
		expect(monster.isAlive).toBeFalse();
		expect(monster.dropLoot().length).toBeGreaterThan(0);
		expect(hero.level.experience).toBeGreaterThan(0);
	});
});
