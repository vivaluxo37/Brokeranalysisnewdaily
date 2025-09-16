import { render, screen } from '@testing-library/react'
import FeaturedBrokers from '../src/app/components/FeaturedBrokers'
import { Button } from '@/components/ui/button'
import '@testing-library/jest-dom'

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}))

// Mock the utils module
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('FeaturedBrokers', () => {
  test('renders without crashing', () => {
    render(<FeaturedBrokers />)
    expect(screen.getByText('Top Rated Forex Brokers')).toBeInTheDocument()
  })

  test('renders broker cards', () => {
    render(<FeaturedBrokers />)
    expect(screen.getByText('Admirals')).toBeInTheDocument()
    expect(screen.getByText('Pepperstone')).toBeInTheDocument()
    expect(screen.getByText('IC Markets')).toBeInTheDocument()
  })

  test('displays broker ratings', () => {
    render(<FeaturedBrokers />)
    expect(screen.getByText('3.4')).toBeInTheDocument()
    expect(screen.getByText('4.7')).toBeInTheDocument()
  })
})