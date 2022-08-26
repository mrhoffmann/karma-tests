import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('#getCoursesByTopic', () => {
  let httpTestingController: HttpTestingController;
  let service: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesService],
      imports: [HttpClientTestingModule, HttpClientModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CoursesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('returned Observable should match the right data', () => {
    //The fake request we want to return
    const mockCourses = environment.mockResponse;

    //make a request using the getCoursesByTopic call
    service.getCoursesByTopic(1).subscribe((coursesData) => {
      expect(coursesData[0].name).toEqual('Chessable');
      expect(coursesData[0].description).toEqual(
        'Space repetition to learn chess, backed by science'
      );

      expect(coursesData[1].name).toEqual('ICC');
      expect(coursesData[1].description).toEqual('Play chess online');
    });

    //expect one call to be made
    const req = httpTestingController.expectOne(
      'http://localhost:8089/topics/1/courses'
    );
    //return the request with HTTP Information and the request
    req.flush(mockCourses);
  });
});
