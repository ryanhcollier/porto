import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from './projects';
import './App.css';

// Optimized spring for high-performance scaling
const transition = { 
  type: "spring", 
  stiffness: 100, 
  damping: 30, 
  mass: 1,
  restDelta: 0.001 
};

const Nav = () => {
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
    <main className="scroll-container" ref={scrollRef}>
      {projects.map((project) => (
        <section key={project.id} id={`section-${project.id}`} className="scroll-section">
          <motion.div 
            layoutId={`card-${project.id}`}
            className="image-wrapper"
            onClick={() => navigate(`/project/${project.id}`, { state: { fromId: project.id } })}
            transition={transition}
          >
            <motion.video 
              layoutId={`media-${project.id}`}
              src={project.video} 
              autoPlay muted loop playsInline
              transition={transition}
              /* Forces hardware acceleration */
              style={{ translateZ: 0 }}
            />
            <motion.div className="gallery-label">{project.title}</motion.div>
          </motion.div>
        </section>
      ))}
    </main>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));

  if (!project) return null;

  return (
    <motion.div 
      className="project-detail-view" 
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="detail-hero">
        <motion.div layoutId={`card-${id}`} className="full-width-media" transition={transition}>
          <motion.video 
            layoutId={`media-${id}`} 
            src={project.video} 
            autoPlay muted loop playsInline 
            transition={transition}
            style={{ translateZ: 0 }}
          />
        </motion.div>
      </section>

      <div className="detail-scroll-content">
        <header className="project-header">
          <div className="header-left">
            <h1 className="project-main-title">{project.title}</h1>
          </div>
          <div className="header-right">
            <p className="project-long-desc">{project.description}</p>
          </div>
        </header>
        <div className="project-media-grid">
           <div className="media-row">
            <div className="media-col"><div className="placeholder-media"></div></div>
            <div className="media-col"><div className="placeholder-media"></div></div>
          </div>
        </div>
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