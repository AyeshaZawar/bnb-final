
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedCompanies } from './components/TrustedCompanies';
import { Services } from './components/Services';
import { Vacancies } from './components/Vacancies';
import { ResumeSection } from './components/ResumeSection';
import { JourneyTimeline } from './components/JourneyTimeline';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { BlogCards } from './components/BlogCards';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { ServiceDetailsPage } from './components/ServiceDetailsPage';
import { CareerPage } from './components/CareerPage';
import { BlogPage } from './components/BlogPage';
import { CEOPage } from './components/CEOPage';
import { OurImpactPage } from './components/OurImpactPage';
import { JobDetailPage } from './components/JobDetailPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { Chatbot } from './components/Chatbot';
import { ConsentPopup } from './components/ConsentPopup';
import { PrivacyTermsPage } from './components/PrivacyTermsPage';
import { getAdminPanelRoute } from './services/api';

interface RouteState {
  page: string;
  adminSubRoute: 'setup' | 'login' | 'dashboard' | 'default';
  isInvalidAdmin: boolean;
}

function parseCurrentRoute(): RouteState {
  const adminRoute = getAdminPanelRoute(); // e.g. "management-portal"
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');

  const rawRoute = path || hash;

  // 1. Check if accessing the configured admin panel route
  if (rawRoute === adminRoute || rawRoute.startsWith(`${adminRoute}/`)) {
    const sub = rawRoute.replace(adminRoute, '').replace(/^\/+/, '');
    if (sub === 'setup') return { page: 'admin', adminSubRoute: 'setup', isInvalidAdmin: false };
    if (sub === 'login') return { page: 'admin', adminSubRoute: 'login', isInvalidAdmin: false };
    if (sub === 'dashboard' || sub.startsWith('dashboard/')) return { page: 'admin', adminSubRoute: 'dashboard', isInvalidAdmin: false };
    return { page: 'admin', adminSubRoute: 'default', isInvalidAdmin: false };
  }

  // 2. If visiting invalid admin route like /admin or #admin when ADMIN_PANEL_ROUTE is different
  if (adminRoute !== 'admin' && (rawRoute === 'admin' || rawRoute.startsWith('admin/'))) {
    return { page: 'home', adminSubRoute: 'default', isInvalidAdmin: true };
  }

  // 3. Public standalone routes
  if (rawRoute.startsWith('job-')) return { page: 'job-detail', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'about') return { page: 'about', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'career') return { page: 'career', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'blog') return { page: 'blog', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'ceo' || rawRoute === 'founder' || rawRoute === 'our-story') return { page: 'ceo', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'impact') return { page: 'impact', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'privacy-policy' || rawRoute === 'privacy') return { page: 'privacy-policy', adminSubRoute: 'default', isInvalidAdmin: false };
  if (rawRoute === 'terms' || rawRoute === 'terms-of-service') return { page: 'terms', adminSubRoute: 'default', isInvalidAdmin: false };

  const servicePages = ['executive-search', 'recruitment-solution', 'hr-consulting', 'learning-development'];
  if (servicePages.includes(rawRoute)) return { page: rawRoute, adminSubRoute: 'default', isInvalidAdmin: false };

  return { page: 'home', adminSubRoute: 'default', isInvalidAdmin: false };
}

function getInitialJobId(): string {
  const hash = window.location.hash.replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');
  if (hash.startsWith('job-')) {
    return hash.replace(/^job-/, '') || '1';
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path.startsWith('job-')) {
    return path.replace(/^job-/, '') || '1';
  }
  return '1';
}

