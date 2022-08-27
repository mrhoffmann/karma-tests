import { Course } from 'src/app/models/courses.model';

const mockResponses: Course[] = [
	<Course>{
		name: 'Chessable',
		description: 'Space repetition to learn chess, backed by science',
	},
	<Course>{
		name: 'ICC',
		description: 'Play chess online',
	},
];

export const environment = {
	production: false,
	apiURL: 'http://localhost:8089',
	mockResponse: mockResponses,
};
