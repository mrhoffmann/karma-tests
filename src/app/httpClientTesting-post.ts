import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  addCourse(course: any): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8089/topics/${course.topicId}/courses`,
      course
    );
  }
}
