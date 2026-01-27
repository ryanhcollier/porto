import React from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from './projects'; 
import './App.css';

const transition = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

const Nav = () => (
  <nav className="porto-nav">
    <Link to="/" className="title">REIL STUDIO</Link>
    <div className="info-link">
      <a href="https://reil.studio/info" target="_blank" rel="noopener noreferrer">INFO</a>
    </div>
  </nav>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <main className="scroll-container">
      {projects.map((project) => (
        <section key={project.id} className="scroll-section">
          <motion.div 
            layoutId={`card-${project.id}`}
            className="image-wrapper"
            onClick={() => navigate(`/project/${project.id}`)}
            transition={transition}
          >
            <motion.video 
              layoutId={`media-${project.id}`}
              src={project.video} 
              autoPlay muted loop playsInline
              transition={transition}
            />
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
    <motion.div className="project-detail-view" initial={false} animate={{ opacity: 1 }}>
      <div className="detail-hero">
        <motion.div layoutId={`card-${id}`} className="full-image-container" transition={transition}>
          <motion.video layoutId={`media-${id}`} src={project.video} autoPlay muted loop playsInline transition={transition} />
        </motion.div>
      </div>
      <div className="detail-content">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div className="spacer"></div>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="porto-app">
      <Nav />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}