export default function App() {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => getInitialJobId());

  const [routeState, setRouteState] = useState<RouteState>(() => parseCurrentRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      const state = parseCurrentRoute();
      if (state.isInvalidAdmin) {
        // Redirect invalid admin URL to public home page
        window.history.replaceState(null, '', '/');
        window.location.hash = '#home';
      }
      if (state.page === 'job-detail') {
        const hash = window.location.hash;
        if (hash.startsWith('#job-')) {
          setSelectedJobId(hash.replace('#job-', '') || '1');
        }
      }
      setRouteState(state);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    if (routeState.isInvalidAdmin) {
      window.history.replaceState(null, '', '/');
      window.location.hash = '#home';
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      window.history.pushState(null, '', '/');
      window.location.hash = '#home';
      setRouteState({ page: 'home', adminSubRoute: 'default', isInvalidAdmin: false });
      window.scrollTo(0, 0);
    } else {
      window.location.hash = `#${page}`;
      setRouteState({ page, adminSubRoute: 'default', isInvalidAdmin: false });
      window.scrollTo(0, 0);
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    window.location.hash = `#job-${jobId}`;
    setRouteState({ page: 'job-detail', adminSubRoute: 'default', isInvalidAdmin: false });
    window.scrollTo(0, 0);
  };

  const navigateAdminSubRoute = (subRoute: 'setup' | 'login' | 'dashboard') => {
    const adminRoute = getAdminPanelRoute();
    const path = `/${adminRoute}/${subRoute}`;
    window.history.pushState(null, '', path);
    window.location.hash = `#${adminRoute}/${subRoute}`;
    setRouteState({ page: 'admin', adminSubRoute: subRoute, isInvalidAdmin: false });
  };

  if (routeState.page === 'admin') {
    return (
      <AdminLayout
        subRoute={routeState.adminSubRoute}
        onNavigateSubRoute={navigateAdminSubRoute}
        onBackToPublic={() => handlePageChange('home')}
      />
    );
  }

  const isServicePage = ['executive-search', 'recruitment-solution', 'hr-consulting', 'learning-development'].includes(routeState.page);
  const isJobDetailPage = routeState.page === 'job-detail';

  return (
    <div className="relative min-h-screen bg-[#fcfbfa] flex flex-col overflow-x-hidden antialiased">
      {/* Dynamic Header & Sticky Navigation */}
      <Navbar currentPage={routeState.page} onPageChange={handlePageChange} />

      <main className="flex-1">
        {isJobDetailPage ? (
          <JobDetailPage key={selectedJobId} jobId={selectedJobId} onBack={() => handlePageChange('career')} />
        ) : routeState.page === 'about' ? (
          <AboutPage />
        ) : routeState.page === 'career' ? (
          <CareerPage />
        ) : routeState.page === 'blog' ? (
          <BlogPage />
        ) : routeState.page === 'ceo' ? (
          <CEOPage />
        ) : routeState.page === 'impact' ? (
          <OurImpactPage />
        ) : routeState.page === 'privacy-policy' ? (
          <PrivacyTermsPage title="Privacy Policy" />
        ) : routeState.page === 'terms' ? (
          <PrivacyTermsPage title="Terms & Conditions" />
        ) : isServicePage ? (
          <ServiceDetailsPage serviceType={routeState.page as any} />
        ) : (
          <>
            {/* Hero Banner Section */}
            <Hero />

            {/* Logo Band Horizonal Loop */}
            <TrustedCompanies />

            {/* Services & Detailed Features */}
            <Services onServiceSelect={handlePageChange} />

            {/* Vacancies / Job Listings Board */}
            <Vacancies onSelectJob={handleSelectJob} />

            {/* AI Resume Check Engine */}
            <ResumeSection />

            {/* Milestone Journey Wave Timeline */}
            <JourneyTimeline />

            {/* About / Why Choose Us Column Block */}
            <WhyChooseUs />

            {/* Professional Core Members Grid */}
            <Team />

            {/* Clients & Happy Testimonies Sliders */}
            <Testimonials />

            {/* Latest Blog Post Cards Spread */}
            <BlogCards />

            {/* Custom Form & Support Panel */}
            <Contact />
          </>
        )}
      </main>
      {/* Structured Footer Column Grid */}
      <Footer onPageChange={handlePageChange} />
      <Chatbot />
      <ConsentPopup />
    </div>
  );
}

