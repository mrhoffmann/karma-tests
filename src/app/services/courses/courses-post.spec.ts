import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import {
	HttpClientTestingModule,
	HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('CoursesService', () => {
	let httpTestingController: HttpTestingController;
	let service: CoursesService;
	const mockCourses = environment.mockResponse;
	const reqUrl = (input: string) =>
		`${environment.apiURL}/topics/${input}/courses`;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CoursesService],
			imports: [HttpClientTestingModule],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		service = TestBed.inject(CoursesService);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should have a list of objects we can use later on', (done) => {
		mockCourses.forEach((course) => {
			expect(course.description.length).toBeGreaterThan(0);
			expect(course.topicId.toString().length).toBeGreaterThan(0);
			expect(course.name.length).toBeGreaterThan(0);
		});
		done();
	});

	//build a case to test all of our courses
	it('returned Observable should match the right data', (done) => {
		mockCourses.forEach((course) => {
			service.addCourse(course).subscribe((response) => {
				expect(response.name).toEqual(course.name);
				expect(response.description).toEqual(course.description);
				expect(response.topicId).toEqual(course.topicId);
			});

			//fake the response by capturing it, requiring the actual URL it SHOULD send to
			const req = httpTestingController.expectOne(
				reqUrl(course.topicId.toString()) // <- this is which URL
			);

			//just make an expectation that it should be a POST, since we're testing the POST-part of Courses.
			expect(req.request.method).toEqual('POST');
			req.flush(course); //flush the response, forcing it to respond with what we actually want
		});
		done();
	});
});
