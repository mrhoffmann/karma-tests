import { Course } from 'src/app/models/courses.model';

const mockResponses: Course[] = [
	<Course>{
		name: 'Chessable',
		topicId: 1,
		description: 'Space repetition to learn chess, backed by science',
	},
	<Course>{
		name: 'ICC',
		topicId: 2,
		description: 'Play chess online',
	},
];

export const environment = {
	production: false,
	apiURL: 'http://localhost:8089',
	socketEndPoint: 'http://localhost:3000',
	mockResponse: mockResponses,
};
