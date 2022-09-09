import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from 'src/app/models/courses.model';

@Injectable({
	providedIn: 'root',
})
export class CoursesService {
	constructor(private http: HttpClient) {}

	addCourse(course: Course): Observable<Course> {
		return this.http.post<Course>(
			`${environment.apiURL}/topics/${course.topicId}/courses`,
			course
		);
	}

	getCoursesByTopic(topicId: number): Observable<Course[]> {
		return this.http.get<Course[]>(
			`${environment.apiURL}/topics/${topicId}/courses`
		);
	}
}
