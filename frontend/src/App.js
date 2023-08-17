import './App.css';
import End  from './pages/End';
import Welcome from './pages/Welcome';
import { Capture } from './photo/Capture';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoChat from './video/VideoChat';

function App() {


  return (
    <>
      <Router>
        {/* <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/capture" element={<Capture />}  />
          <Route path="/end" element={<End />}  />
          <Route path="/video" element={<VideoChat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
