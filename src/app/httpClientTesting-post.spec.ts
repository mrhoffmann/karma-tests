import { TestBed } from '@angular/core/testing';
import { CoursesService } from './services/courses.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('CoursesService', () => {
  let httpTestingController: HttpTestingController;
  let service: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesService],
      imports: [HttpClientTestingModule]
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
    const mockCourse = {
      name: 'Chessable',
      description: 'Space repetition to learn chess, backed by science'
    };

    service.addCourse({ topicId: 1 }).subscribe((courseData) => {
      expect(courseData.name).toEqual('Chessable');
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8089/topics/1/courses'
    );

    expect(req.request.method).toEqual('POST');

    req.flush(mockCourse);
  });
});
