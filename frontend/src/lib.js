import { createTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

// Define your theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: '#000',
    },
    text: {
      primary: '#fff',
    },
  },
});

// Styled components
export const AppContainer = styled(Box)`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: #000;
`;

export const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: #000;
`;

export const Header = styled(Typography)`
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
`;

export const ChatSection = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #000;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ConversationContainer = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: #000;
`;

export const Message = styled(Box)`
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 0.5rem;
  background-color: #fff;
  color: #000;
`;

export const UserMessage = styled(Message)`
  align-self: flex-end;
  margin-left: auto;
`;

export const BotMessage = styled(Message)`
  align-self: flex-start;
`;

// Input Section styled component
export const InputSection = styled(Box)`
  display: flex;
  gap: 1rem;
  background-color: #000;
`;

// File Input Section styled component
export const FileInputSection = styled(Box)`
  margin-top: 2rem;
`;
