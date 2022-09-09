import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import {
	HttpClientTestingModule,
	HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//describe what component, service or other that we want to test, preferrably by name
describe('CoursesService', () => {
	let httpTestingController: HttpTestingController; //setup a fake controller to mock the http requests
	let service: CoursesService; //setup the service so that we may have knowledge of functions, variables and more
	const reqUrl = (input: string) =>
		`${environment.apiURL}/topics/${input}/courses`;
	const mockCourses = environment.mockResponse;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CoursesService], //provide what services, components or others you want to test
			imports: [HttpClientTestingModule, HttpClientModule], //import the modules so that we may use them
		});
		httpTestingController = TestBed.inject(HttpTestingController); //inject it by the testbed, otherwise we'd have a null-object reference
		service = TestBed.inject(CoursesService); //inject the service with the testbed, otherwise we'd have a null-object reference
	});

	//verify that no requests has gone unhandled
	afterEach(() => {
		httpTestingController.verify();
	});

	//prepare a test-case
	it('returned Observable should match the right data', (done) => {
		const spy = spyOn(service, 'getCoursesByTopic') //first of all, select what service and what function to spy on
			.and.callThrough(); //unless you specify to just call the function through, it wants to suppose you'd want to override it.
		//This would make it undefined, unless you specify your own return value.
		/*
			this is a way to alter the function so that it would always return a specific answer. 
			const spy = spyOn(service, 'getCoursesByTopic').and.returnValue("example"); //like this.
			const spy = spyOn(service, 'getCoursesByTopic').and.callFake(example => {return example + 1}); //or like this
			Define what mock course we want the response to return
		*/

		mockCourses.forEach((course) => {
			//make a request using the getCoursesByTopic call, this would trigger the http-request normally
			service.getCoursesByTopic(course.topicId).subscribe((response) => {
				const first = response[0];
				//set a few tests to validate, they must match to a 100%, otherwise the error would fail
				expect(first.name).toEqual('Chessable');
				expect(first.description).toEqual(
					'Space repetition to learn chess, backed by science'
				);
			});

			/*
				expect one call to be made to the certain URL that this http-request made by getCoursesByTopic to normally have done
				instead of mocking the function itself, we can mock the http-request it makes itself, in such way not altering the way of the 
				service in any way.
			*/
			const req = httpTestingController.expectOne(
				reqUrl(course.topicId.toString())
			);

			//return a mocked return request with HTTP Information with data
			req.flush(mockCourses);
		});

		expect(spy).toHaveBeenCalled; //call on the spy to see if the function was indeed called during the test
		done();
	});
});
