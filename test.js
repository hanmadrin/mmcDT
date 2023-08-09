const jwt = require('jsonwebtoken');
require('dotenv').config();
const token = jwt.sign({ id: 10}, process.env.SECRET_KEY);
console.log(token)

const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5MDc0NzIwNX0.IXNisNQKfYrRxPUZi6-ybJKDzNdSPMDK49LdxxcBtZc', process.env.SECRET_KEY);
console.log(decoded)