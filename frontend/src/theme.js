import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4568dc',
      light: '#7a95e5',
      dark: '#2a4cb3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#b06ab3',
      light: '#c595c7',
      dark: '#8c4790',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(69, 104, 220, 0.08)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(69, 104, 220, 0.04)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(69, 104, 220, 0.08)',
          },
        },
      },
    },
  },
});

export default theme;


// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#00FFD1',             // Neon Aqua Green
//       contrastText: '#001F1D',
//     },
//     secondary: {
//       main: '#6C63FF',             // Soft neon purple-blue
//       contrastText: '#FFFFFF',
//     },
//     background: {
//       default: '#1E1F25',          // Sleek dark slate, not full black
//       paper: '#2A2B32',            // Elevated slightly with cool gray
//     },
//     text: {
//       primary: '#E0E0E0',
//       secondary: '#A5A5A5',
//     },
//   },
//   typography: {
//     fontFamily: '"Poppins", "Orbitron", "Roboto", sans-serif',
//     h1: {
//       fontWeight: 700,
//       letterSpacing: '0.05rem',
//       textTransform: 'uppercase',
//     },
//     h2: { fontWeight: 600 },
//     h3: { fontWeight: 600 },
//     h4: { fontWeight: 600 },
//     h5: { fontWeight: 500 },
//     h6: { fontWeight: 500 },
//     button: {
//       textTransform: 'uppercase',
//       fontWeight: 600,
//       letterSpacing: '0.03rem',
//     },
//   },
//   shape: {
//     borderRadius: 10,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           transition: '0.3s ease-in-out',
//           '&:hover': {
//             boxShadow: '0 0 10px rgba(0, 255, 209, 0.6)',
//             transform: 'scale(1.02)',
//           },
//         },
//         containedSecondary: {
//           '&:hover': {
//             boxShadow: '0 0 12px rgba(108, 99, 255, 0.5)',
//           },
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           background: 'linear-gradient(90deg, #2a2b32, #1e1f25)',
//           boxShadow: '0 0 12px rgba(0,255,209,0.2)',
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           background: 'linear-gradient(145deg, #2d2f36, #1f2027)',
//           boxShadow: '0 8px 24px rgba(0,255,209,0.05)',
//           border: '1px solid rgba(255,255,255,0.04)',
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#2A2B32',
//         },
//       },
//     },
//     MuiTableCell: {
//       styleOverrides: {
//         head: {
//           backgroundColor: '#1E1F25',
//           color: '#00FFD1',
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiTableRow: {
//       styleOverrides: {
//         root: {
//           '&:hover': {
//             backgroundColor: 'rgba(0,255,209,0.04)',
//           },
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           '&:hover': {
//             backgroundColor: 'rgba(108, 99, 255, 0.1)',
//           },
//         },
//       },
//     },
//   },
// });

// export default theme;
