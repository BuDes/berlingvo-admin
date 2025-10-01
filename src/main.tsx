import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./assets/styles/global.scss"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { setDefaultOptions } from 'date-fns'
import { id } from 'date-fns/locale'

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#6E8FC4",
    }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: ".9rem"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: ".9rem"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        autoComplete: 'off',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    },
  }
})

setDefaultOptions({ locale: id })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
