// @flow

import moment from 'moment'

import Participant from './Participant'

const NoParticipantError = new Error('error_no_participant');
const NoExpectationError = new Error('error_no_age_expected');

class InvalidParticipantDateOfBirth extends Error {
    constructor(invalidParticipant) {
        super(`Invalid participant date of birth: ${invalidParticipant}`);
    }
}

/**
 * get the date when participants summed ages will be the expected age
 * @param expectedAge - number
 * @param participants - array of Participant
 * @returns the birthday matching expectedAge
 */
function getDateForAccruedAges(expectedAge: number, ...participants: Participant[]): moment {
    checkExpectedAge(expectedAge);
    checkParticipants(participants);

    const participantsAsIterable = participants[0].length
        ? participants[0] // participants parameter given as an array
        : participants // participants parameter given as an iterable
    ;

    const sortedByNextBirthday = sortByNextBirthday(participantsAsIterable);
    const olderPerson = sortByAge(participantsAsIterable)[0];

    const birthdays = [];
    let year = olderPerson.dateOfBirth.year() + 1;
    while (birthdays.length < expectedAge) {
        for (let p of sortedByNextBirthday) {
            const newBirthday = p.dateOfBirth.clone().year(year);
            if (newBirthday.diff(p.dateOfBirth) >= 1) {
                birthdays.push(newBirthday);
            }
        }
        year++;
    }
    return birthdays[expectedAge - 1];
}

/**
 * sort participants by their next birthday, starting from today
 * @param participants
 * @returns {Array.<Participant>}
 */
function sortByNextBirthday(participants: Participant[]): Participant[] {
    const currentDayOfYear = moment().dayOfYear();
    const sortedByDayOfYear = participants.slice(0)
        .sort((p1, p2) => p1.dateOfBirth.dayOfYear() - p2.dateOfBirth.dayOfYear());

    const nbElementsToShift = participants.filter(p => p.dateOfBirth.dayOfYear() > currentDayOfYear).length
    const first = sortedByDayOfYear.slice(sortedByDayOfYear.length - nbElementsToShift);
    const second = sortedByDayOfYear.slice(0, sortedByDayOfYear.length - nbElementsToShift);
    return first.concat(second);
}

function sortByAge(participants: Participant[]): Participant[] {
    return participants.sort((p1, p2) => p1.dateOfBirth.diff(p2.dateOfBirth));
}

const MILLIS_IN_A_DAY = 24 * 60 * 60 * 1000;

function getDateForAccruedDays(expectedAge: number, ...participants: Participant[]): moment {
    checkExpectedAge(expectedAge);
    checkParticipants(participants);

    const participantsAsIterable = participants[0].length
        ? participants[0] // participants parameter given as an array
        : participants // participants parameter given as an iterable
    ;

    const sortedByAge = sortByAge(participantsAsIterable);

    // get starting day (older participant's date of birth)
    let result = moment(sortedByAge[0].dateOfBirth);

    // add {expectedAge} years, converted in days
    let restingTime = moment(result).add(expectedAge, 'years').diff(result);

    let participantIndex = 0;
    while (restingTime > 0) {
        const currentParticipant = sortedByAge[participantIndex];
        const nextParticipant = sortedByAge[participantIndex + 1] ;
        if (!nextParticipant || participantsDateOfBirthIsBeforeRestOfTime(nextParticipant, currentParticipant.dateOfBirth, restingTime)) {
            return result.add(restingTime / (participantIndex + 1), 'milliseconds').startOf('day');
        } else {
            participantIndex++;
            const diffFromCurrentToNext = moment(nextParticipant.dateOfBirth).diff(currentParticipant.dateOfBirth);
            result = nextParticipant.dateOfBirth;
            restingTime -= diffFromCurrentToNext * (participantIndex);
        }
    }
}

function participantsDateOfBirthIsBeforeRestOfTime(participant, date, restOfTime) {
    return participant.dateOfBirth.isAfter(moment(date).add(restOfTime, 'milliseconds'))
}


function checkExpectedAge(expectedAge): void {
    if (!expectedAge) {
        throw NoExpectationError;
    }
}

function checkParticipants(participants): void {
    if (!participants.length) {
        throw NoParticipantError;
    }

    const participantsAsIterable = participants[0].length
        ? participants[0] // participants parameter given as an array
        : participants // participants parameter given as an iterable
    ;

    participantsAsIterable.forEach(participant => {
        if (!participant.dateOfBirth || !participant.dateOfBirth.isValid()) {
            throw new InvalidParticipantDateOfBirth(participant);
        }
    })
}

export {
    getDateForAccruedAges,
    getDateForAccruedDays,
    NoParticipantError,
    NoExpectationError,
    InvalidParticipantDateOfBirth,
};
