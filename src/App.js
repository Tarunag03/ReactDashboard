import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Button, Drawer, List, ListItem, ListItemText, Container, Box, TextField, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGrid', col2: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Great' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
};

const App = () => {
  const [theme, setTheme] = useState(createTheme({
    palette: {
      mode: 'light',
    },
  }));

  const [kanban, setKanban] = useState([
    { id: 'item-1', content: 'First task' },
    { id: 'item-2', content: 'Second task' },
    { id: 'item-3', content: 'Third task' },
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleTheme = () => {
    setTheme((prevTheme) => createTheme({
      palette: {
        mode: prevTheme.palette.mode === 'light' ? 'dark' : 'light',
      },
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(kanban);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setKanban(items);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setKanban([...kanban, { id: `item-${kanban.length + 1}`, content: newTask }]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (id) => {
    setKanban(kanban.filter(item => item.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
        <Toolbar style={{ justifyContent: 'center' }}>
  <Typography variant="h6">
    Tarun's Dashboard
  </Typography>
</Toolbar>
        </AppBar>
        <Drawer variant="permanent" anchor="left">
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/tables">
              <ListItemText primary="Tables" />
            </ListItem>
            <ListItem button component={Link} to="/charts">
              <ListItemText primary="Charts" />
            </ListItem>
            <ListItem button component={Link} to="/calendar">
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem button component={Link} to="/kanban">
              <ListItemText primary="Kanban" />
            </ListItem>
          </List>
        </Drawer>
        <main style={{ marginLeft: 240, padding: '20px' }}>
          <Button variant="contained" onClick={toggleTheme}>
            Toggle Theme
          </Button>
          <Routes>
            <Route path="/" element={<div>Dashboard Content</div>} />
            <Route path="/tables" element={
              <Container>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid rows={rows} columns={columns} pageSize={5} />
                </div>
              </Container>
            } />
            <Route path="/charts" element={
              <Container>
                <Line data={chartData} />
              </Container>
            } />
            <Route path="/calendar" element={
              <Container>
                <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
              </Container>
            } />
            <Route path="/kanban" element={
              <Container>
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    label="New Task"
                    variant="outlined"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" color="primary" onClick={handleAddTask} style={{ marginLeft: '10px' }}>
                    Add Task
                  </Button>
                </Box>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {kanban.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                p={2}
                                mb={2}
                                bgcolor="background.paper"
                                borderRadius={2}
                                boxShadow={1}
                                display="flex"
                                justifyContent="space-between"
                              >
                                {item.content}
                                <IconButton onClick={() => handleDeleteTask(item.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Container>
            } />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
