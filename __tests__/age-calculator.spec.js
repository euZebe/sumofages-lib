'use strict'
import moment from 'moment'
import {
    getDateForAccruedAges,
    getDateForAccruedDays,
    InvalidParticipantDateOfBirth,
    NoExpectationError,
    NoParticipantError,
    Participant,
} from '../src'

const now = moment();

describe('Calculator from ages function', () => {
    it('should throw an error if no expectation', () => {
        expect(() => getDateForAccruedAges(null)).toThrow(NoExpectationError);
    })

    it('should throw an error if no participant', () => {
        expect(() => getDateForAccruedAges(25)).toThrow(NoParticipantError);
    })

    it('should throw an error if a participant has no birth date', () => {
        const participant = new Participant();
        participant.dateOfBirth = '';
        expect(() => getDateForAccruedAges(20, participant)).toThrow(new InvalidParticipantDateOfBirth(participant));
    })

    it('should return X years later when today is the only participant\'s birthday and expected is +X', () => {
        const _36YearsAgo = moment().add(-36, 'years').startOf('day');
        const _36YearOldParticipant = new Participant(_36YearsAgo);
        const EXPECTED_AGE = 40;
        const nextBirthday = moment(_36YearOldParticipant.dateOfBirth).add(EXPECTED_AGE, 'years');
        expect(getDateForAccruedAges(EXPECTED_AGE, _36YearOldParticipant)).toEqual(nextBirthday);
    })

    it('should return the date of the next birthday when expecting the age after', () => {
        const _3YearsAnd8MonthsAgo = moment().year(now.year() - 3).month(now.month() - 8);
        const _3YearOldParticipant = new Participant(_3YearsAnd8MonthsAgo);
        const twoBirthdaysLater = moment(_3YearOldParticipant.dateOfBirth).add(5, 'years');
        expect(getDateForAccruedAges(5, _3YearOldParticipant)).toEqual(twoBirthdaysLater);
    })

    it('should return the date of the previous birthday when expecting the current age', () => {
        const _3YearsAnd8MonthsAgo = moment().year(now.year() - 3).month(now.month() - 10);
        const _3YearOldParticipant = new Participant(_3YearsAnd8MonthsAgo);
        const previousBirthday = moment(_3YearOldParticipant.dateOfBirth).add(2, 'years');
        expect(getDateForAccruedAges(2, _3YearOldParticipant).startOf('day')).toEqual(previousBirthday);
    })

    it('should return next birthday when two participants and expected is sum + 1', () => {
        const _36YearsAgo = moment().add(-36, 'years').startOf('day');
        const _36YearOldParticipant = new Participant(_36YearsAgo);
        const _3YearsAnd8MonthsAgo = moment().year(now.year() - 3).month(now.month() - 8);
        const _3YearOldParticipant = new Participant(_3YearsAnd8MonthsAgo);

        const nextBirthdayOf3YearOldParticipant = moment(_3YearOldParticipant.dateOfBirth).add(4, 'years');

        expect(getDateForAccruedAges(40, _36YearOldParticipant, _3YearOldParticipant))
            .toEqual(nextBirthdayOf3YearOldParticipant);
    })

    it('should return julie\'s birthay', () => {
        const julie = new Participant(moment([1981, 4, 15]), 'Julie');
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');
        const niobe = new Participant(moment([2014, 2, 12]), 'Niobé');
        const ernest = new Participant(moment([2015, 6, 12]), 'Ernest');
        const titouan = new Participant(moment([2017, 0, 1]), 'Titouan');

        const result = getDateForAccruedAges(80, julie, euZebe, niobe, ernest, titouan);
        expect(result.isSame(moment([2018, 4, 15]))).toBeTruthy();
    })

    it('quand on aura 20 ans en l\'an 2001', () => {
        const julie = new Participant(moment([1981, 4, 15]), 'Julie');
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');

        expect(getDateForAccruedAges(40, julie, euZebe).isSame(moment([2001, 9, 22]))).toBeTruthy();
    })

    it('allow also array of participants', () => {
        const julie = new Participant(moment([1981, 4, 15]), 'Julie');
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');

        expect(getDateForAccruedAges(40, [julie, euZebe]).isSame(moment([2001, 9, 22]))).toBeTruthy();
    })
});


describe('Calculator from days function', () => {
    it('should throw an error if no expectation', () => {
        expect(() => getDateForAccruedDays(null)).toThrow(NoExpectationError);
    })

    it('should throw an error if no participant', () => {
        expect(() => getDateForAccruedDays(25)).toThrow(NoParticipantError);
    })

    it('should throw an error if a participant has no birth date', () => {
        const participant = new Participant();
        participant.dateOfBirth = '';
        expect(() => getDateForAccruedDays(20, participant)).toThrow(new InvalidParticipantDateOfBirth(participant));
    })

    it('should return the date of birth + x years if only one participant', () => {
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');
        expect(getDateForAccruedDays(20, euZebe).isSame(moment([2001, 9, 22]))).toBeTruthy()
    })

    it('should return the date of birth + x years if only one participant', () => {
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');
        const julia = new Participant(moment([1983, 9, 22]), 'Julia');
        expect(getDateForAccruedDays(1, euZebe, julia).isSame(moment([1982, 9, 22]))).toBeTruthy();
    })

    it('should process if several participants and expected age go further than the 2nd date of birth', () => {
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');
        const julia = new Participant(moment([1982, 9, 20]), 'Julia');
        expect(getDateForAccruedDays(3, euZebe, julia).isSame(moment([1983, 9, 21]))).toBeTruthy();
    })

    it('should process the same for x participants', () => {
        const euZebe = new Participant(moment([1981, 9, 22]), 'euZèbe');
        const julia = new Participant(moment([1982, 9, 22]), 'Julia');
        const gabriel = new Participant(moment([1984, 9, 22]), 'Gabriel');
        const result = getDateForAccruedDays(8, euZebe, julia, gabriel);
        expect(result.isSame(moment([1985, 9, 22]))).toBeTruthy();
        expect(euZebe.dateOfBirth.isSame(moment([1981, 9, 22]))).toBeTruthy();
        expect(julia.dateOfBirth.isSame(moment([1982, 9, 22]))).toBeTruthy();
        expect(gabriel.dateOfBirth.isSame(moment([1984, 9, 22]))).toBeTruthy();
    })
})