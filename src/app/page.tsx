"use client";

import Link from "next/link";

/** Landing page — modern hero, app mockup, features, workflow, and footer */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Alma<span className="text-blue-600">Assist</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-50 via-indigo-50/50 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />
          <div className="absolute top-40 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                Powered by Gemini 2.0 Flash AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Answer vendor questionnaires{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                in minutes, not hours
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Upload your questionnaire and reference docs. AI reads everything
              and generates accurate, citation-grounded answers — ready for
              review and one-click PDF export.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/25 text-center"
              >
                Start for Free →
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto text-gray-700 border border-gray-200 bg-white px-8 py-3.5 rounded-full text-base font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                Login
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Up to 20 questions
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                8 reference docs
              </span>
            </div>
          </div>

          {/* App Mockup Preview */}
          <div className="mt-20 max-w-5xl mx-auto">
            <AppMockup />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="< 2 min" label="Average response time" />
          <StatItem value="20" label="Questions per questionnaire" />
          <StatItem value="8" label="Reference docs supported" />
          <StatItem value="PDF" label="One-click export" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to automate assessments
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              From upload to export, AlmaAssist handles the heavy lifting so
              your team can focus on what matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<IconBrain />}
              title="AI-Powered Answers"
              description="Gemini 2.0 Flash reads your reference documents and generates precise answers grounded in your actual content."
              color="blue"
            />
            <FeatureCard
              icon={<IconCitation />}
              title="Citation Grounded"
              description="Every answer includes the source document, confidence score, and an evidence snippet for complete transparency."
              color="indigo"
            />
            <FeatureCard
              icon={<IconExport />}
              title="PDF Export"
              description="Download your completed questionnaire as a professionally formatted PDF with one click."
              color="purple"
            />
            <FeatureCard
              icon={<IconEdit />}
              title="Inline Editing"
              description="Review and refine any AI-generated answer before exporting. Your edits are saved instantly."
              color="amber"
            />
            <FeatureCard
              icon={<IconRefresh />}
              title="Partial Regeneration"
              description="Select specific questions to regenerate without re-processing the entire questionnaire."
              color="emerald"
            />
            <FeatureCard
              icon={<IconChart />}
              title="Coverage Summary"
              description="At-a-glance stats showing how many questions were answered, with confidence breakdowns."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              How it works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Three simple steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Upload Documents"
              description="Upload your vendor questionnaire PDF and up to 8 reference documents (security policies, compliance docs, SLAs, etc.)"
            />
            <StepCard
              step={2}
              title="Generate Answers"
              description="Click 'Generate' and watch AI analyze your documents to produce accurate, citation-backed answers for every question."
            />
            <StepCard
              step={3}
              title="Review & Export"
              description="Check confidence scores, view evidence, edit any answers inline, then export the completed questionnaire as a PDF."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to automate your questionnaires?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                Stop spending hours on repetitive vendor assessments. Let AI do
                the heavy lifting.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center bg-white text-blue-700 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-blue-50 transition-all hover:shadow-xl"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                AlmaAssist
              </span>
              <span className="text-sm text-gray-400 ml-1">by EduVault</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://www.linkedin.com/in/joel-joseph-philip/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/JoelJosephPhilip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EduVault — Secure Student Data
              Management
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ————————————————————— Animated 3D App Mockup ————————————————————— */

/**
 * 3D perspective mockup that auto-cycles through 3 scenes:
 * Scene 1: Upload (drag PDFs)
 * Scene 2: AI Processing (progress bar + typing)
 * Scene 3: Review (answered question cards)
 * Each scene plays for 4s in a 12s loop.
 */
