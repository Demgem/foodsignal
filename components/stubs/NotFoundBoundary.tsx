"use client";

import { Component, type ReactNode } from "react";

/**
 * NotFoundBoundary (Requirement 18.5)
 *
 * A minimal React error boundary used to wrap the rich Not_Found_Layout. If the
 * layout itself throws while rendering, the boundary catches the error and
 * renders a minimal, accessible fallback message with a plain anchor back to
 * the homepage — so the user is never left on a blank screen.
 *
 * The fallback deliberately uses a native `<a>` (not `next/link`) and no design
 * components, so it can render even if a component in the layout is the source
 * of the failure.
 */
interface NotFoundBoundaryProps {
  children: ReactNode;
}

interface NotFoundBoundaryState {
  hasError: boolean;
}

export class NotFoundBoundary extends Component<
  NotFoundBoundaryProps,
  NotFoundBoundaryState
> {
  constructor(props: NotFoundBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): NotFoundBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            maxWidth: "32rem",
            margin: "0 auto",
            padding: "2rem 1rem",
          }}
        >
          <h1>Page not found</h1>
          <p>We could not find the page you were looking for.</p>
          <p>
            <a href="/">Return to the homepage</a>
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}

export default NotFoundBoundary;
