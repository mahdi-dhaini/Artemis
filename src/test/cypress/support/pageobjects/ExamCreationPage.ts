import { TIME_FORMAT } from './../constants';
import dayjs from 'dayjs';

/**
 * A class which encapsulates UI selectors and actions for the exam creation page.
 */
export class ExamCreationPage {
    /**
     * @returns the element of the course title.
     */
    getCourseTitle() {
        return cy.get('#course');
    }

    /**
     * Sets the title of the exam.
     * @param title the exam title
     */
    setTitle(title: string) {
        cy.get('#title').type(title);
    }

    /**
     * Sets the date from when the exam should be visible.
     * @param date the date
     */
    setVisibleDate(date: dayjs.Dayjs) {
        this.enterDate('#visibleDate', date);
    }

    /**
     * Sets the date when the exam starts.
     * @param date the date
     */
    setStartDate(date: dayjs.Dayjs) {
        this.enterDate('#startDate', date);
    }

    /**
     * Sets the date when the exam will end.
     * @param date the date
     */
    setEndDate(date: dayjs.Dayjs) {
        this.enterDate('#endDate', date);
    }

    /**
     * Sets the number of exercises in the exam.
     * @param amount the amount of exercises
     */
    setNumberOfExercises(amount: number) {
        cy.get('#numberOfExercisesInExam').clear().type(amount.toString());
    }

    /**
     * Sets the maximum achievable points in the exam.
     * @param maxPoints the max points
     */
    setMaxPoints(maxPoints: number) {
        cy.get('#maxPoints').clear().type(maxPoints.toString());
    }

    /**
     * Sets the start text of the exam.
     * @param text the start text
     */
    setStartText(text: string) {
        this.enterText('#startText', text);
    }

    /**
     * Sets the end text of the exam.
     * @param text the end text
     */
    setEndText(text: string) {
        this.enterText('#endText', text);
    }

    /**
     * Sets the confirmation start text of the exam.
     * @param text the confirmation start text
     */
    setConfirmationStartText(text: string) {
        this.enterText('#confirmationStartText', text);
    }

    /**
     * Sets the confirmation end text of the exam.
     * @param text the confirmation end text
     */
    setConfirmationEndText(text: string) {
        this.enterText('#confirmationEndText', text);
    }

    /**
     * Submits the created exam.
     * @returns the query chainable if a test needs to access the response
     */
    submit() {
        cy.intercept('POST', '/api/courses/*/exams').as('examCreationQuery');
        cy.get('button[type="submit"]').click();
        return cy.wait('@examCreationQuery');
    }

    private enterText(selector: string, text: string) {
        cy.get(selector).find('.ace_content').type(text);
    }

    private enterDate(selector: string, date: dayjs.Dayjs) {
        cy.get(selector).find('input').clear().type(date.format(TIME_FORMAT), { force: true });
    }
}
