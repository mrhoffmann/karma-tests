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

	it('-post should be created', () => {
		expect(service).toBeTruthy();
	});

	it('returned Observable should match the right data', () => {
		const mockCourse = mockCourses[0];
		service.addCourse({ topicId: 1 }).subscribe((courseData) => {
			expect(courseData.name).toEqual(mockCourse.name);
		});

		const req = httpTestingController.expectOne(
			`${environment.apiURL}/topics/1/courses`
		);

		expect(req.request.method).toEqual('POST');
		req.flush(mockCourse);
	});

	it('returned Observable should match the right data with another example', () => {
		const mockCourse = mockCourses[1];
		service.addCourse({ topicId: 2 }).subscribe((courseData) => {
			expect(courseData.name).toEqual(mockCourse.name);
		});

		const req = httpTestingController.expectOne(
			`${environment.apiURL}/topics/2/courses`
		);

		expect(req.request.method).toEqual('POST');
		req.flush(mockCourse);
	});
});
