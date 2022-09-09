import { getRandomEnumValue } from 'src/app/helpers/helpers';
import {
	Monster,
	Entity,
	Level,
	MonsterClasses,
	Hero,
	Classes,
	Sword,
} from 'src/app/classes/hero.class';

describe('monsters', () => {
	let heroes: Hero[];
	let monster: Entity;
	const heroNames: string[] = [
		'Waldemar',
		'Conan',
		'Heracles',
		'Jakar',
		'Portim',
	];
	const randomHero = (): Hero =>
		heroes[Math.floor(Math.random() * heroes.length)];

	beforeEach(() => {
		heroes = [];
		heroNames.forEach((x) => {
			heroes.push(new Hero(x, getRandomEnumValue(Classes), new Level(1)));
		});
		monster = new Monster(
			'Fallen',
			getRandomEnumValue(MonsterClasses),
			new Level()
		);
	});

	it('should be that a newly spawned monster should have their experience set', () => {
		expect(monster.level.experience).toBeGreaterThan(0);
	});

	it('should be possible to loot a dead monster', () => {
		spyOnProperty(monster, 'isAlive').and.returnValue(false);

		if (!monster.isAlive) {
			expect(monster.dropLoot().length).toBeGreaterThan(0);
		}
	});

	it('should be possible for a monster to drop experience if killed', () => {
		spyOnProperty(monster, 'isAlive').and.returnValue(false);

		if (!monster.isAlive) {
			expect(monster.dropExperience()).toBeGreaterThan(0);
		}
	});

	it('should not be possible for a monster to drop experience if killed', () => {
		if (monster.isAlive) {
			expect(monster.dropExperience()).toEqual(0);
		}
	});

	it('should get a random weapon of random quality', () => {
		expect(monster.weapon).toBeDefined();
	});

	it('should be able to do atleast have some base damage without interacting with an armor', () => {
		expect(monster.weapon.damage).toBeGreaterThanOrEqual(0);
	});

	it('should be able to kill a hero, especially if we give it an overpowered weapon', () => {
		const hero = randomHero();
		monster.equipWeapon(new Sword(1000));
		monster.doDamage(hero);
		expect(hero.isAlive).toBeFalse();
	});

	it('should be possible to determine what kind of monster it is without knowing before', () => {
		expect(
			/\d{1,}\s\/\s\d{3}\s-\s\w*\s\(\w*\)/i.test(monster.display())
		).toBeTrue();
	});
});
