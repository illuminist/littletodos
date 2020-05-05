import * as React from 'react'

export interface IErrorBoundaryProps {
  fallback?: React.ReactNode | React.ComponentType<{ error: Error }>
  onError?: (error: Error, errorInfo: any) => void
}

class ErrorBoundary extends React.PureComponent<
  IErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError && this.props.onError(error, errorInfo)
  }

  render() {
    const { fallback = null } = this.props

    if (this.state.hasError) {
      if (
        typeof fallback === 'function' ||
        fallback instanceof React.Component
      ) {
        const FallbackComponent = fallback as React.ComponentType<any>
        return <FallbackComponent error={this.state.error} />
      }
      return fallback
    }

    return this.props.children
  }
}

export default ErrorBoundary
