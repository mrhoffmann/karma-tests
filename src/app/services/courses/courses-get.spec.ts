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

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CoursesService], //provide what services, components or others you want to test
			imports: [HttpClientTestingModule, HttpClientModule], //import the modules so that we may use them
		});
		httpTestingController = TestBed.inject(HttpTestingController); //inject it by the testbed, otherwise we'd have a null-object reference
		service = TestBed.inject(CoursesService); //inject the service with the testbed, otherwise we'd have a null-object reference
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	//prepare a test-case
	it('returned Observable should match the right data', () => {
		const spy = spyOn(service, 'getCoursesByTopic') //first of all, select what service and what function to spy on
			.and.callThrough(); //unless you specify to just call the function through, it wants to suppose you'd want to override it.
		//This would make it undefined, unless you specify your own return value.

		/*
			this is a way to alter the function so that it would always return a specific answer. 
			const spy = spyOn(service, 'getCoursesByTopic').and.returnValue("example"); //like this.
			const spy = spyOn(service, 'getCoursesByTopic').and.callFake(example => {return example + 1}); //or like this
			Define what mock course we want the response to return
		*/
		const mockCourses = environment.mockResponse;

		//make a request using the getCoursesByTopic call, this would trigger the http-request normally
		service.getCoursesByTopic(1).subscribe((coursesData) => {
			//set a few tests to validate, they must match to a 100%, otherwise the error would fail
			expect(coursesData[0].name).toEqual('Chessable');
			expect(coursesData[0].description).toEqual(
				'Space repetition to learn chess, backed by science'
			);
			expect(coursesData[1].name).toEqual('ICC');
			expect(coursesData[1].description).toEqual('Play chess online');
			//or we could simply validate the whole response
			expect(coursesData).toEqual(mockCourses);
		});

		/*
			expect one call to be made to the certain URL that this http-request made by getCoursesByTopic to normally have done
			instead of mocking the function itself, we can mock the http-request it makes itself, in such way not altering the way of the 
			service in any way.
		*/
		const req = httpTestingController.expectOne(
			//if we'd expect more than ONE (1) request
			`${environment.apiURL}/topics/1/courses`
		);

		//return a mocked return request with HTTP Information with data
		req.flush(mockCourses);
		expect(spy).toHaveBeenCalledTimes(1); //call on the spy to see if the function was indeed called during the test
	});
});
