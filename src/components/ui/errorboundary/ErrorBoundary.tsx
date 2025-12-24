// src/ui/error/ErrorBoundary.tsx
import React from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 font-bold">Something went wrong while loading the component.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
