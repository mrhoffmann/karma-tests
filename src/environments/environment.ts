// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
