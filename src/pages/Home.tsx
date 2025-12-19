// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Ministry navbar – white, no auth buttons */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/eyedentify-logo.png" alt="EyeDentify" className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">EyeDentify</h1>
              <p className="text-xs text-gray-600">La sécurité en un regard</p>
            </div>
          </div>
          <Link to="/login" className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-dark transition-all duration-200 active:scale-95">
            Accès Opérateur
          </Link>
        </div>
      </header>

      {/* Hero – flag gradient + centred content */}
      <main className="flex-1 grid place-items-center bg-gradient-to-br from-primary/10 via-white to-primary/10">
        <div className="text-center px-6 animate-fade-in">
          <img src="/assets/eyedentify-logo.png" alt="EyeDentify" className="h-24 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">EyeDentify</h2>
          <p className="text-lg text-gray-600 mb-8">La sécurité en un regard</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg text-white bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
            <span>Accès Opérateur</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </main>

      {/* Footer – ministry signature */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-xs">
          République du Sénégal – Plateforme nationale d'identification biométrique
        </div>
      </footer>
    </div>
  );
}