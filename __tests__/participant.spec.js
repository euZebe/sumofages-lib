// @flow

import moment from 'moment';
import { Participant } from '../src';

describe('Participant class', () => {
  it('should init ID, name and dateOfBirth with default values', () => {
    const participant = new Participant();
    expect(participant.id).not.toBe(null);
    expect(participant.name).not.toBe(null);
    expect(participant.dateOfBirth).not.toBe(null);
  });

  it('should calculate the age', () => {
    const moment3yearsAnd2MonthsAgo = moment().add(-3, 'years').add(-2, 'months');
    const participant = new Participant(moment3yearsAnd2MonthsAgo);
    expect(participant.age).toEqual(3);
  });
});
