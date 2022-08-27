import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CoursesService {
	constructor(private http: HttpClient) {}

	addCourse(course: any): Observable<any> {
		return this.http.post<any>(
			`${environment.apiURL}/topics/${course.topicId}/courses`,
			course
		);
	}
}
