import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from './projects';
import './App.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const organicTransition = { 
  duration: 1.4, 
  ease: [0.6, 0.01, -0.05, 0.95] 
};

// Refined Shutter Reveal
const shutterVariants = {
  hidden: { 
    clipPath: 'inset(49.9% 0% 49.9% 0%)',
    opacity: 1
  },
  visible: { 
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.76, 0, 0.24, 1],
      delay: 0.2 
    } 
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [expandingId, setExpandingId] = useState(null);

  const handleExpand = (id) => setExpandingId(id);

  return (
    <motion.main 
      className="scroll-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      exit={{ opacity: 1 }}
    >
      {projects.map((project) => (
        <section key={project.id} className="scroll-section">
          <div className="card-outer"> 
            <motion.div 
              variants={shutterVariants}
              layoutId={`card-${project.id}`}
              className={`image-wrapper ${expandingId === project.id ? 'is-expanding' : ''}`}
              onClick={() => handleExpand(project.id)}
              transition={organicTransition}
              // Force corner radius to animate separately from clip-path
              animate={{ 
                borderRadius: expandingId === project.id ? "0px" : "12px",
                // Ensure clipPath stays at 0% once revealed
                clipPath: expandingId === project.id ? 'inset(0% 0% 0% 0%)' : undefined 
              }}
              style={{ overflow: "hidden", background: "#eee" }}
              onLayoutAnimationComplete={() => {
                if (expandingId === project.id) {
                  navigate(`/project/${project.id}`);
                }
              }}
            >
              <motion.img 
                layoutId={`media-${project.id}`}
                src={project.poster} 
                transition={organicTransition}
                style={{ borderRadius: expandingId === project.id ? "0px" : "12px" }}
              />
            </motion.div>
            <motion.div 
              className="gallery-label"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              {project.title}
            </motion.div>
          </div>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="detail-hero">
        <motion.div 
          layoutId={`card-${project.id}`} 
          className="full-width-media"
          transition={organicTransition}
          style={{ borderRadius: "0px", overflow: "hidden", clipPath: 'inset(0% 0% 0% 0%)' }}
        >
          <motion.img 
            layoutId={`media-${project.id}`}
            src={project.poster}
            transition={organicTransition}
            style={{ borderRadius: "0px" }}
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

  const goHomeFresh = (e) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    setTimeout(() => {
      navigate('/');
      setIsNavigatingHome(false);
    }, 600);
  };

  return (
    <div className="porto-app">
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