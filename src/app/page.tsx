"use client";

import Link from "next/link";

/** Landing page — hero section, features, and footer */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">AlmaAssist</span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            AlmaAssist
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-blue-600 font-medium">
            Answer vendor questionnaires in minutes, not hours.
          </p>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your vendor assessment questionnaire and internal
            documentation. Our AI reads your docs and generates accurate,
            citation-grounded answers — ready for review and export.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="AI-Powered Answers"
              description="Gemini reads your docs and answers instantly. Upload any questionnaire and reference documents — our AI generates accurate responses grounded in your content."
            />
            <FeatureCard
              icon="📎"
              title="Citation Grounded"
              description="Every answer is backed by reference documents. See exactly which document was used, with confidence scores and evidence snippets for full transparency."
            />
            <FeatureCard
              icon="📄"
              title="Export Ready"
              description="Download a clean, answered questionnaire instantly as a PDF. Review and edit answers before exporting — your completed assessment in minutes."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Built by{" "}
            <span className="font-semibold text-gray-700">EduVault</span> —
            Secure Student Data Management
          </p>
          <p className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} EduVault. Internal tool.
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Reusable feature card component */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
