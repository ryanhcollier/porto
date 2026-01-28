import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from './projects';
import './App.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const fluidTransition = { 
  duration: 1.1, 
  ease: [0.7, 0, 0.3, 1] 
};

// Staggered entry for initial landing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
  const navigate = useNavigate();
  const [expandingId, setExpandingId] = useState(null);

  const handleExpand = (id) => {
    setExpandingId(id);
  };

  return (
    <motion.main 
      className="scroll-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 1 }}
      transition={{ duration: 0 }}
    >
      {projects.map((project) => (
        <section key={project.id} className="scroll-section">
          <motion.div 
            variants={itemVariants}
            layoutId={`card-${project.id}`}
            className={`image-wrapper ${expandingId === project.id ? 'is-expanding' : ''}`}
            onClick={() => handleExpand(project.id)}
            transition={fluidTransition}
            onLayoutAnimationComplete={() => {
              if (expandingId === project.id) {
                navigate(`/project/${project.id}`);
              }
            }}
          >
            <motion.img 
              layoutId={`media-${project.id}`}
              src={project.poster} 
              transition={fluidTransition}
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
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) return null;

  return (
    <motion.div 
      className="project-detail-view"
      initial={{ opacity: 0 }} // Fade in to cover the home fresh
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="detail-hero">
        <motion.div 
          layoutId={`card-${project.id}`} 
          className="full-width-media"
          transition={fluidTransition} 
        >
          <motion.img 
            layoutId={`media-${project.id}`}
            src={project.poster}
            transition={fluidTransition}
          />
        </motion.div>
      </section>

      <div className="detail-scroll-content">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  // Handle Title link click for fresh load
  const goHomeFresh = (e) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    setTimeout(() => {
      navigate('/');
      setIsNavigatingHome(false);
    }, 600); // Wait for white fade
  };

  return (
    <div className="porto-app">
      {/* Global White Fade Overlay */}
      <AnimatePresence>
        {isNavigatingHome && (
          <motion.div 
            className="global-fade-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <nav className="porto-nav">
        <a href="/" className="title" onClick={goHomeFresh}>REIL STUDIO</a>
        <div className="info-link">INFO</div>
      </nav>

      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}