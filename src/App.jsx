import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from './projects';
import './App.css';

// Ensure scroll starts at top on route change
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const organicTransition = { 
  duration: 1.4, 
  ease: [0.6, 0.01, -0.05, 0.95] 
};

// Mask/Shutter Reveal Variants
const shutterVariants = {
  hidden: { clipPath: 'inset(49.9% 0% 49.9% 0%)' },
  visible: { 
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
  }
};

const ContentTier = ({ type, items }) => (
  <div className={`content-tier tier-${type}`}>
    {items.map((item, index) => (
      <div key={index} className="tier-item">
        {item.type === 'image' ? (
          <img src={item.src} alt="Project Detail" />
        ) : (
          <div className="tier-text">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        )}
      </div>
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [expandingId, setExpandingId] = useState(null);

  return (
    <motion.main className="scroll-container" exit={{ opacity: 1 }}>
      {projects.map((project) => (
        <section key={project.id} className="scroll-section">
          <div className="card-outer">
            <motion.div 
              variants={shutterVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              layoutId={`card-${project.id}`}
              className={`image-wrapper ${expandingId === project.id ? 'is-expanding' : ''}`}
              onClick={() => setExpandingId(project.id)}
              transition={organicTransition}
              // Animate corner radius from 12px to 0px
              animate={{ borderRadius: expandingId === project.id ? "0px" : "12px" }}
              onLayoutAnimationComplete={() => {
                if (expandingId === project.id) navigate(`/project/${project.id}`);
              }}
            >
              <motion.img 
                layoutId={`media-${project.id}`}
                src={project.poster} 
                transition={organicTransition}
                animate={{ borderRadius: expandingId === project.id ? "0px" : "12px" }}
              />
            </motion.div>
            <motion.div 
              className="gallery-label" 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 1.2 }}
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!project) return null;

  return (
    <motion.div className="project-detail-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="detail-hero">
        <motion.div layoutId={`card-${project.id}`} className="full-width-media" transition={organicTransition}>
          <motion.img layoutId={`media-${project.id}`} src={project.poster} transition={organicTransition} />
        </motion.div>
      </section>

      <motion.div 
        className="detail-body" 
        initial={{ opacity: 0, y: 40 }} 
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <header className="project-intro">
          <h1>{project.title}</h1>
          <p className="project-desc">{project.description}</p>
        </header>

        <div className="project-grid">
          {project.content?.map((tier, index) => (
            <ContentTier key={index} type={tier.type} items={tier.items} />
          ))}
        </div>
      </motion.div>
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