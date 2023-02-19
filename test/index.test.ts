import Multimap from '../src/Multimap';

// create and populate multimap
const assignments = [
    { student: 'Alice', grade: 87 },
    { student: 'Alice', grade: 93 },
    { student: 'Alice', grade: 94 },
    { student: 'Bob', grade: 62 },
    { student: 'Bob', grade: 74 },
    { student: 'Carol', grade: 100 },
];

const mm = new Multimap();

assignments.forEach((assignment) => mm.set(assignment.student, assignment.grade));

// test
describe('test multimap integrity', () => {
    test('count and size', () => {
        expect(mm.size).toBe(6);
        expect(mm.count).toBe(3);
    });

    test('get', () => {
        expect(mm.get('Alice')).toStrictEqual([87, 93, 94]);
        expect(mm.get('foo')).toStrictEqual([]);
    });

    test('has', () => {
        expect(mm.has('Bob')).toBe(true);
        expect(mm.has('foo')).toBe(false);
    });
});

describe('test multimap insertion/deletion', () => {
    test('insertion', () => {
        mm.set('Dan', 60);
        mm.set('Frank', 81, 82, 83);

        expect(mm.get('Dan')).toStrictEqual([60]);
        expect(mm.get('Frank')).toStrictEqual([81, 82, 83]);

        expect(mm.size).toBe(10);
        expect(mm.count).toBe(5);
    });

    test('deletion', () => {
        expect(mm.delete('Dan')).toBe(true);
        expect(mm.delete('Frank', 80)).toBe(false);
        expect(mm.delete('Frank', 81)).toBe(true);
        expect(mm.delete('Frank', 82)).toBe(true);
        expect(mm.delete('Frank', 83)).toBe(true);
        expect(mm.delete('Frank', 84)).toBe(false);
        expect(mm.delete('Dawn')).toBe(false);

        expect(mm.size).toBe(6);
        expect(mm.count).toBe(3);
    });
});
