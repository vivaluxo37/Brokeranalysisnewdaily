import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify Jest configuration
describe('Example Test', () => {
  test('should pass', () => {
    expect(1 + 1).toBe(2)
  })

  test('should render text correctly', () => {
    render(<div>Test Text</div>)
    expect(screen.getByText('Test Text')).toBeInTheDocument()
  })
})