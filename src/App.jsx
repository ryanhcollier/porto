import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
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

const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1] } 
  }
};

const ContentTier = ({ type, items }) => (
  <motion.div 
    className={`content-tier tier-${type}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10% 0px" }}
    variants={revealVariants}
  >
    {items.map((item, index) => (
      <div key={index} className="tier-item">
        {item.type === 'image' ? (
          <img src={item.src} alt="Project Detail" loading="lazy" />
        ) : item.type === 'video' ? (
          <video src={item.src} autoPlay muted loop playsInline disablePictureInPicture />
        ) : (
          <div className="tier-text">
            {item.title && <h3>{item.title}</h3>}
            <p>{item.body}</p>
          </div>
        )}
      </div>
    ))}
  </motion.div>
);

const Info = () => (
  <motion.div 
    className="info-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    <section className="info-intro">
      <h1>
        With 18 years of creative experience, my strength lies in versatility—moving seamlessly from concept to execution, while embracing new technologies that expand what's possible.
      </h1>
    </section>

    <section className="info-contact">
      <div className="contact-col">
        <h4>CONTACT:</h4>
        <p>Ryan Collier</p>
        <p>ryanhcollier@gmail.com</p>
        <p>New York City</p>
        <div className="social-links">
          <p>Instagram: @ryanhcollier</p>
          <p>Github: ryanhcollier</p>
        </div>
      </div>
    </section>

    <hr className="info-divider" />

    <section className="info-lists">
      <div className="info-column">
        <h4>CREATIVE TOOLS</h4>
        <ul>
          <li>Adobe Creative Suite</li>
          <li>Blender</li>
          <li>Figma</li>
          <li>Code (HTML, CSS, Python, Swift, JS)</li>
          <li>AI (Gemini, Midjourney, Runway, Flux)</li>
          <li>Microsoft 365 / Google Apps</li>
        </ul>
      </div>
      <div className="info-column">
        <h4>PREVIOUS STUDIOS</h4>
        <ul>
          <li>Google Creative Lab</li>
          <li>Red Antler</li>
          <li>Gretel</li>
          <li>Mother New York</li>
          <li>Radical Media</li>
          <li>Studio Mega</li>
        </ul>
      </div>
      <div className="info-column">
        <h4>PREVIOUS CLIENTS</h4>
        <ul>
          <li>Nike</li>
          <li>The White House</li>
          <li>Google</li>
          <li>Adidas</li>
          <li>Jack Henry</li>
          <li>American Express</li>
        </ul>
      </div>
    </section>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [expandingId, setExpandingId] = useState(null);

  const shutterVariants = {
    hidden: { clipPath: 'inset(49.9% 0% 49.9% 0%)' },
    visible: { 
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
    }
  };

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
              animate={{ borderRadius: expandingId === project.id ? "0px" : "12px" }}
              onLayoutAnimationComplete={() => {
                if (expandingId === project.id) navigate(`/project/${project.id}`);
              }}
            >
              <motion.img 
                layoutId={`media-${project.id}`} 
                src={project.poster} 
                transition={organicTransition} 
              />
            </motion.div>
            <motion.div className="gallery-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }}>
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
  useEffect(() => { window.scrollTo(0, 0); }, []);
  if (!project) return null;

  return (
    <motion.div 
      className="project-detail-view"
      initial={{ backgroundColor: "rgba(255,255,255,0)" }}
      animate={{ backgroundColor: "rgba(255,255,255,1)" }}
      transition={{ duration: 0.1 }}
    >
      <section className="detail-hero">
        <motion.div 
          layoutId={`card-${project.id}`} 
          className="full-width-media"
          transition={organicTransition}
        >
          <motion.img 
            layoutId={`media-${project.id}`} 
            src={project.poster} 
            transition={organicTransition} 
          />
        </motion.div>
      </section>
      <motion.div 
        className="detail-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
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

  return (
    <div className="porto-app">
      <nav className="porto-nav">
        <Link to="/" className="title">REIL STUDIO</Link>
        <Link to="/info" className="info-link">INFO</Link>
      </nav>
      {/* mode="popLayout" is critical to prevent the flash */}
      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}