function AppMockup() {
  return (
    <div className="relative" style={{ perspective: "2000px" }}>
      {/* Animated glow behind the mockup */}
      <div className="absolute -inset-6 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-3xl blur-3xl animate-mockup-glow" />

      {/* Floating 3D container */}
      <div className="relative animate-mockup-float" style={{ transformStyle: "preserve-3d" }}>
        {/* Reflection/shadow underneath */}
        <div className="absolute -bottom-8 left-8 right-8 h-16 bg-gradient-to-b from-gray-900/5 to-transparent rounded-full blur-xl" />

        {/* Browser window */}
        <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/15 border border-gray-200/80 overflow-hidden">
          {/* Browser title bar */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 text-xs text-gray-400 w-48 sm:w-80 text-center shadow-sm truncate">
                <span className="text-gray-300 mr-1">🔒</span>
                almaassist.eduvault.io/dashboard
              </div>
            </div>
            <div className="w-12" />
          </div>

          {/* App header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-[10px]">A</span>
              </div>
              <span className="text-sm font-bold text-gray-900">AlmaAssist</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">admin@eduvault.io</span>
              <span className="text-xs text-gray-400 hover:text-gray-600">Logout</span>
            </div>
          </div>

          {/* App content — scenes stacked */}
          <div className="relative bg-gray-50 overflow-hidden hidden sm:block" style={{ minHeight: "340px" }}>

            {/* ——— Scene 1: Upload ——— */}
            <div className="absolute inset-0 p-6 animate-scene1">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">New Questionnaire</h3>
                <p className="text-xs text-gray-400 mt-0.5">Upload your documents to get started</p>
              </div>

              {/* Upload zone */}
              <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-8 text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Drop your questionnaire PDF here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
              </div>

              {/* Uploaded file chips */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-red-500">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">vendor-security-questionnaire.pdf</p>
                    <p className="text-[10px] text-gray-400">Questionnaire • 2.4 MB</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Uploaded</span>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-500">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">eduvault-security-policy-v3.pdf</p>
                    <p className="text-[10px] text-gray-400">Reference • 1.8 MB</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Uploaded</span>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg border border-blue-200 px-4 py-2.5 border-dashed">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-300">+</span>
                  </div>
                  <p className="text-xs text-gray-400">Add more reference documents (up to 8)</p>
                </div>
              </div>
            </div>

            {/* ——— Scene 2: AI Processing ——— */}
            <div className="absolute inset-0 p-6 animate-scene2">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  University of Michigan — Security Assessment 2026
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">12 questions extracted</p>
              </div>

              {/* Processing card */}
              <div className="bg-white rounded-xl border border-blue-200 p-6 mb-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gemini AI is analyzing your documents...</p>
                    <p className="text-xs text-gray-400 mt-0.5">Reading 3 reference documents • Generating answers</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-progress-fill" />
                </div>
                <p className="text-[10px] text-gray-400">Processing question 8 of 12...</p>
              </div>

              {/* Typing simulation */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-900">
                    <span className="text-gray-400 mr-1">Q8.</span>
                    How do you handle data backup and disaster recovery?
                  </p>
                </div>
                <div className="ml-5.5 pl-1.5">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    EduVault performs daily automated backups with AES-256 encryption.
                    Backups are replicated across two geographically separate regions
                    <span className="inline-block w-0.5 h-3.5 bg-blue-500 ml-0.5 -mb-0.5 animate-typing" />
                  </p>
                </div>
              </div>
            </div>

            {/* ——— Scene 3: Review ——— */}
            <div className="absolute inset-0 p-6 animate-scene3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    University of Michigan — Security Assessment 2026
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">12 questions • Completed</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                    Generate Answers
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                    Export PDF
                  </div>
                </div>
              </div>

              {/* Coverage bar */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
                <span className="font-medium text-gray-900">Coverage:</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Total: <b>12</b>
                </span>
                <span className="flex items-center gap-1 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Answered: <b>11</b>
                </span>
                <span className="flex items-center gap-1 text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Not Found: <b>1</b>
                </span>
              </div>

              {/* Animated question cards that fade in */}
              <div className="space-y-3">
                <div className="animate-fade-card">
                  <MockQuestionCard
                    num={1}
                    question="Does your organization encrypt data at rest and in transit?"
                    answer="Yes. EduVault encrypts all data at rest using AES-256 and in transit using TLS 1.3. Database backups are also encrypted."
                    confidence="high"
                    citation="Security Policy v3.2"
                    selected={false}
                  />
                </div>
                <div className="animate-fade-card-2">
                  <MockQuestionCard
                    num={2}
                    question="Describe your incident response procedures."
                    answer="EduVault follows a 4-phase incident response plan: Identification, Containment, Eradication, Recovery. The team is alerted within 15 minutes..."
                    confidence="medium"
                    citation="Security Policy v3.2"
                    selected={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step indicators at bottom */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 hidden sm:flex items-center justify-center gap-8">
            <StepIndicatorDot label="Upload" sceneClass="animate-scene1" />
            <StepIndicatorDot label="Generate" sceneClass="animate-scene2" />
            <StepIndicatorDot label="Review" sceneClass="animate-scene3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dot indicator at the bottom of the mockup showing which scene is active */
function StepIndicatorDot({ label, sceneClass }: { label: string; sceneClass: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-2 h-2 rounded-full bg-gray-200`}>
        <div className={`absolute inset-0 rounded-full bg-blue-600 ${sceneClass}`} />
      </div>
      <span className="text-[10px] font-medium text-gray-400">{label}</span>
    </div>
  );
}

/** Simulated question card inside the mockup */
function MockQuestionCard({
  num,
  question,
  answer,
  confidence,
  citation,
  selected,
}: {
  num: number;
  question: string;
  answer: string;
  confidence: "high" | "medium" | "low";
  citation: string;
  selected: boolean;
}) {
  const confColor =
    confidence === "high"
      ? "bg-green-100 text-green-700"
      : confidence === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className={`bg-white rounded-lg border p-4 ${
        selected
          ? "border-amber-400 ring-2 ring-amber-100"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2">
          <div
            className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 ${
              selected
                ? "bg-amber-500 border-amber-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {selected && (
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-xs font-medium text-gray-900">
            <span className="text-gray-400 mr-1">Q{num}.</span>
            {question}
          </p>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${confColor}`}>
          {confidence}
        </span>
      </div>
      <p className="text-xs text-gray-600 ml-5.5 leading-relaxed pl-1.5">
        {answer}
      </p>
      <div className="flex items-center gap-3 mt-2 pl-5.5 ml-1.5">
        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
          📎 {citation}
        </span>
        <span className="text-[10px] text-blue-600 font-medium cursor-default">
          Edit
        </span>
        <span className="text-[10px] text-gray-400 font-medium cursor-default">
          Show source
        </span>
      </div>
    </div>
  );
}

/* ————————————————————— Feature Card ————————————————————— */

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "group-hover:border-blue-200" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "group-hover:border-indigo-200" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "group-hover:border-purple-200" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "group-hover:border-amber-200" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "group-hover:border-emerald-200" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", border: "group-hover:border-rose-200" },
};

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 ${c.border}`}>
      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <div className={c.icon}>{icon}</div>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ————————————————————— Step Card ————————————————————— */

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ————————————————————— Stat Item ————————————————————— */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

/* ————————————————————— SVG Icon Components ————————————————————— */

function IconBrain() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function IconCitation() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.182-3.182" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}
