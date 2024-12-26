import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Container, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import axios, { AxiosError } from 'axios';

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setLoading(true);

    // Adiciona mensagem do usuário imediatamente
    setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(API_URL, { message: userMessage });
      
      // Adiciona resposta do assistente
      setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      // Tratamento de erro melhorado
      let errorMessage = 'Erro ao processar mensagem';
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          errorMessage = `Erro do servidor: ${axiosError.response.status}`;
        } else if (axiosError.request) {
          errorMessage = 'Erro de conexão: Servidor não respondeu';
        } else {
          errorMessage = 'Erro ao fazer requisição';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom>
          Chat com IA
        </Typography>
        
        <Box sx={{ mb: 3, maxHeight: '60vh', overflowY: 'auto' }}>
          {messages.map((message: Message, index: number) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: message.role === 'user' ? '#e3f2fd' : '#fff',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: message.role === 'user' ? 'primary.main' : 'secondary.main' }}
              >
                {message.role === 'user' ? 'Você' : 'Assistente'}
              </Typography>
              <Typography>{message.content}</Typography>
            </Box>
          ))}
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              sx={{ bgcolor: '#fff' }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !input.trim()}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default App;
