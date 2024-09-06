import React, { useState } from 'react';
import ParticlesComponent from './particles';
import { ThemeProvider } from '@mui/material/styles';
import { Button, CircularProgress, TextField, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { theme, AppContainer, MainContent, ChatSection, ConversationContainer, UserMessage, BotMessage, InputSection } from './lib';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import styled from 'styled-components';

// Function to render Markdown safely
const renderMarkdown = (markdownText) => {
  const html = marked(markdownText);
  const sanitizedHtml = DOMPurify.sanitize(html);
  return { __html: sanitizedHtml };
};

function Chat() {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('url', url || '');

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setUrl('');
        alert('Content uploaded and processed successfully');
      } else {
        alert('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error uploading content:', error);
      alert('Error uploading content. Please try again.');
    }
    setIsUploading(false);
    setDialogOpen(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    setConversation([...conversation, { type: 'user', text: question }]);

    try {
      const response = await axios.post('https://ishans24-profinsightbackend.hf.space/ask', { question });
      if (response.status === 200) {
        setConversation([...conversation, 
          { type: 'user', text: question },
          { type: 'bot', text: response.data.answer }
        ]);
      } else {
        setConversation([...conversation,
          { type: 'user', text: question },
          { type: 'bot', text: 'Unexpected response from server.' }
        ]);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setConversation([...conversation,
        { type: 'user', text: question },
        { type: 'bot', text: 'Sorry, an error occurred while processing your question.' }
      ]);
    }

    setQuestion('');
    setIsAsking(false);
  };

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'none',
    transition: 'background 0.3s ease-in-out',
  }));

  return (
    <SignedIn>
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ParticlesComponent id="particles" />
        <StyledAppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', color: '#fff' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                        <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            color: 'inherit',
                            '&:hover': {
                            textDecoration: 'none',
                            },
                        }}
                        >
                        ProfInsight
                        </Typography>
                    </Link>
                    </Box>
                    <SignedIn>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/insights"
                            sx={{
                            ml: 2,
                            marginRight: "1rem",
                            transform: 'translateY(-1px)',
                            }}
                        >
                            Insights
                        </Button>
                        <UserButton sx={{ transform: 'translateY(2px)' }} />
                    </Box>
                </SignedIn>
            </Toolbar>
        </StyledAppBar>
        <MainContent>
          <ChatSection>
            <ConversationContainer>
              {conversation.map((item, index) => (
                item.type === 'user' ? (
                  <UserMessage key={index}>
                    <Typography>{item.text}</Typography>
                  </UserMessage>
                ) : (
                  <BotMessage key={index}>
                    <div dangerouslySetInnerHTML={renderMarkdown(item.text)} />
                  </BotMessage>
                )
              ))}
            </ConversationContainer>
            <InputSection>
              <TextField
                fullWidth
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question"
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                sx={{
                  backgroundColor: '#000',
                  '& input': {
                    color: '#fff',
                  },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#000',
                    borderRadius: '10px',
                    transition: 'box-shadow 0.3s ease-in-out, border-radius 0.3s ease-in-out',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'border-color 0.3s ease-in-out',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover': {
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAsk}
                disabled={isAsking}
                endIcon={isAsking ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  borderRadius: '12px',
                }}
              >
                Ask
              </Button>
            </InputSection>
          </ChatSection>
        </MainContent>

        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          PaperProps={{
            sx: {
              backgroundColor: '#000',
              padding: '1rem',
              color: '#fff',
              borderRadius: '20px',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
              transition: 'box-shadow 0.3s ease-in-out, border-radius 0.3s ease-in-out',
              width: '80%',
              maxWidth: '1000px',
              height: '25%',
              maxHeight: '600px',
              '&:hover': {
                boxShadow: '0 0 50px rgba(255, 255, 255, 0.5)',
              },
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff' }}>Submit URL</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL here"
              sx={{
                input: { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              color="primary"
              disabled={isUploading}
            >
              {isUploading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

      </AppContainer>
    </ThemeProvider>
    </SignedIn>
  );
}

export default Chat;
