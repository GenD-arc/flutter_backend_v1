const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');

// routes for user cruds
const addUserRouter = require('./routes/superadmin/addUser');
const viewUsersRouter = require('./routes/superadmin/viewUsers');
const updateUserRouter = require('./routes/superadmin/updateUser');
const deleteUserRouter = require('./routes/superadmin/deleteUser');

//routes for resource cruds
const addResourceRouter = require('./routes/superadmin/addResource');
const viewResourceRouter = require('./routes/superadmin/viewResources');
const updateResourceRouter = require('./routes/superadmin/updateResource');
const deleteResourceRouter = require('./routes/superadmin/deleteResource');

const loginRouter = require('./routes/login');

app.use(express.static('public'));

app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for users
app.use('/api/superadmin/addUser', addUserRouter);
app.use('/api/superadmin/viewUsers', viewUsersRouter);
app.use('/api/superadmin/updateUser', updateUserRouter);
app.use('/api/superadmin/deleteUser', deleteUserRouter);

//for resources
app.use('/api/superadmin/addResources', addResourceRouter);
app.use('/api/superadmin/viewResources', viewResourceRouter);
app.use('/api/superadmin/updateResource', updateResourceRouter);
app.use('/api/superadmin/deleteResource', deleteResourceRouter);

//for login
app.use('/api/login', loginRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});