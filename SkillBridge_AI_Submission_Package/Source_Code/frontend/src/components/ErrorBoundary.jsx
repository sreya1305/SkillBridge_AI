import React from 'react'
import PageNav from './PageNav'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
          <div className="wrap py-16">
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#0e1a34] p-10 shadow-xl text-center space-y-6">
              <PageNav backHref="/" backLabel="Back to Home" />
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 text-2xl border border-red-500/20">
                ⚠️
              </div>
              <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
              <p className="text-sm text-slate-300">An unexpected error occurred while displaying this page. Don't worry, your data is safe.</p>
              {this.state.error?.message && (
                <p className="text-xs font-mono bg-black/40 p-3 rounded-xl text-red-300 max-w-lg mx-auto overflow-auto">
                  {this.state.error.message}
                </p>
              )}
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null })
                    window.location.href = '/'
                  }}
                  className="rounded-full bg-mint px-6 py-3 text-sm font-bold text-ink hover:bg-mint/90 transition-all shadow-glow"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
