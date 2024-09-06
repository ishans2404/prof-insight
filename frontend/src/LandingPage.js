import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Divider,
  IconButton,
  TextField,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/system';
import ParticlesComponent from './particles';
import { Home, Chat, Analytics, Group, Support, KeyboardArrowDown } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  transition: 'background 0.3s ease-in-out',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#333',
  color: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0) translateX(-50%)',
    },
    '40%': {
      transform: 'translateY(-30px) translateX(-50%)',
    },
    '60%': {
      transform: 'translateY(-15px) translateX(-50%)',
    },
  },
}));

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
      <ParticlesComponent id="particles" />
      <StyledAppBar position="fixed" sx={{ bgcolor: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ProfInsight
          </Typography>
          <Button color="inherit" component={Link} to="/insights" sx={{ ml: 2, marginRight: "0.5rem" }}>
            Insights
          </Button>
          <SignedIn>
            <Button color="inherit" component={Link} to="/chat" sx={{ ml: 2, marginRight: "1rem" }}>
              Chat
            </Button>         
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button color="inherit">SignIn</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button color="inherit" sx={{ ml: 1 }}>SignUp</Button>
            </SignUpButton>
          </SignedOut>
        </Toolbar>
      </StyledAppBar>

      <HeroSection>
        <Fade in={true} timeout={1000}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to ProfInsight
          </Typography>
        </Fade>
        <Fade in={true} timeout={1500}>
          <Typography variant="h4" component="h2" gutterBottom>
            Your Platform for Academic Insights
          </Typography>
        </Fade>
        <Fade in={true} timeout={2000}>
          <Typography variant="h6" component="h3" gutterBottom>
            Discover, analyze, and enhance your academic journey with our comprehensive insights and tools.
          </Typography>
        </Fade>
        <Fade in={true} timeout={2500}>
          <Box>
            <SignedOut>
              <SignInButton mode="modal">
                <Button color="inherit" variant="contained" size="large" sx={{ mt: 4, bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' } }}>
                  Get Started 
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button color="inherit" component={Link} to="/chat" variant="contained" size="large" sx={{ mt: 4, bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' } }}>
                Start Chatting
              </Button>
            </SignedIn>
          </Box>
        </Fade>
        <ScrollDownButton onClick={scrollToFeatures}>
          <KeyboardArrowDown />
        </ScrollDownButton>
      </HeroSection>

      <Container sx={{ py: 8 }} id="features">
        <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            { title: 'Data Analysis', icon: <Analytics sx={{ fontSize: 60 }} />, description: 'In-depth analysis of academic data to help you make informed decisions.' },
            { title: 'Real-time Collaboration', icon: <Group sx={{ fontSize: 60 }} />, description: 'Collaborate with peers and professors in real-time.' },
            { title: 'AI-powered Insights', icon: <Support sx={{ fontSize: 60 }} />, description: 'Get personalized insights and recommendations powered by AI.' }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Zoom in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                <FeatureCard>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ my: 4 }} />

      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {[
            { name: 'John Doe', testimonial: 'ProfInsight has revolutionized the way I approach my academic research. The insights are incredibly detailed and useful.' },
            { name: 'Jane Smith', testimonial: 'The real-time collaboration feature has been a game-changer for group projects. Highly recommend!' },
            { name: 'Emily Johnson', testimonial: 'AI-powered recommendations have helped me find new areas to explore in my field of study.' }
          ].map((review, index) => (
            <Grid item xs={12} md={4} key={review.name}>
              <Fade in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                <Card sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                      {review.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      "{review.testimonial}"
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer>
        <Typography variant="body1">
          &copy; 2024 ProfInsight. All rights reserved.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button color="inherit" component={Link} to="/contact">
            Contact Us
          </Button>
          <Button color="inherit" component={Link} to="/about" sx={{ ml: 2 }}>
            About Us
          </Button>
          <Button color="inherit" component={Link} to="/privacy-policy" sx={{ ml: 2 }}>
            Privacy Policy
          </Button>
        </Box>
      </Footer>
    </Box>
  );
}

export default LandingPage;