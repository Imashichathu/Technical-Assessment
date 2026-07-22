import { describe, expect, it } from 'vitest'
import { validateTaskInput } from './task.validator.js'

describe('validateTaskInput', () => {
  const validBody = {
    title: 'Write report',
    priority: 'High',
    status: 'Pending',
    dueDate: '2099-01-01',
  }

  it('passes for a fully valid body', () => {
    expect(validateTaskInput(validBody)).toEqual([])
  })

  it('requires a title', () => {
    const errors = validateTaskInput({ ...validBody, title: '' })
    expect(errors).toContain('Title is required')
  })

  it('requires a non-whitespace title', () => {
    const errors = validateTaskInput({ ...validBody, title: '   ' })
    expect(errors).toContain('Title is required')
  })

  it('rejects a title over 200 characters', () => {
    const errors = validateTaskInput({ ...validBody, title: 'a'.repeat(201) })
    expect(errors).toContain('Title must be 200 characters or fewer')
  })

  it('requires a priority', () => {
    const errors = validateTaskInput({ ...validBody, priority: undefined })
    expect(errors).toContain('Priority is required')
  })

  it('rejects an invalid priority value', () => {
    const errors = validateTaskInput({ ...validBody, priority: 'Urgent' })
    expect(errors).toContain('Priority must be Low, Medium, or High')
  })

  it('rejects an empty status when provided', () => {
    const errors = validateTaskInput({ ...validBody, status: '' })
    expect(errors).toContain('Status is required')
  })

  it('rejects an invalid status value', () => {
    const errors = validateTaskInput({ ...validBody, status: 'Blocked' })
    expect(errors).toContain('Status must be Pending, In Progress, or Completed')
  })

  it('allows status to be omitted (defaulted elsewhere)', () => {
    const { status, ...rest } = validBody
    expect(validateTaskInput(rest)).toEqual([])
  })

  it('requires a due date', () => {
    const errors = validateTaskInput({ ...validBody, dueDate: '' })
    expect(errors).toContain('Due date is required')
  })

  it('rejects an unparsable due date', () => {
    const errors = validateTaskInput({ ...validBody, dueDate: 'not-a-date' })
    expect(errors).toContain('Due date must be a valid date')
  })

  it('does not reject a past due date by default', () => {
    const errors = validateTaskInput({ ...validBody, dueDate: '2020-01-01' })
    expect(errors).toEqual([])
  })

  it('rejects a past due date when enforceFutureDueDate is set', () => {
    const errors = validateTaskInput(
      { ...validBody, dueDate: '2020-01-01' },
      { enforceFutureDueDate: true },
    )
    expect(errors).toContain('Due date cannot be earlier than today')
  })

  it('allows an unchanged past due date on partial update even with enforceFutureDueDate unset', () => {
    const errors = validateTaskInput({ dueDate: '2020-01-01' }, { partial: true })
    expect(errors).toEqual([])
  })

  describe('partial mode', () => {
    it('does not require fields that are omitted', () => {
      expect(validateTaskInput({ status: 'Completed' }, { partial: true })).toEqual([])
    })

    it('still validates fields that are present', () => {
      const errors = validateTaskInput({ title: '' }, { partial: true })
      expect(errors).toContain('Title is required')
    })
  })
})
