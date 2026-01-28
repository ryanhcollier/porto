import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { projects } from './projects';
import './App.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const sharedTransition = { type: "spring", stiffness: 160, damping: 26, mass: 0.8 };

const Nav = () => {
  // Restore dynamic NYC time logic
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { 
    timeZone: "America/New_York", hour12: false, hour: '2-digit', minute: '2-digit' 
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { 
        timeZone: "America/New_York", hour12: false, hour: '2-digit', minute: '2-digit' 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="porto-nav">
      <Link to="/" className="title">REIL STUDIO</Link>
      <div className="ny-time">{time} NYC</div>
      <div className="info-link">
        <a href="https://reil.studio/info" target="_blank" rel="noopener noreferrer">INFO</a>
      </div>
    </nav>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const fromId = location.state?.fromId;
    if (fromId && scrollRef.current) {
      requestAnimationFrame(() => {
        const element = document.getElementById(`section-${fromId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      });
    }
  }, [location]);

  return (
    <motion.main 
      className="scroll-container" 
      ref={scrollRef}
      exit={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
    >
      {projects.map((project) => (
        <section key={project.id} id={`section-${project.id}`} className="scroll-section">
          <motion.div 
            layoutId={`card-${project.id}`}
            className="image-wrapper"
            onClick={() => navigate(`/project/${project.id}`, { state: { fromId: project.id } })}
            transition={sharedTransition}
          >
            <motion.video 
              layoutId={`media-${project.id}`}
              src={project.video} 
              autoPlay muted loop playsInline
              transition={sharedTransition}
            />
            <div className="gallery-label">{project.title}</div>
          </motion.div>
        </section>
      ))}
    </motion.main>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));
  const isPresent = useIsPresent();

  if (!project) return null;

  return (
    <motion.div 
      className="project-detail-view" 
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <section className="detail-hero">
        <motion.div 
          layoutId={isPresent ? `card-${id}` : null} 
          className="full-width-media"
          transition={sharedTransition}
        >
          <motion.video 
            layoutId={isPresent ? `media-${id}` : null} 
            src={project.video} 
            autoPlay muted loop playsInline 
            transition={sharedTransition}
          />
        </motion.div>
      </section>

      <div className="detail-scroll-content">
        <header className="project-header">
          <h1 className="project-main-title">{project.title}</h1>
          <p className="project-long-desc">{project.description}</p>
        </header>
      </div>
    </motion.div>
  );
};

export default function App() {
  const location = useLocation();
  return (
    <div className="porto-app">
      <Nav />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}