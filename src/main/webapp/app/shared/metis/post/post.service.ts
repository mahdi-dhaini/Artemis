import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from 'app/app.constants';
import { Post } from 'app/entities/metis/post.model';
import { PostingsService } from 'app/shared/metis/postings.service';

type EntityResponseType = HttpResponse<Post>;
type EntityArrayResponseType = HttpResponse<Post[]>;

@Injectable({ providedIn: 'root' })
export class PostService extends PostingsService<Post> {
    public resourceUrl = SERVER_API_URL + 'api/courses/';

    constructor(protected http: HttpClient) {
        super();
    }

    /**
     * creates a post
     * @param {number} courseId
     * @param {Post} post
     * @return {Observable<EntityResponseType>}
     */
    create(courseId: number, post: Post): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(post);
        // as we need course information at server side, we need to make sure that the course id is set
        if (post.lecture && post.lecture.course === undefined) {
            post.lecture.course = { id: courseId };
        }
        if (post.exercise && post.exercise.course === undefined) {
            post.exercise.course = { id: courseId };
        }
        return this.http.post<Post>(`${this.resourceUrl}${courseId}/posts`, copy, { observe: 'response' }).pipe(map(this.convertDateFromServer));
    }

    /**
     * updates a post
     * @param {number} courseId
     * @param {Post} post
     * @return {Observable<EntityResponseType>}
     */
    update(courseId: number, post: Post): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(post);
        return this.http.put<Post>(`${this.resourceUrl}${courseId}/posts`, copy, { observe: 'response' }).pipe(map(this.convertDateFromServer));
    }

    /**
     * updates the votes of a post
     * @param {number} courseId
     * @param {number} postId
     * @param {number} voteChange
     * @return {Observable<EntityResponseType>}
     */
    updateVotes(courseId: number, postId: number, voteChange: number): Observable<EntityResponseType> {
        return this.http.put(`${this.resourceUrl}${courseId}/posts/${postId}/votes`, voteChange, { observe: 'response' }).pipe(map(this.convertDateFromServer));
    }

    /**
     * gets all posts for course by its id
     * @param {number} courseId
     * @return {Observable<EntityArrayResponseType>}
     */
    getAllPostsByCourseId(courseId: number): Observable<EntityArrayResponseType> {
        return this.http.get<Post[]>(`api/courses/${courseId}/posts`, { observe: 'response' }).pipe(map(this.convertDateArrayFromServer));
    }

    /**
     * gets all posts for a lecture in a certain course by its id
     * @param {number} courseId
     * @param {number} lectureId
     * @return {Observable<EntityArrayResponseType>}
     */
    getAllPostsByLectureId(courseId: number, lectureId: number): Observable<EntityArrayResponseType> {
        return this.http.get<Post[]>(`api/courses/${courseId}/lectures/${lectureId}/posts`, { observe: 'response' }).pipe(map(this.convertDateArrayFromServer));
    }

    /**
     * gets all posts for an exercise in a certain course by its id
     * @param {number} courseId
     * @param {number} exerciserId
     * @return {Observable<EntityArrayResponseType>}
     */
    getAllPostsByExerciseId(courseId: number, exerciserId: number): Observable<EntityArrayResponseType> {
        return this.http.get<Post[]>(`api/courses/${courseId}/exercises/${exerciserId}/posts`, { observe: 'response' }).pipe(map(this.convertDateArrayFromServer));
    }

    /**
     * deletes a post
     * @param {number} courseId
     * @param {Post} post
     * @return {Observable<HttpResponse<any>>}
     */
    delete(courseId: number, post: Post): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}${courseId}/posts/${post.id}`, { observe: 'response' });
    }

    /**
     * gets all tags for course
     * @param {number} courseId
     * @return {Observable<string[]>}
     */
    getAllPostTagsByCourseId(courseId: number): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`api/courses/${courseId}/posts/tags`, { observe: 'response' });
    }
}
